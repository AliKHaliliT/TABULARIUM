import { useState } from "react";
import { ArrowDownUp, CheckCircle2, FileDown, RotateCcw, Save } from "lucide-react";
import {
  ORDERING_POLICIES,
  SEED_ORDERING,
  clearStoredOrdering,
  currentOrdering,
  saveStoredOrdering,
  toOrderingSeedFileJson,
  type OrderingConfig,
} from "@/entities/site";
import { useContent } from "@/entities/record";
import { downloadTextFile } from "@/shared/lib";
import { ConfirmDialog } from "@/shared/ui";

/** The sections the site orders, labeled the way the tab strip labels them. */
const SECTIONS: { key: string; label: string }[] = [
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "courses", label: "Courses" },
  { key: "awards", label: "Awards" },
  { key: "certificates", label: "Certificates" },
  { key: "publications", label: "Publications" },
  { key: "speaking", label: "Speaking" },
  { key: "volunteering", label: "Volunteering" },
  { key: "organizations", label: "Organizations" },
  { key: "references", label: "References" },
  { key: "projects", label: "Projects" },
  { key: "blog", label: "Blog" },
  { key: "posts", label: "Garden" },
  { key: "updates", label: "Updates" },
  { key: "books", label: "Books" },
  { key: "media", label: "Media (all shelves)" },
  { key: "interests", label: "Interests" },
];
// The travel atlas is deliberately absent: countries and the cities inside
// them order themselves hierarchically, so a policy there would be ignored.

const DEFAULT = "default";

const policyLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

/**
 * Section ordering editor: one policy select per section, plus one per
 * library shelf the media collection currently names. Mirrors the identity
 * flow: edits save to this browser (os_ordering); "Download ordering.json"
 * exports the seed file for committing.
 */
export const OrderingCard = () => {
  const { media } = useContent();
  const [config, setConfig] = useState<OrderingConfig>(currentOrdering);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Every shelf the record currently names gets its own row, keyed the way
  // the site reads it (media/<slug>).
  const shelfKeys = [
    ...new Set(
      media.map(
        (m) => `media/${((m.medium || "").trim() || "other").toLowerCase().replace(/\s+/g, "-")}`
      )
    ),
  ].sort();

  const setPolicy = (key: string, value: string) =>
    setConfig((prev) => {
      const next = { ...prev };
      if (value === DEFAULT) delete next[key];
      else next[key] = value;
      return next;
    });

  const handleSave = () => {
    saveStoredOrdering(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const resetToDefault = () => {
    clearStoredOrdering();
    setConfig({ ...SEED_ORDERING });
    setConfirmReset(false);
  };

  const row = (key: string, label: string) => (
    <div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-well px-3 py-2">
      <span className="text-sm text-ink">{label}</span>
      <select
        value={config[key] ?? DEFAULT}
        onChange={(e) => setPolicy(key, e.target.value)}
        className="rounded-lg border border-line bg-card px-2 py-1.5 text-sm text-ink"
        aria-label={`Ordering for ${label}`}
      >
        <option value={DEFAULT}>Default</option>
        {ORDERING_POLICIES.map((p) => (
          <option key={p} value={p}>
            {policyLabel(p)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <ArrowDownUp size={16} className="text-muted" />
          <h2 className="text-lg font-semibold text-ink">Section ordering</h2>
        </div>
        <p className="m-0 text-sm text-muted">
          How each section sorts its entries. Default means dated sections read newest
          first and the rest alphabetically; chronological degrades gracefully, letting
          undated entries close the list alphabetically. Pinned entries (the per-entry
          Pin field) always lead, whatever the policy. Saving applies to{" "}
          <strong>this browser</strong>; to change the live site, download the file below
          and replace{" "}
          <code className="font-mono text-xs">src/content/settings/ordering.json</code>{" "}
          in the repo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {SECTIONS.map(({ key, label }) => row(key, label))}
      </div>

      {shelfKeys.length > 0 && (
        <div className="space-y-3 border-t border-line pt-5">
          <div>
            <h3 className="font-semibold text-ink">Library shelves</h3>
            <p className="m-0 mt-0.5 text-xs text-muted">
              A shelf's own policy wins over the Media row for that shelf.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {shelfKeys.map((key) => row(key, `Shelf · ${key.slice("media/".length)}`))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-ink text-surface rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          Save Ordering
        </button>
        <button
          onClick={() => downloadTextFile("ordering.json", toOrderingSeedFileJson(config))}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <FileDown size={15} />
          Download ordering.json
        </button>
        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <RotateCcw size={14} />
          Reset to deployed default
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-signal">
            <CheckCircle2 size={16} />
            Saved!
          </span>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset the section ordering?"
        message="This browser's draft is dropped and the deployed seed shows through."
        confirmLabel="Reset"
        onConfirm={resetToDefault}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};
