import { Plus, Trash2 } from "lucide-react";
import { parseProfileLinks, ProfileLink, LINK_ICONS, LINK_ICON_NAMES } from "@/shared/lib";

const INPUT_CLS =
  "w-full px-3 py-2 bg-well border border-line rounded-lg text-sm text-ink";

/** Serialize rows back into the profile `links` string format. */
const serialize = (rows: ProfileLink[]): string =>
  rows
    .map((r) => {
      const label = r.label.trim();
      const url = r.url.trim();
      if (!label && !url) return "";
      const icon = r.icon && LINK_ICONS[r.icon] ? ` [${r.icon}]` : "";
      return `${label || url}${icon}: ${url}`;
    })
    .filter(Boolean)
    .join("\n");

/**
 * Structured editor for the free-form profile links: label, an optional icon
 * picked from the site's own glyph set, and the URL. Any platform is valid;
 * the icon is presentation only (icon square on the hero when set, text chip
 * when not).
 */
export const LinksEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const rows = parseProfileLinks(value);

  const update = (index: number, patch: Partial<ProfileLink>) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onChange(serialize(next));
  };

  const remove = (index: number) =>
    onChange(serialize(rows.filter((_, i) => i !== index)));

  const add = () =>
    onChange(serialize([...rows, { label: "New link", url: "https://" }]));

  return (
    <div className="space-y-3">
      {rows.map((row, i) => {
        const Icon = row.icon ? LINK_ICONS[row.icon] : undefined;
        return (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[10rem_9rem_1fr_auto] gap-2 items-center"
          >
            <input
              type="text"
              value={row.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label"
              aria-label="Link label"
              className={INPUT_CLS}
            />
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted">
                {Icon ? (
                  <Icon size={14} />
                ) : (
                  <span className="font-mono text-[9px] uppercase">Abc</span>
                )}
              </span>
              <select
                value={row.icon && LINK_ICONS[row.icon] ? row.icon : ""}
                onChange={(e) => update(i, { icon: e.target.value || undefined })}
                aria-label="Link icon"
                className={INPUT_CLS}
              >
                <option value="">Text chip</option>
                {LINK_ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={row.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder="https://..."
              aria-label="Link URL"
              className={`${INPUT_CLS} font-mono`}
            />
            <button
              onClick={() => remove(i)}
              title="Remove link"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-red-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
      <button
        onClick={add}
        className="flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        <Plus size={14} />
        Add link
      </button>
    </div>
  );
};
