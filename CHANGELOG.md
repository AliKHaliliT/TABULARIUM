# Changelog

Notable changes, written for people who use the panel. This file is a set of records: once
a version is cut its entry is written once and never edited. The format follows Keep a
Changelog; the Unreleased section is the staging area until the first version is tagged.

## Unreleased

### Changed

- Restructured the source tree into one-way sliced layers
  (`app -> pages -> features -> entities -> shared`), each slice entered through its own
  public door, with the composition root split into a bootstrap, a provider stack, and the
  chrome. The tab type moved into the editing feature so the feature no longer depends on
  the page that displays it, and the GitHub client became the panel's single network door.
  Suites moved to a `tests/` tree mirroring `src/`.
- Content is now checked as it enters the record. A bundled markdown file whose frontmatter
  cannot produce a valid item fails with the path named, and a localStorage value that
  breaks the contract falls back to the committed seed with the key to clear named. This
  matters most here, because the panel writes out what it reads back.

### Added

- The admin panel as a standalone app, extracted from the VITA repository: grouped tabs
  (System, Career, Writing, Life), full CRUD for every content type, and the special-cased
  Site, Profile, Skills, and Appearance editors.
- This repo's own copy of the shared core (content types, loader, service, context, and
  the lib modules), following the ecosystem rule that sister repos share by copying.
- The export surfaces the ecosystem runs on: per-item content markdown, the `site.json`
  and `palette.json` seeds, and the `portfolio.json` snapshot (format `vita-portfolio`,
  versioned) that feeds the resume builder.
- The fantasy demo record as the bundled seed, mirroring the VITA site.
- The house documentation system and repository baseline.
- A GitHub repository connection: git as the backend, straight from the browser. Connect
  validates the target is a real VITA, fetch and push run a per-file three-way merge, and
  files changed on both sides come back as conflicts resolved one by one; pushes are
  atomic commits that never force.
- The house theme switch, and the owner's palette riding inside the portfolio export so
  the sister apps adopt the chosen look.
- A content bundle download: the whole record serialized to seed files in the site repo's
  src/content layout, zipped by a small dependency-free writer, for editing without a
  connected repository.
- The TABULARIUM identity: the app wears its name and a pixel mark derived from VITA's
  (the mosaic under a lintel, read as a records hall), in the header and the favicon.
