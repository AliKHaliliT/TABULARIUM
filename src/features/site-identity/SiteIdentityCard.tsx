import { useState } from "react";
import { CheckCircle2, FileDown, Globe2, RotateCcw, Save } from "lucide-react";
import { SEED_SITE, clearStoredSite, currentSite, saveStoredSite, toSiteSeedFileJson, type SiteIdentity, PAGE_COPY } from "@/entities/site";
import { downloadTextFile } from "@/shared/lib";
import { ConfirmDialog } from "@/shared/ui";

type TextKey = Exclude<keyof SiteIdentity, "pageCopy">;

const FIELDS: {
  key: TextKey;
  label: string;
  hint: string;
  textarea?: boolean;
}[] = [
  {
    key: "name",
    label: "Site name",
    hint: "The wordmark in the top bar and the footer colophon.",
  },
  {
    key: "mark",
    label: "Hero mark",
    hint: "The oversized monogram on the home hero. Leave empty to use the site name's initials.",
  },
  {
    key: "tagline",
    label: "Footer sign-off",
    hint: "The big serif line in the footer, one line per row (the last row is drawn in the accent). Leave empty for “Built from {your city}, logged everywhere.”",
    textarea: true,
  },
  {
    key: "colophon",
    label: "Colophon",
    hint: "The small line at the very bottom; the year is appended. Leave empty for “A dossier by {your name}”.",
  },
  {
    key: "title",
    label: "Browser title",
    hint: "Base tab title: pages prefix their own label (“Blog · …”).",
  },
  {
    key: "description",
    label: "Description",
    hint: "Search-engine and social-share description.",
    textarea: true,
  },
  {
    key: "author",
    label: "Owner",
    hint: "Meta author; also the colophon fallback when the profile name is empty.",
  },
  {
    key: "url",
    label: "Canonical URL",
    hint: "Deployed origin (e.g. https://user.github.io/repo) for social cards. Leave empty if unsure.",
  },
];

/**
 * Site identity editor: the wordmark, document title, and metas. Mirrors
 * the Appearance flow: edits save to this browser (os_site); "Download
 * site.json" exports the deployed-default seed file for committing.
 */
export const SiteIdentityCard = () => {
  const [form, setForm] = useState<SiteIdentity>(currentSite);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: TextKey, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePageCopy = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, pageCopy: { ...prev.pageCopy, [key]: value } }));

  const handleSave = () => {
    saveStoredSite(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [confirmReset, setConfirmReset] = useState(false);
  const resetToDefault = () => {
    clearStoredSite();
    setForm({ ...SEED_SITE });
    setConfirmReset(false);
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Globe2 size={16} className="text-[var(--color-text-secondary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Site identity
          </h2>
        </div>
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">
          The site's own name and metadata: separate from your profile. Saving applies
          to <strong>this browser</strong>; to change what visitors (and search engines)
          see, download the file below and replace{" "}
          <code className="font-mono text-xs">src/content/settings/site.json</code> in the
          repo: the build bakes it into the page's title and social tags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {FIELDS.map(({ key, label, hint, textarea }) => (
          <div key={key} className={`space-y-2 ${textarea ? "md:col-span-2" : ""}`}>
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              {label}
            </label>
            {textarea ? (
              <textarea
                rows={3}
                value={form[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
              />
            )}
            <p className="m-0 text-xs text-[var(--color-text-secondary)]">{hint}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-[var(--color-border)] pt-5">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Page copy</h3>
          <p className="m-0 mt-0.5 text-xs text-[var(--color-text-secondary)]">
            The one-line description under each page's title. Leave a field empty to keep
            the template's default wording (shown as the placeholder).
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(PAGE_COPY).map(([key, { label, fallback }]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
              </label>
              <input
                type="text"
                value={form.pageCopy?.[key] ?? ""}
                onChange={(e) => handlePageCopy(key, e.target.value)}
                placeholder={fallback}
                className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-text-primary)] text-[var(--color-background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          Save Identity
        </button>
        <button
          onClick={() => downloadTextFile("site.json", toSiteSeedFileJson(form))}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
        >
          <FileDown size={15} />
          Download site.json
        </button>
        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
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
        title="Reset the site identity?"
        message="This browser's overrides are forgotten and the deployed default (site.json) comes back."
        confirmLabel="Reset"
        onConfirm={resetToDefault}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};
