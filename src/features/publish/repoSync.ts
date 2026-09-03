// Sync between the panel's localStorage record and the connected VITA repo,
// with git as the backend. The model is a plain three-way merge per file:
// the last-fetched blob sha is the base, the serialized local record is ours,
// the branch head is theirs. Files only one side touched sync silently; files
// both sides touched become explicit conflicts the owner resolves per file
// (keep mine or take theirs). Nothing here ever force-pushes.

import frontMatter from "front-matter";
import {
  commitFiles,
  getBlobText,
  getHead,
  getTreeFiles,
  gitBlobSha,
  type RepoConfig,
} from "@/shared/api";
import { buildContentEntries, TYPE_DIRS } from "./bundle";
import { ContentService, markdownFileName, type AnyContentItem, type UserSettings } from "@/entities/record";
import { PORTFOLIO_CONTENT_TYPES, type PortfolioContentType } from "./contract";
import { isSiteIdentity, saveStoredSite, applyPalette, saveStoredPalette, type StoredPalette } from "@/entities/site";
import { safeSetItem } from "@/shared/lib";

const CONFIG_KEY = "os_repo_config";
const STATE_KEY = "os_repo_state";
const CONTENT_PREFIX = "src/content/";

/** What the last fetch or push saw, which is the base of the next three-way merge. */
export interface RepoState {
  headSha: string;
  /** path → blob sha at the last fetch/push: the merge base. */
  files: Record<string, string>;
  fetchedAt: string;
}

/** One file both sides changed since the recorded base. */
export interface Conflict {
  path: string;
  /** How the two sides diverged; "edit" is the plain both-changed case. */
  kind: "edit" | "local-delete" | "remote-delete";
}

/** How a conflict is settled: keep what is here, or take what the branch has. */
export type Resolution = "mine" | "theirs";

/** What a sync would do: the silent changes, and the conflicts needing a choice. */
export interface SyncPlan {
  head: { commitSha: string; treeSha: string };
  remote: Record<string, string>;
  local: Record<string, { content: string; sha: string }>;
  base: Record<string, string>;
  conflicts: Conflict[];
  /** Paths the remote side settles (fetch applies them; push leaves them). */
  remoteChanges: string[];
  /** Local changes and deletions a push would commit. */
  localChanges: string[];
  localDeletions: string[];
}

// --- config + state ---------------------------------------------------------

/**
 * Reads the stored repository connection, token included.
 *
 * @returns The connection, or null when none is saved. The token lives only in
 *   this browser and never leaves it except as a request header.
 */
export function loadRepoConfig(): RepoConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw) as RepoConfig;
    return cfg.owner && cfg.repo && cfg.branch && cfg.token ? cfg : null;
  } catch {
    return null;
  }
}

/**
 * Stores a repository connection for this browser.
 *
  * @param cfg - The repository coordinates and the token to authorize with.
 *
 * @returns Nothing.
 */
export function saveRepoConfig(cfg: RepoConfig): void {
  safeSetItem(CONFIG_KEY, JSON.stringify(cfg));
}

/**
 * Forgets the repository connection and everything remembered about its state.
 *
 * @returns Nothing.
 */
export function clearRepoConnection(): void {
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(STATE_KEY);
}

/**
 * Reads the recorded base state of the connected repository.
 *
 * @returns The last seen state, or null before any fetch or push, which is what
 *   makes the first sync a direction the owner has to choose.
 */
export function loadRepoState(): RepoState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as RepoState) : null;
  } catch {
    return null;
  }
}

function saveRepoState(state: RepoState): void {
  safeSetItem(STATE_KEY, JSON.stringify(state));
}

// --- validation --------------------------------------------------------------

/** A connectable repo must actually be a VITA: the identity seed and the
 *  profile are the two files no VITA deployment can exist without. */
export async function validateVitaRepo(cfg: RepoConfig): Promise<void> {
  const head = await getHead(cfg);
  const files = await getTreeFiles(cfg, head.treeSha, CONTENT_PREFIX);
  const paths = new Set(files.map((f) => f.path));
  if (!paths.has("src/content/settings/site.json") || !paths.has("src/content/settings/profile.md")) {
    throw new Error(
      "That repository is not a set-up VITA: it must carry src/content/settings/site.json and profile.md. Point the panel at a repo created from the VITA template."
    );
  }
}

// --- planning ----------------------------------------------------------------

const SETTINGS_PATHS = new Set([
  "src/content/settings/site.json",
  "src/content/settings/palette.json",
  "src/content/settings/profile.md",
]);

/** Only files the panel models take part in sync. A stray file under
 *  src/content (a note, an image) is invisible here, which above all means a
 *  push can never delete it. */
function isModeledPath(path: string): boolean {
  return SETTINGS_PATHS.has(path) || typeForPath(path) !== null;
}

/** Compute the three-way picture. Shared by fetch and push; only which side
 *  of it gets applied differs. On the very first sync there is no recorded
 *  base yet, so the caller picks the direction instead: `assumeBase:
 *  "remote"` treats the repo as agreed history (every local difference
 *  becomes a push), and adoptRemote() covers the opposite direction. */
export async function planSync(
  cfg: RepoConfig,
  opts: { assumeBase?: "state" | "remote" } = {}
): Promise<SyncPlan> {
  const head = await getHead(cfg);
  const remoteList = await getTreeFiles(cfg, head.treeSha, CONTENT_PREFIX);
  const remote: Record<string, string> = {};
  for (const f of remoteList) {
    if (isModeledPath(f.path)) remote[f.path] = f.sha;
  }

  const local: SyncPlan["local"] = {};
  for (const entry of buildContentEntries()) {
    local[entry.path] = { content: entry.content, sha: await gitBlobSha(entry.content) };
  }

  const base = opts.assumeBase === "remote" ? remote : (loadRepoState()?.files ?? {});
  const conflicts: Conflict[] = [];
  const remoteChanges: string[] = [];
  const localChanges: string[] = [];
  const localDeletions: string[] = [];

  const paths = new Set([...Object.keys(remote), ...Object.keys(local), ...Object.keys(base)]);
  for (const path of paths) {
    const r = remote[path];
    const l = local[path]?.sha;
    const b = base[path];
    if (l === r) continue; // agreement, whatever the history
    const localMoved = l !== b;
    const remoteMoved = r !== b;
    if (localMoved && !remoteMoved) {
      if (l) localChanges.push(path);
      else localDeletions.push(path);
    } else if (!localMoved && remoteMoved) {
      remoteChanges.push(path);
    } else {
      // both moved, to different results
      conflicts.push({
        path,
        kind: !l ? "local-delete" : !r ? "remote-delete" : "edit",
      });
    }
  }

  return { head, remote, local, base, conflicts, remoteChanges, localChanges, localDeletions };
}

// --- applying the remote side (fetch) -----------------------------------------

function typeForPath(path: string): PortfolioContentType | null {
  const rel = path.slice(CONTENT_PREFIX.length);
  for (const type of PORTFOLIO_CONTENT_TYPES) {
    const dir = TYPE_DIRS[type];
    if (rel.startsWith(`${dir}/`) && !rel.slice(dir.length + 1).includes("/") && rel.endsWith(".md")) {
      return type;
    }
  }
  return null;
}

/** Mirror of the site loader's frontmatter mapping, so fetched files become
 *  the same items the seed would have produced. */
function parseSeedFile(type: PortfolioContentType, path: string, raw: string): AnyContentItem {
  const { attributes, body } = frontMatter<Record<string, unknown>>(raw);
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  return {
    id: attributes.id || slug,
    slug,
    title: attributes.title || attributes.city || attributes.name || "Untitled",
    ...attributes,
    type,
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    body: body.replace(/\n$/, "") || "",
    postType: type === "posts" ? attributes.type : undefined,
    updateType: type === "updates" ? attributes.updateType || "note" : undefined,
  } as unknown as AnyContentItem;
}

/** Pull the given remote paths into localStorage: content items are replaced
 *  per file inside their type collection; the three settings seeds route to
 *  their own stores. */
async function applyRemotePaths(cfg: RepoConfig, plan: SyncPlan, paths: string[]): Promise<void> {
  // Group items per type so each collection is rewritten once.
  const byType = new Map<PortfolioContentType, Map<string, AnyContentItem | null>>();

  for (const path of paths) {
    const sha = plan.remote[path];
    if (path === "src/content/settings/site.json") {
      if (!sha) continue;
      const parsed: unknown = JSON.parse(await getBlobText(cfg, sha));
      if (isSiteIdentity(parsed)) saveStoredSite(parsed);
      continue;
    }
    if (path === "src/content/settings/palette.json") {
      if (!sha) continue;
      const palette = JSON.parse(await getBlobText(cfg, sha)) as StoredPalette;
      saveStoredPalette(palette);
      applyPalette(palette);
      continue;
    }
    if (path === "src/content/settings/profile.md") {
      if (!sha) continue;
      const { attributes, body } = frontMatter<Record<string, unknown>>(await getBlobText(cfg, sha));
      ContentService.saveSettings({
        id: "profile",
        type: "settings",
        ...attributes,
        body: body.replace(/\n$/, "") || "",
      } as unknown as UserSettings);
      continue;
    }
    const type = typeForPath(path);
    if (!type) continue; // a stray file under src/content the panel doesn't model
    if (!byType.has(type)) byType.set(type, new Map());
    byType.get(type)!.set(path, sha ? parseSeedFile(type, path, await getBlobText(cfg, sha)) : null);
  }

  for (const [type, changes] of byType) {
    // Rebuild the collection: current items keyed by the seed path they
    // serialize to, then the fetched replacements and deletions overlay them.
    const dir = `${CONTENT_PREFIX}${TYPE_DIRS[type]}/`;
    const current = new Map<string, AnyContentItem>();
    for (const item of ContentService.getAll(type)) {
      current.set(`${dir}${markdownFileName(item)}`, item);
    }
    for (const [path, item] of changes) {
      if (item === null) current.delete(path);
      else current.set(path, item);
    }
    ContentService.save(type, [...current.values()]);
  }
}

// --- public operations ---------------------------------------------------------

/** What a completed sync actually did. */
export interface SyncResult {
  applied: number;
  pushedSha?: string;
}

/** First-connect, repository-as-source: replace the whole local record with
 *  the repo's seed files and adopt its head as the base. */
export async function adoptRemote(cfg: RepoConfig, plan: SyncPlan): Promise<SyncResult> {
  // Full replace per type: exactly the remote items, nothing local kept.
  const byType = new Map<PortfolioContentType, AnyContentItem[]>();
  for (const type of PORTFOLIO_CONTENT_TYPES) byType.set(type, []);
  for (const [path, sha] of Object.entries(plan.remote)) {
    const type = typeForPath(path);
    if (type) byType.get(type)!.push(parseSeedFile(type, path, await getBlobText(cfg, sha)));
  }
  for (const [type, items] of byType) ContentService.save(type, items);
  await applyRemotePaths(
    cfg,
    plan,
    [...SETTINGS_PATHS].filter((p) => plan.remote[p])
  );
  saveRepoState({
    headSha: plan.head.commitSha,
    files: plan.remote,
    fetchedAt: new Date().toISOString(),
  });
  return { applied: Object.keys(plan.remote).length };
}

/** Fetch: take the remote side everywhere it is the settled one, plus the
 *  user's per-conflict choices. `resolutions` must cover every conflict. */
export async function fetchLatest(
  cfg: RepoConfig,
  plan: SyncPlan,
  resolutions: Record<string, Resolution>
): Promise<SyncResult> {
  const take = [...plan.remoteChanges];
  for (const c of plan.conflicts) {
    if (resolutions[c.path] === "theirs") take.push(c.path);
  }
  await applyRemotePaths(cfg, plan, take);

  // The new base is the remote head: kept-mine files are now deliberate
  // local divergence that the next push will carry.
  saveRepoState({
    headSha: plan.head.commitSha,
    files: plan.remote,
    fetchedAt: new Date().toISOString(),
  });
  return { applied: take.length };
}

/** Push: commit the local side everywhere it is the settled one, plus the
 *  user's per-conflict choices; conflicts resolved "theirs" are applied
 *  locally instead. Never forces: if the branch moves mid-push, GitHub
 *  rejects the ref update and the caller re-plans. */
export async function pushLocal(
  cfg: RepoConfig,
  plan: SyncPlan,
  resolutions: Record<string, Resolution>,
  message: string
): Promise<SyncResult> {
  const changes: { path: string; content: string }[] = [];
  const deletions: string[] = [];
  const takeTheirs: string[] = [];

  for (const path of plan.localChanges) changes.push({ path, content: plan.local[path].content });
  for (const path of plan.localDeletions) deletions.push(path);
  for (const c of plan.conflicts) {
    if (resolutions[c.path] === "mine") {
      if (plan.local[c.path]) changes.push({ path: c.path, content: plan.local[c.path].content });
      else deletions.push(c.path);
    } else {
      takeTheirs.push(c.path);
    }
  }

  let pushedSha = plan.head.commitSha;
  if (changes.length || deletions.length) {
    const result = await commitFiles(
      cfg,
      plan.head.commitSha,
      plan.head.treeSha,
      message,
      changes,
      // Deleting a path that is already gone remotely would fail the tree
      // build; only delete what the head still has.
      deletions.filter((p) => plan.remote[p])
    );
    pushedSha = result.commitSha;
  }

  if (takeTheirs.length) await applyRemotePaths(cfg, plan, takeTheirs);

  // New base: remote tree, overlaid with what we just pushed.
  const files = { ...plan.remote };
  for (const { path } of changes) files[path] = await gitBlobSha(plan.local[path].content);
  for (const path of deletions) delete files[path];
  saveRepoState({ headSha: pushedSha, files, fetchedAt: new Date().toISOString() });

  return { applied: takeTheirs.length, pushedSha };
}
