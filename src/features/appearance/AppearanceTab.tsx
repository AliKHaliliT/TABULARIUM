import { useState } from "react";
import { Check, RotateCcw, Paintbrush, FileDown, Save, X } from "lucide-react";
import {
  PALETTE_PRESETS,
  SEED_PALETTE,
  TOKEN_GUIDE,
  applyPalette,
  clearStoredPalette,
  loadCustomPalettes,
  loadStoredPalette,
  saveCustomPalettes,
  saveStoredPalette,
  toPaletteSeedFileJson,
  type CustomPalette,
  type PaletteMode,
  type PalettePreset,
  type StoredPalette,
} from "@/entities/site";
import { downloadTextFile } from "@/shared/lib";
import { PalettePreview } from "./PalettePreview";
import { ConfirmDialog } from "@/shared/ui";

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const fromPreset = (p: PalettePreset): StoredPalette => ({
  basedOn: p.id,
  light: { ...p.light },
  dark: { ...p.dark },
});

const fromSeed = (): StoredPalette => ({
  basedOn: SEED_PALETTE.basedOn,
  light: { ...SEED_PALETTE.light },
  dark: { ...SEED_PALETTE.dark },
});

const defaultState = (): StoredPalette => loadStoredPalette() ?? fromSeed();

/** Mini strip shown on preset cards: ground, card, ink, signal, field, pulse. */
const Strip = ({ m }: { m: PaletteMode }) => (
  <span className="flex overflow-hidden rounded-ctl border border-[var(--color-border)]">
    {[m.background, m.card, m.textPrimary, m.signal, m.field, m.pulse].map((c, i) => (
      <i key={i} className="h-4 w-4" style={{ background: c }} />
    ))}
  </span>
);

export const AppearanceTab = () => {
  const [palette, setPalette] = useState<StoredPalette>(defaultState);
  // Hex fields keep whatever the user is typing; invalid text just doesn't apply.
  const [hexDrafts, setHexDrafts] = useState<Record<string, string>>({});
  const [customs, setCustoms] = useState<CustomPalette[]>(loadCustomPalettes);
  const [profileName, setProfileName] = useState("");

  const commit = (next: StoredPalette) => {
    setPalette(next);
    applyPalette(next);
    saveStoredPalette(next);
  };

  const saveAsProfile = () => {
    const name = profileName.trim();
    if (!name) return;
    const profile: CustomPalette = {
      id: `custom-${Date.now()}`,
      name,
      basedOn: "",
      light: { ...palette.light },
      dark: { ...palette.dark },
    };
    profile.basedOn = profile.id;
    const next = [...customs, profile];
    setCustoms(next);
    saveCustomPalettes(next);
    setProfileName("");
    commit({ basedOn: profile.id, light: profile.light, dark: profile.dark });
  };

  const deleteProfile = (id: string) => {
    const next = customs.filter((c) => c.id !== id);
    setCustoms(next);
    saveCustomPalettes(next);
    // The colors stay live; the palette just stops pointing at a shelf slot.
    if (palette.basedOn === id) commit({ ...palette, basedOn: "custom" });
  };

  const setToken = (mode: "light" | "dark", key: keyof PaletteMode, value: string) => {
    commit({
      ...palette,
      basedOn: "custom",
      [mode]: { ...palette[mode], [key]: value },
    });
  };

  const onHexTyped = (mode: "light" | "dark", key: keyof PaletteMode, raw: string) => {
    setHexDrafts((d) => ({ ...d, [`${mode}.${key}`]: raw }));
    const v = raw.startsWith("#") ? raw : `#${raw}`;
    if (HEX_RE.test(v)) setToken(mode, key, v.toLowerCase());
  };

  const [confirmReset, setConfirmReset] = useState(false);
  const resetToDefault = () => {
    clearStoredPalette();
    setPalette(fromSeed());
    setHexDrafts({});
    setConfirmReset(false);
  };

  const exportSeedFile = () => downloadTextFile("palette.json", toPaletteSeedFileJson(palette));

  const activePresetId = palette.basedOn;

  return (
    <div className="space-y-8">
      {/* ── Presets ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <div className="mb-1 flex items-center gap-2">
          <Paintbrush size={16} className="text-[var(--color-text-secondary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Palette</h2>
        </div>
        <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
          Presets swap every color token at once. The change applies live to this panel,
          saves to this browser, and rides in the portfolio export so the resume builder
          matches. Editing any single color below forks the palette into a custom one,
          which you can keep on the shelf as a named profile. What{" "}
          <strong>visitors</strong> see only changes when the palette reaches the site
          repo, either through a push or by committing the downloaded file.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PALETTE_PRESETS.map((p) => {
            const active = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => commit(fromPreset(p))}
                className={`rounded-card border p-4 text-left transition-colors ${
                  active
                    ? "border-signal ring-1 ring-signal/40"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {p.name}
                    {p.id === SEED_PALETTE.basedOn && (
                      <span className="ml-2 font-mono text-[9.5px] uppercase tracking-[0.09em] text-[var(--color-text-secondary)]">
                        deployed
                      </span>
                    )}
                  </span>
                  {active && <Check size={15} className="shrink-0 text-signal" />}
                </div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Strip m={p.light} />
                  <Strip m={p.dark} />
                </div>
                <p className="m-0 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {p.story}
                </p>
              </button>
            );
          })}
          {customs.map((c) => {
            const active = activePresetId === c.id;
            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => commit({ basedOn: c.id, light: { ...c.light }, dark: { ...c.dark } })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    commit({ basedOn: c.id, light: { ...c.light }, dark: { ...c.dark } });
                }}
                className={`cursor-pointer rounded-card border p-4 text-left transition-colors ${
                  active
                    ? "border-signal ring-1 ring-signal/40"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-medium text-[var(--color-text-primary)]">
                    {c.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {active && <Check size={15} className="text-signal" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(c.id);
                      }}
                      className="p-0.5 text-[var(--color-text-secondary)] hover:text-red-500"
                      aria-label={`Delete the ${c.name} profile`}
                      title="Delete this profile"
                    >
                      <X size={13} />
                    </button>
                  </span>
                </div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Strip m={c.light} />
                  <Strip m={c.dark} />
                </div>
                <p className="m-0 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Saved custom profile.
                </p>
              </div>
            );
          })}
          {activePresetId === "custom" && (
            <div className="rounded-card border border-dashed border-signal/60 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-medium text-[var(--color-text-primary)]">Custom</span>
                <Check size={15} className="shrink-0 text-signal" />
              </div>
              <div className="mb-2.5 flex items-center gap-2">
                <Strip m={palette.light} />
                <Strip m={palette.dark} />
              </div>
              <p className="m-0 mb-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Your own mix, not on the shelf yet. Name it to keep it.
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveAsProfile();
                  }}
                  placeholder="Profile name"
                  aria-label="Name for this custom profile"
                  className="w-full min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] outline-none focus:border-signal"
                />
                <button
                  onClick={saveAsProfile}
                  disabled={!profileName.trim()}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-[var(--color-text-primary)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Save size={12} /> Save
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Live preview ────────────────────────────────────────── */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">Preview</h2>
        <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
          Both modes of the palette you're editing, rendered on the site's real
          patterns: chips, pills, pixel band, ledger, count cells, footer.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <PalettePreview mode={palette.light} label="Light mode" />
          <PalettePreview mode={palette.dark} label="Dark mode" />
        </div>
      </section>

      {/* ── Token editor ────────────────────────────────────────── */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">Colors</h2>
        <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
          Every token, what it drives, and its value in each mode. Changes apply
          as you pick.
        </p>

        <div className="hidden grid-cols-[minmax(0,1fr)_150px_150px] gap-3 border-b border-dashed border-[var(--color-border)] pb-2 md:grid">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Token: where it shows up
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Light
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Dark
          </span>
        </div>

        {TOKEN_GUIDE.map((t) => (
          <div
            key={t.key}
            className="grid grid-cols-1 items-center gap-3 border-b border-dashed border-[var(--color-border)] py-3 md:grid-cols-[minmax(0,1fr)_150px_150px]"
          >
            <div>
              <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">{t.label}</p>
              <p className="m-0 mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t.where}
              </p>
            </div>
            {(["light", "dark"] as const).map((mode) => (
              <div key={mode} className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase text-[var(--color-text-secondary)] md:hidden">
                  {mode}
                </span>
                <input
                  type="color"
                  value={palette[mode][t.key]}
                  onChange={(e) => {
                    setHexDrafts((d) => ({ ...d, [`${mode}.${t.key}`]: e.target.value }));
                    setToken(mode, t.key, e.target.value);
                  }}
                  aria-label={`${t.label}: ${mode} mode`}
                  className="h-8 w-9 shrink-0 cursor-pointer rounded-ctl border border-[var(--color-border-strong)] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={hexDrafts[`${mode}.${t.key}`] ?? palette[mode][t.key]}
                  onChange={(e) => onHexTyped(mode, t.key, e.target.value)}
                  onBlur={() => setHexDrafts((d) => ({ ...d, [`${mode}.${t.key}`]: palette[mode][t.key] }))}
                  spellCheck={false}
                  aria-label={`${t.label} hex: ${mode} mode`}
                  className="w-[92px] rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] px-2 py-1.5 font-mono text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-signal/50"
                />
              </div>
            ))}
          </div>
        ))}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-xs text-[var(--color-text-secondary)]">
            Rules of thumb: <strong>Signal</strong> must survive as text on the ground;{" "}
            <strong>Field</strong> is fills only; <strong>Pulse</strong> is ornament and
            should never carry meaning.
          </p>
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
          >
            <RotateCcw size={14} />
            Reset to deployed default
          </button>
        </div>
      </section>

      {/* ── Publish ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">Publish</h2>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Everything above lives in this browser until it reaches the site repo. The
          repository connection pushes{" "}
          <code className="font-mono text-xs">src/content/settings/palette.json</code>{" "}
          along with your content, or download the file here and commit it by hand. Either
          way, the next build bakes it into the page itself, first paint included.
        </p>
        <button
          onClick={exportSeedFile}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90"
        >
          <FileDown size={15} />
          Download palette.json
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title="Reset the palette?"
        message="This browser's overrides are forgotten and the deployed default (palette.json) comes back."
        confirmLabel="Reset"
        onConfirm={resetToDefault}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};
