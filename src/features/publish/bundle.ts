// Builds the whole record as seed files: every content item serialized back
// to markdown plus the three settings seeds, laid out exactly like the VITA
// repo's src/content tree. One zip download covers the no-repo workflow
// (edit here, replace the files in the site repo by hand), and the same
// entry list feeds the repository push.

import { ContentService, markdownFileName, toMarkdownFile } from "@/entities/record";
import { PORTFOLIO_CONTENT_TYPES, type PortfolioContentType } from "./contract";
import { currentSite, toSiteSeedFileJson as siteJson, loadStoredPalette, SEED_PALETTE, toPaletteSeedFileJson as paletteJson } from "@/entities/site";
import type { ZipEntry } from "@/shared/lib";

/** Folder for each type inside src/content, mirroring the site repo. */
export const TYPE_DIRS: Record<PortfolioContentType, string> = {
  experience: "experience",
  education: "education",
  awards: "awards",
  publications: "publications",
  speaking: "speaking",
  volunteering: "volunteering",
  certificates: "certificates",
  references: "references",
  interests: "interests",
  organizations: "organizations",
  projects: "projects",
  posts: "garden",
  blog: "blog",
  updates: "updates",
  books: "books",
  courses: "courses",
  trips: "travel/cities",
  countries: "travel/countries",
};

/** Every seed file the current record serializes to, repo-relative. */
export function buildContentEntries(): ZipEntry[] {
  const entries: ZipEntry[] = [];

  for (const type of PORTFOLIO_CONTENT_TYPES) {
    const seen = new Set<string>();
    for (const item of ContentService.getAll(type)) {
      let name = markdownFileName(item);
      // Two items with the same title must not silently overwrite each other.
      for (let n = 2; seen.has(name); n++) {
        name = markdownFileName(item).replace(/\.md$/, `-${n}.md`);
      }
      seen.add(name);
      entries.push({
        path: `src/content/${TYPE_DIRS[type]}/${name}`,
        content: toMarkdownFile(item),
      });
    }
  }

  entries.push({
    path: "src/content/settings/profile.md",
    content: toMarkdownFile(ContentService.getSettings()),
  });
  entries.push({
    path: "src/content/settings/site.json",
    content: siteJson(currentSite()),
  });
  entries.push({
    path: "src/content/settings/palette.json",
    content: paletteJson(loadStoredPalette() ?? SEED_PALETTE),
  });

  return entries;
}
