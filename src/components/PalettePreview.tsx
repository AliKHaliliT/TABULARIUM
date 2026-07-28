import { PaletteMode } from "@/lib/palette";
import { useContent } from "@/context/ContentContext";
import { useSiteIdentity } from "@/lib/site";
import { searchShortcutLabel } from "@/lib/platform";

/**
 * A miniature of the public site rendered entirely from a palette object
 * (inline styles, no global tokens) so both modes can be shown side by side
 * while editing: the admin's live "what will this actually look like".
 * Copy comes from the owner's settings/site identity, never hardcoded names.
 */

const bandCells = (m: PaletteMode) => {
  const cells: string[] = [];
  for (let i = 0; i < 26; i++) {
    const r = (i * 2654435761) % 9;
    if (r === 0 || r === 4) cells.push(m.field);
    else if (r === 2) cells.push(`${m.field}73`);
    else if (r === 6) cells.push(`${m.pulse}b3`);
    else cells.push("transparent");
  }
  return cells;
};

const Chip = ({
  m,
  live,
  children,
}: {
  m: PaletteMode;
  live?: boolean;
  children: React.ReactNode;
}) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-ctl border px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.09em] whitespace-nowrap"
    style={
      live
        ? { borderColor: `${m.signal}80`, color: m.signal }
        : { borderColor: m.borderStrong, color: m.textSecondary }
    }
  >
    {live && (
      <i className="h-1.5 w-1.5 rounded-full" style={{ background: m.field }} />
    )}
    {children}
  </span>
);

export const PalettePreview = ({ mode, label }: { mode: PaletteMode; label: string }) => {
  const { settings } = useContent();
  const site = useSiteIdentity();
  const heroName = (settings.name || "Your Name").split(" ").slice(0, 2).join(" ");
  const city = settings.location?.split(",")[0].trim() || "here";

  return (
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
      {label}
    </figcaption>
    <div
      className="overflow-hidden rounded-card border"
      style={{ background: mode.background, borderColor: mode.borderStrong }}
    >
      {/* top bar */}
      <div
        className="flex items-center justify-between border-b border-dashed px-4 py-2.5"
        style={{ borderColor: mode.border }}
      >
        <span
          className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em]"
          style={{ color: mode.textPrimary }}
        >
          <span className="grid grid-cols-3 gap-[1.5px]" aria-hidden="true">
            {[mode.textPrimary, mode.field, mode.textPrimary, mode.textPrimary, mode.textPrimary, mode.pulse].map(
              (c, i) => (
                <i key={i} className="h-1 w-1" style={{ background: c }} />
              )
            )}
          </span>
          <span className="whitespace-nowrap">{site.name}</span>
        </span>
        <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: mode.textSecondary }}>
          CAREER · WRITING · {searchShortcutLabel().toUpperCase()}
        </span>
      </div>

      <div className="px-4 pt-4">
        {/* chips + hero */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Chip m={mode}>Dossier · 2026</Chip>
          <Chip m={mode} live>
            Open to work
          </Chip>
        </div>
        <p
          className="m-0 font-serif text-3xl font-semibold leading-none tracking-[-0.03em]"
          style={{ color: mode.textPrimary }}
        >
          {heroName}
        </p>
        <p className="mb-3.5 mt-2 font-serif text-sm italic" style={{ color: mode.textSecondary }}>
          Developer building tools and systems.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className="rounded-full px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em]"
            style={{ background: mode.textPrimary, color: mode.background }}
          >
            View the record →
          </span>
          <span
            className="rounded-full border px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em]"
            style={{ borderColor: mode.borderStrong, color: mode.textPrimary }}
          >
            Read the writing →
          </span>
        </div>
      </div>

      {/* pixel band */}
      <div
        className="flex h-3 border-y border-dashed"
        style={{ borderColor: mode.border }}
        aria-hidden="true"
      >
        {bandCells(mode).map((c, i) => (
          <i key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* ledger */}
      <div className="px-4 pt-1">
        {[
          { date: "MAR 5, 2024", title: "On Building in Public", kind: "Blog", live: false },
          { date: "DEC 22, 2025", title: "Building a Second Brain", kind: "Evergreen", live: true },
        ].map((row) => (
          <div
            key={row.title}
            className="flex items-center gap-3 border-b border-dashed py-2.5"
            style={{ borderColor: mode.border }}
          >
            <code className="w-[86px] shrink-0 font-mono text-[9.5px]" style={{ color: mode.textSecondary }}>
              {row.date}
            </code>
            <span
              className="min-w-0 flex-1 truncate font-serif text-sm font-semibold"
              style={{ color: mode.textPrimary }}
            >
              {row.title}
            </span>
            <Chip m={mode} live={row.live}>
              {row.kind}
            </Chip>
          </div>
        ))}

        {/* count cells */}
        <div className="my-3.5 grid grid-cols-2 gap-2.5">
          {[
            { label: "Publications", n: "1", unit: "paper", link: "Open record →" },
            { label: "Library", n: "2", unit: "books", link: "Open library →" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-start gap-2 rounded-card border border-dashed p-3"
              style={{ background: mode.card, borderColor: mode.border }}
            >
              <Chip m={mode}>{c.label}</Chip>
              <p className="m-0 font-serif text-xl font-semibold leading-none" style={{ color: mode.textPrimary }}>
                {c.n}{" "}
                <span className="font-serif text-xs font-normal italic" style={{ color: mode.textSecondary }}>
                  {c.unit}
                </span>
              </p>
              <code
                className="border-b pb-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em]"
                style={{ color: mode.signal, borderColor: mode.borderStrong }}
              >
                {c.link}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* footer strip */}
      <div
        className="px-4 py-3 font-serif text-sm font-semibold"
        style={{ background: mode.footer, color: mode.footerInk }}
      >
        Built from {city},{" "}
        <em style={{ color: mode.field }}>logged everywhere.</em>
      </div>
    </div>
  </figure>
  );
};
