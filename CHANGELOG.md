# Changelog

Notable changes, written for people who use the panel. This file is a set of records: once
a version is cut its entry is written once and never edited. The format follows Keep a
Changelog; the Unreleased section is the staging area until the first version is tagged.

## Unreleased

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
