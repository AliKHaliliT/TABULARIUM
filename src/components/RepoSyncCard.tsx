import { useState } from "react";
import {
  CloudDownload,
  CloudUpload,
  GitBranch,
  Link2,
  Loader2,
  Unplug,
} from "lucide-react";
import type { RepoConfig } from "@/services/githubClient";
import {
  adoptRemote,
  clearRepoConnection,
  fetchLatest,
  loadRepoConfig,
  loadRepoState,
  planSync,
  pushLocal,
  saveRepoConfig,
  validateVitaRepo,
  type Resolution,
  type SyncPlan,
} from "@/services/repoSync";
import { useContent } from "@/context/ContentContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Busy = null | "connect" | "fetch" | "push" | "adopt";

const inputCls =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-signal";

const fileLabel = (path: string) => path.replace(/^src\/content\//, "");

/**
 * The repository connection: git as the panel's backend. Fetch and push run a
 * per-file three-way merge against the connected VITA repo; files both sides
 * changed surface here as explicit conflicts resolved one by one.
 */
export const RepoSyncCard = () => {
  const { refresh } = useContent();
  const [cfg, setCfg] = useState<RepoConfig | null>(loadRepoConfig);
  const [hasBase, setHasBase] = useState<boolean>(() => loadRepoState() !== null);
  const [form, setForm] = useState({ owner: "", repo: "", branch: "main", token: "" });
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<{ plan: SyncPlan; mode: "fetch" | "push" } | null>(null);
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>({});
  const [message, setMessage] = useState("Update content from TABULARIUM");
  const [confirmAdopt, setConfirmAdopt] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const run = async (kind: Busy, work: () => Promise<string | null>) => {
    setBusy(kind);
    setError(null);
    setNotice(null);
    try {
      const note = await work();
      if (note) setNotice(note);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const connect = () =>
    run("connect", async () => {
      const next: RepoConfig = {
        owner: form.owner.trim(),
        repo: form.repo.trim(),
        branch: form.branch.trim() || "main",
        token: form.token.trim(),
      };
      if (!next.owner || !next.repo || !next.token) {
        throw new Error("Owner, repository, and token are all required.");
      }
      await validateVitaRepo(next);
      saveRepoConfig(next);
      setCfg(next);
      return "Connected. Pick a starting direction below.";
    });

  const doAdopt = () =>
    run("adopt", async () => {
      const plan = await planSync(cfg!, { assumeBase: "remote" });
      const result = await adoptRemote(cfg!, plan);
      setHasBase(true);
      refresh();
      return `Fetched ${result.applied} files; the repository is now the record.`;
    });

  const doInitialPush = () =>
    run("push", async () => {
      const plan = await planSync(cfg!, { assumeBase: "remote" });
      if (!plan.localChanges.length && !plan.localDeletions.length) {
        setHasBase(true);
        return "Repository already matches this record.";
      }
      const result = await pushLocal(cfg!, plan, {}, message);
      setHasBase(true);
      return `Pushed ${plan.localChanges.length + plan.localDeletions.length} files (${result.pushedSha?.slice(0, 7)}).`;
    });

  const doFetch = () =>
    run("fetch", async () => {
      const plan = await planSync(cfg!);
      if (plan.conflicts.length) {
        setResolutions({});
        setPendingPlan({ plan, mode: "fetch" });
        return null;
      }
      const result = await fetchLatest(cfg!, plan, {});
      refresh();
      return result.applied
        ? `Fetched ${result.applied} changed files.`
        : "Already up to date.";
    });

  const doPush = () =>
    run("push", async () => {
      const plan = await planSync(cfg!);
      if (plan.conflicts.length) {
        setResolutions({});
        setPendingPlan({ plan, mode: "push" });
        return null;
      }
      if (!plan.localChanges.length && !plan.localDeletions.length) {
        return "Nothing to push.";
      }
      const result = await pushLocal(cfg!, plan, {}, message);
      return `Pushed ${plan.localChanges.length + plan.localDeletions.length} files (${result.pushedSha?.slice(0, 7)}).`;
    });

  const applyResolutions = () =>
    run(pendingPlan!.mode, async () => {
      const { plan, mode } = pendingPlan!;
      const result =
        mode === "fetch"
          ? await fetchLatest(cfg!, plan, resolutions)
          : await pushLocal(cfg!, plan, resolutions, message);
      setPendingPlan(null);
      refresh();
      return mode === "fetch"
        ? `Fetched with ${plan.conflicts.length} conflicts resolved.`
        : `Pushed with ${plan.conflicts.length} conflicts resolved (${result.pushedSha?.slice(0, 7) ?? "no commit"}).`;
    });

  const disconnect = () => {
    clearRepoConnection();
    setCfg(null);
    setHasBase(false);
    setPendingPlan(null);
    setNotice("Disconnected. The local record stays as it is.");
  };

  const allResolved =
    pendingPlan !== null &&
    pendingPlan.plan.conflicts.every((c) => resolutions[c.path] !== undefined);

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <GitBranch size={16} className="text-[var(--color-text-secondary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Repository connection
          </h2>
        </div>
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">
          Connect the panel to your VITA site repository and git becomes the backend: fetch
          pulls the seed files into this record, push commits your edits back, and files
          changed on both sides come back as conflicts you resolve one by one. The
          connection needs a fine-grained personal access token with read and write on
          Contents for that one repository; it is stored only in this browser.
        </p>
      </div>

      {!cfg ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className={inputCls}
            placeholder="Owner (e.g. AliKHaliliT)"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Repository (e.g. AliKHaliliT)"
            value={form.repo}
            onChange={(e) => setForm({ ...form, repo: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Branch"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          />
          <input
            className={inputCls}
            type="password"
            placeholder="Fine-grained token (Contents: read/write)"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
          />
          <button
            onClick={connect}
            disabled={busy !== null}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-span-2"
          >
            {busy === "connect" ? <Loader2 size={15} className="animate-spin" /> : <Link2 size={15} />}
            Connect and validate
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
            <span className="rounded border border-[var(--color-border-strong)] px-2 py-1">
              {cfg.owner}/{cfg.repo} · {cfg.branch}
            </span>
            <span>{hasBase ? `base: ${loadRepoState()?.fetchedAt.slice(0, 16).replace("T", " ") ?? ""}` : "no sync yet"}</span>
          </div>

          {!hasBase ? (
            <div className="space-y-2 rounded-lg border border-dashed border-[var(--color-border-strong)] p-4">
              <p className="m-0 text-sm text-[var(--color-text-secondary)]">
                First sync: pick which side is the record right now.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConfirmAdopt(true)}
                  disabled={busy !== null}
                  className="flex items-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <CloudDownload size={15} /> Use the repository (replace this record)
                </button>
                <button
                  onClick={doInitialPush}
                  disabled={busy !== null}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
                >
                  <CloudUpload size={15} /> Use this record (push it to the repository)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={doFetch}
                  disabled={busy !== null || pendingPlan !== null}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
                >
                  {busy === "fetch" ? <Loader2 size={15} className="animate-spin" /> : <CloudDownload size={15} />}
                  Fetch latest
                </button>
                <button
                  onClick={doPush}
                  disabled={busy !== null || pendingPlan !== null}
                  className="flex items-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {busy === "push" ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
                  Push changes
                </button>
                <input
                  className={`${inputCls} min-w-52 flex-1`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Commit message"
                  aria-label="Commit message"
                />
              </div>
            </div>
          )}

          {pendingPlan && (
            <div className="space-y-3 rounded-lg border border-signal/60 p-4">
              <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
                {pendingPlan.plan.conflicts.length} file
                {pendingPlan.plan.conflicts.length === 1 ? "" : "s"} changed on both sides.
                Choose per file, then apply.
              </p>
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {pendingPlan.plan.conflicts.map((c) => (
                  <div key={c.path} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate font-mono text-xs text-[var(--color-text-primary)]">
                      {fileLabel(c.path)}
                      {c.kind !== "edit" && (
                        <span className="ml-2 text-[var(--color-text-secondary)]">
                          ({c.kind === "local-delete" ? "deleted here, edited there" : "edited here, deleted there"})
                        </span>
                      )}
                    </span>
                    <span className="flex gap-1">
                      {(["mine", "theirs"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setResolutions((prev) => ({ ...prev, [c.path]: r }))}
                          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                            resolutions[c.path] === r
                              ? "bg-[var(--color-text-primary)] text-[var(--color-background)]"
                              : "border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-signal"
                          }`}
                        >
                          {r === "mine" ? "Keep mine" : "Take theirs"}
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyResolutions}
                  disabled={!allResolved || busy !== null}
                  className="rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Apply resolutions
                </button>
                <button
                  onClick={() => setPendingPlan(null)}
                  className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-signal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setConfirmDisconnect(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-signal"
          >
            <Unplug size={13} /> Disconnect (keeps the local record)
          </button>
        </>
      )}

      {error && <p className="m-0 text-sm text-red-500">{error}</p>}
      {notice && <p className="m-0 text-sm text-signal">{notice}</p>}

      <ConfirmDialog
        open={confirmAdopt}
        title="Replace this record?"
        message="Everything in the panel (content, profile, site identity, palette) is replaced by the repository's seed files. Local edits that were never pushed or downloaded are gone for good."
        confirmLabel="Replace from repository"
        onConfirm={() => {
          setConfirmAdopt(false);
          void doAdopt();
        }}
        onCancel={() => setConfirmAdopt(false)}
      />
      <ConfirmDialog
        open={confirmDisconnect}
        title="Disconnect the repository?"
        message="The connection and its token are removed from this browser. Your record stays exactly as it is; reconnecting later starts with a fresh first sync."
        confirmLabel="Disconnect"
        onConfirm={() => {
          setConfirmDisconnect(false);
          disconnect();
        }}
        onCancel={() => setConfirmDisconnect(false)}
      />
    </div>
  );
};
