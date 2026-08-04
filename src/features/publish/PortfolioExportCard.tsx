import { FileDown, FolderArchive, Package } from "lucide-react";
import { buildPortfolioSnapshot, toPortfolioFileJson } from "./snapshot";
import { buildContentEntries } from "./bundle";
import { buildZip, downloadBlobFile, downloadTextFile } from "@/shared/lib";

/**
 * Portfolio export: downloads portfolio.json, the complete snapshot of the
 * owner's profile + content. It is the resume builder's import format and a
 * full backup of admin edits (which otherwise live only in this browser).
 * The zip variant serializes the same record as seed FILES (the site repo's
 * src/content tree) for the no-repo workflow: replace the folder by hand.
 */
export const PortfolioExportCard = () => {
  const exportPortfolio = () => {
    const snapshot = buildPortfolioSnapshot(new Date().toISOString());
    downloadTextFile("portfolio.json", toPortfolioFileJson(snapshot));
  };

  const exportBundle = () => {
    downloadBlobFile("vita-content.zip", buildZip(buildContentEntries()));
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Package size={16} className="text-[var(--color-text-secondary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Portfolio export
          </h2>
        </div>
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">
          One file with your entire portfolio, from the profile to every content
          collection, including the edits saved in this browser. The{" "}
          <strong>resume builder</strong> imports it as its content source, and it also
          works as a full backup of the record.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={exportPortfolio}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90"
        >
          <FileDown size={15} />
          Download portfolio.json
        </button>
        <button
          onClick={exportBundle}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-signal hover:text-signal"
        >
          <FolderArchive size={15} />
          Download content bundle (.zip)
        </button>
      </div>
      <p className="m-0 text-xs text-[var(--color-text-secondary)]">
        The zip holds the same record as seed files, laid out like the site repo's{" "}
        <code>src/content</code> tree, for working without a connected repository. Unzip
        it over the site repo, review the diff, and commit. A zip cannot delete files, so
        anything you removed here must also be removed there by hand, and unzipping
        overwrites edits made in the repo since your last download. The diff is your
        safety net; always read it before committing.
      </p>
    </div>
  );
};
