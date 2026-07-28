import { FileDown, Package } from "lucide-react";
import { buildPortfolioSnapshot, toPortfolioFileJson } from "@/services/portfolioSnapshot";
import { downloadTextFile } from "@/admin/lib/download";

/**
 * Portfolio export: downloads portfolio.json, the complete snapshot of the
 * owner's profile + content. It is the resume builder's import format and a
 * full backup of admin edits (which otherwise live only in this browser).
 */
export const PortfolioExportCard = () => {
  const exportPortfolio = () => {
    const snapshot = buildPortfolioSnapshot(new Date().toISOString());
    downloadTextFile("portfolio.json", toPortfolioFileJson(snapshot));
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
          One file with your entire portfolio: profile plus every content collection,
          including edits saved in this browser. The <strong>resume builder</strong> imports
          it as its content source, and it doubles as a full backup of your admin edits.
        </p>
      </div>
      <button
        onClick={exportPortfolio}
        className="flex items-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90"
      >
        <FileDown size={15} />
        Download portfolio.json
      </button>
    </div>
  );
};
