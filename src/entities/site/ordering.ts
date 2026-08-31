// Section ordering follows the content model like the palette does:
// src/content/settings/ordering.json is the deployed-default seed the site
// reads at build, and "os_ordering" in localStorage is the per-browser draft
// edited in Admin, Settings, Section ordering. Keys are a content type
// ("projects") or a library shelf ("media/game"); values are the policies the
// site knows. The site treats an absent file, an unknown key, or an unknown
// value as the default order, so nothing here can break a deployment.

import seedJson from "@/content/settings/ordering.json";
import { safeSetItem } from "@/shared/lib";

/** The orderings the site honors; anything else means the section's default. */
export const ORDERING_POLICIES = ["alphabetical", "chronological"] as const;

/** One chosen policy per section key. */
export type OrderingConfig = Record<string, string>;

const STORAGE_KEY = "os_ordering";

/** The ordering committed as ordering.json: what ships before any override. */
export const SEED_ORDERING = seedJson as OrderingConfig;

const isConfig = (value: unknown): value is OrderingConfig =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Reads this browser's ordering draft.
 *
 * @returns The stored config, or null when none is saved or the stored value
 *   is not an object.
 */
export function loadStoredOrdering(): OrderingConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** The ordering in effect: per-browser draft if present, else the seed. */
export function currentOrdering(): OrderingConfig {
  return loadStoredOrdering() ?? SEED_ORDERING;
}

/**
 * Writes an ordering draft for this browser.
 *
 * @param config - The config to store; keys carrying no policy are dropped so
 *   the file publishes only what the owner actually chose.
 *
 * @returns Nothing.
 */
export function saveStoredOrdering(config: OrderingConfig) {
  const chosen = Object.fromEntries(
    Object.entries(config).filter(([, v]) => (ORDERING_POLICIES as readonly string[]).includes(v))
  );
  safeSetItem(STORAGE_KEY, JSON.stringify(chosen));
}

/** Remove the per-browser draft; the deployed seed shows through. */
export function clearStoredOrdering() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Exact seed-file format: what gets committed as ordering.json. */
export function toOrderingSeedFileJson(config: OrderingConfig): string {
  const chosen = Object.fromEntries(
    Object.entries(config)
      .filter(([, v]) => (ORDERING_POLICIES as readonly string[]).includes(v))
      .sort(([a], [b]) => a.localeCompare(b))
  );
  return JSON.stringify(chosen, null, 2) + "\n";
}
