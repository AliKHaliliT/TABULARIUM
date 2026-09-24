/**
 * The record's storage door: bundled markdown, optionally shadowed by an
 * override this panel wrote into the browser.
 *
 * The panel reads back what it and its predecessors wrote, so the value is
 * validated on the way in. A value that breaks the contract is set aside with
 * the key to clear, and the committed seed is served instead.
 */

import { loadInitialData, loadSettings, seedFingerprint } from "./seed";
import { AnyContentItem, ContentType, UserSettings } from "./model";
import { validateItems, validateSettings } from "./schema";
import { safeSetItem } from "@/shared/lib";

const STORAGE_PREFIX = "os_content_";
const SETTINGS_KEY = "os_settings";
const SEED_PREFIX = "os_content_seed_";

/** A saved copy the page names, because the door refused it or because it outlived its seed. */
export interface SavedCopyNote {
  /** The localStorage key holding the copy, which is what the owner clears. */
  key: string;
  /** The collection the copy claims to be, or "settings" for the profile. */
  type: ContentType;
  /** Refused when it failed its check and the seed is served; stale when it still wins over markdown that changed since it was saved. */
  kind: "refused" | "stale";
  /** Why a refused copy failed, in the words of the check that refused it; empty for a stale one. */
  reason: string;
}

// What the latest read or write of each key found worth naming. A key that
// reads cleanly, is saved afresh, or holds nothing leaves the list.
const notes = new Map<string, SavedCopyNote>();

// Once a type is saved from the admin, its localStorage copy permanently
// shadows the bundled markdown, so a redeploy that changed the markdown
// underneath it is noted for the page.
function seedChangedSince(type: ContentType): boolean {
  const saved = localStorage.getItem(`${SEED_PREFIX}${type}`);
  return Boolean(saved) && saved !== seedFingerprint(type);
}

// The copy saved under a key, or null when none is saved or storage cannot be
// read at all. An unreadable store holds nothing to honor or to name.
function savedCopy(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Parses and checks a saved copy. A copy that fails is noted under its key,
// so the page can name what to clear, and the caller falls back to the seed.
function honor<T>(key: string, type: ContentType, stored: string, check: (value: unknown) => T): T | null {
  try {
    return check(JSON.parse(stored));
  } catch (e) {
    notes.set(key, { key, type, kind: "refused", reason: e instanceof Error ? e.message : String(e) });
    return null;
  }
}

/**
 * The record's store: bundled markdown, optionally shadowed by this browser.
 *
 * @example
 * ```ts
 * const books = ContentService.getAll("books")
 * ContentService.save("books", [...books, added])
 * ```
 */
export const ContentService = {
  /**
   * Reads one collection, preferring this browser's override.
   *
   * @param type - The collection to read.
   *
   * @returns The stored items when an override exists and satisfies the
   *   contract, otherwise the committed seed. A broken override is noted for
   *   `savedCopies` and does not reach the caller, and one that outlived a
   *   changed seed is served and noted as stale.
   */
  getAll: (type: ContentType): AnyContentItem[] => {
    const key = `${STORAGE_PREFIX}${type}`;
    const stored = savedCopy(key);
    notes.delete(key);
    if (!stored) return loadInitialData(type);
    const items = honor(key, type, stored, (value) => validateItems(value, type, `localStorage "${key}"`));
    if (items === null) return loadInitialData(type);
    if (seedChangedSince(type)) notes.set(key, { key, type, kind: "stale", reason: "" });
    return items;
  },

  /**
   * Reads the owner profile, preferring this browser's override.
   *
   * @returns The stored profile when it satisfies the contract, otherwise the
   *   committed seed; a broken one is noted for `savedCopies`.
   */
  getSettings: (): UserSettings => {
    const stored = savedCopy(SETTINGS_KEY);
    notes.delete(SETTINGS_KEY);
    const settings = stored
      ? honor(SETTINGS_KEY, "settings", stored, (value) => validateSettings(value, `localStorage "${SETTINGS_KEY}"`))
      : null;
    return settings ?? loadSettings();
  },

  /**
   * Names every saved copy the latest reads set aside or found stale, so the
   * page can say which key to clear.
   *
   * @returns One note per key, empty when every override was honored and current.
   */
  savedCopies: (): SavedCopyNote[] => [...notes.values()],

  /**
   * Writes one collection, recording the seed fingerprint alongside it.
   *
   * The fingerprint is what later lets a redeploy that changed the markdown
   * under a shadowed collection be noticed at all.
   *
   * @param type - The collection being written.
   * @param data - Every item of that collection.
   *
   * @returns Nothing.
   */
  save: (type: ContentType, data: AnyContentItem[]) => {
    safeSetItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(data));
    safeSetItem(`${SEED_PREFIX}${type}`, seedFingerprint(type));
    notes.delete(`${STORAGE_PREFIX}${type}`);
  },

  /**
   * Writes the owner profile for this browser.
   *
   * @param data - The profile to store.
   *
   * @returns Nothing.
   */
  saveSettings: (data: UserSettings) => {
    safeSetItem(SETTINGS_KEY, JSON.stringify(data));
    notes.delete(SETTINGS_KEY);
  },

  /**
   * Hands one item to the browser as the markdown file the site expects.
   *
   * This is how an edit made here reaches the site: download the file, commit it
   * under `src/content/`, and rebuild.
   *
   * @param source - The item to serialize.
   *
   * @returns Nothing.
   */
  downloadMarkdown: (source: AnyContentItem) => {
    const fileContent = toMarkdownFile(source);
    const blob = new Blob([fileContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = markdownFileName(source);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

/** Serialize any item (or the settings object) back into the seed-file
 *  format: frontmatter for every set field, then the body. Shared by the
 *  per-item download, the zip bundle, and the repository push. */
export function toMarkdownFile(source: AnyContentItem | UserSettings): string {
  const item = source as unknown as Record<string, unknown>;
  let fileContent = "---\n";
  Object.keys(item).forEach((key) => {
    if (
      key !== "body" &&
      key !== "id" &&
      key !== "type" &&
      item[key] !== undefined &&
      item[key] !== ""
    ) {
      fileContent += frontmatterField(key, item[key]);
    }
  });
  fileContent += "---\n\n";
  fileContent += item.body || "";
  if (!String(item.body || "").endsWith("\n")) fileContent += "\n";
  return fileContent;
}

// The frontmatter lines one set field serializes to.
function frontmatterField(key: string, value: unknown): string {
  let lines = "";
  if (Array.isArray(value)) {
    lines += `${key}:\n`;
    value.forEach((v) => (lines += `  - ${v}\n`));
  } else if (typeof value === "string" && value.includes("\n")) {
    // Multi-line values (skills, languages, links) round-trip as YAML
    // block scalars, matching the hand-written seed files.
    lines += `${key}: |\n`;
    value.split("\n").forEach((line) => (lines += `  ${line}\n`));
  } else {
    const safeValue =
      typeof value === "string" && value.includes(":")
        ? `"${value}"`
        : value;
    lines += `${key}: ${safeValue}\n`;
  }
  return lines;
}

/** The seed filename an item serializes to (slug when it has one, else a
 *  slugified title). */
export function markdownFileName(source: AnyContentItem): string {
  const item = source as unknown as Record<string, unknown>;
  const base =
    (typeof item.slug === "string" && item.slug) ||
    String(item.title || item.city || item.name || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  return `${base || "untitled"}.md`;
}
