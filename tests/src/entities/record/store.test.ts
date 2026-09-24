// The record door: an override wins while it satisfies the contract, a broken
// one is named for the page instead of rendered, and one that outlived a
// changed seed is served and named as stale.

import { beforeEach, describe, expect, it } from "vitest";
import { installLocalStorageMock } from "@/shared/testing/localStorageMock";
import { ContentService } from "@/entities/record/store";
import { loadInitialData, loadSettings, seedFingerprint } from "@/entities/record/seed";
import type { Book } from "@/entities/record/model";

let store: Map<string, string>;

beforeEach(() => {
  store = installLocalStorageMock();
});

const noteFor = (key: string) => ContentService.savedCopies().find((note) => note.key === key);
const book: Book = { id: "x", type: "books", title: "Only me", author: "Nobody", status: "Read" };

describe("ContentService.getAll", () => {
  it("serves the seed and names nothing when localStorage is empty", () => {
    expect(ContentService.getAll("books")).toEqual(loadInitialData("books"));
    expect(noteFor("os_content_books")).toBeUndefined();
  });

  it("serves a valid override that matches its seed and names nothing", () => {
    store.set("os_content_books", JSON.stringify([book]));
    store.set("os_content_seed_books", seedFingerprint("books"));
    expect(ContentService.getAll("books")).toEqual([book]);
    expect(noteFor("os_content_books")).toBeUndefined();
  });

  it("keeps serving an override that outlived a changed seed, and names it stale", () => {
    store.set("os_content_books", JSON.stringify([book]));
    store.set("os_content_seed_books", "some-older-fingerprint");
    expect(ContentService.getAll("books")).toEqual([book]);
    expect(noteFor("os_content_books")).toEqual({ key: "os_content_books", type: "books", kind: "stale", reason: "" });
  });

  it("falls back to the seed and names the key refused when the override is corrupt JSON", () => {
    store.set("os_content_books", "{not json");
    expect(ContentService.getAll("books")).toEqual(loadInitialData("books"));
    expect(noteFor("os_content_books")).toEqual({
      key: "os_content_books",
      type: "books",
      kind: "refused",
      reason: expect.stringMatching(/\S/),
    });
  });

  it("names the key refused when the override is filed under the wrong collection", () => {
    store.set("os_content_books", JSON.stringify([{ id: "x", type: "projects" }]));
    expect(ContentService.getAll("books")).toEqual(loadInitialData("books"));
    expect(noteFor("os_content_books")?.kind).toBe("refused");
  });

  it("forgets a refusal once the key reads cleanly again", () => {
    store.set("os_content_books", "{not json");
    ContentService.getAll("books");
    store.set("os_content_books", JSON.stringify([book]));
    ContentService.getAll("books");
    expect(noteFor("os_content_books")).toBeUndefined();
  });

  it("clears a stale note when the collection is saved again", () => {
    store.set("os_content_books", JSON.stringify([book]));
    store.set("os_content_seed_books", "some-older-fingerprint");
    ContentService.getAll("books");
    ContentService.save("books", [book]);
    expect(noteFor("os_content_books")).toBeUndefined();
    expect(store.get("os_content_seed_books")).toBe(seedFingerprint("books"));
  });

  it("treats unreadable storage as holding nothing, naming no key", () => {
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => {
          throw new Error("storage is disabled in this browser");
        },
      },
      configurable: true,
      writable: true,
    });
    expect(ContentService.getAll("books")).toEqual(loadInitialData("books"));
    expect(noteFor("os_content_books")).toBeUndefined();
  });
});

describe("ContentService settings", () => {
  it("serves the settings seed when localStorage is empty", () => {
    expect(ContentService.getSettings()).toEqual(loadSettings());
  });

  it("falls back to the settings seed and names the key refused when the profile breaks the contract", () => {
    store.set("os_settings", JSON.stringify({ id: "profile", type: "books" }));
    expect(ContentService.getSettings()).toEqual(loadSettings());
    expect(noteFor("os_settings")).toEqual({
      key: "os_settings",
      type: "settings",
      kind: "refused",
      reason: expect.stringMatching(/\S/),
    });
  });

  it("clears a refused profile's note when the profile is saved again", () => {
    store.set("os_settings", JSON.stringify({ id: "profile", type: "books" }));
    ContentService.getSettings();
    ContentService.saveSettings(loadSettings());
    expect(noteFor("os_settings")).toBeUndefined();
  });
});
