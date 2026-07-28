# Architecture

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (design tokens in `src/index.css`) |
| Content | Markdown seed files + `front-matter` (YAML parsing) |
| Rich text | `react-quill-new` + `showdown` (Markdown to HTML) + `turndown` (HTML back) |
| Animation | Framer Motion behind `LazyMotion` (`domAnimation`, strict) |
| Testing | Vitest (`npm test`): characterization suites for the services and seeds |

## The shape of the app

One page. `src/App.tsx` provides the motion runtime, the `ContentProvider`, and the
reading rail; `src/admin/pages/Admin.tsx` is the whole product: a grouped tab bar (System,
Career, Writing, Life), per-type content tables with create, edit, and delete, and the
special-cased Site, Profile, Skills, and Appearance tabs. There is no router and no server.

## Data flow

```text
src/content/**/*.md (demo seed)
  -> contentLoader.ts          import.meta.glob at build time; parses frontmatter
  -> ContentService.getAll()   checks localStorage first, falls back to parsed files
  -> ContentContext            React Context; typed arrays + CRUD methods
  -> Admin tabs                consume via useContent()
```

Edits are stored in localStorage under `os_content_<type>` and `os_settings` and shadow
the seed; clearing browser storage resets everything, which is intentional. Saves record a
fingerprint of the bundled seed so a rebuild that changes shadowed markdown logs a console
warning naming the key to clear. All writes go through `safeSetItem`
(`src/lib/storage.ts`).

## What the panel exports

This app is the ecosystem's only writer; everything it produces is a file the sister repos
commit or import:

- **Content markdown** per item (Download MD in any table), destined for the VITA repo's
  `src/content/<type>/`.
- **`site.json` and `palette.json`** from the Site and Appearance tabs, the identity and
  palette seeds the VITA build bakes into its `index.html`.
- **`portfolio.json`** from Site, Portfolio export (`src/services/portfolioSnapshot.ts`,
  contract in `src/types/portfolio.ts`, format `vita-portfolio`, versioned): the full
  record snapshot the EPITOMA builder imports, doubling as a backup format.

## The shared core

`src/types/content.ts`, the services, the context, and the lib modules (labels, linkIcons,
palette, site, text, and friends) are this repo's own copies of code that also lives in
VITA. The ecosystem shares by copying, never by importing, so a change to the content
model or the portfolio contract must be propagated to the sister repos by hand; the
characterization tests on each side pin the behavior that must stay in agreement.

## Known constraints

- The bundled seed is the fantasy demo record; the panel edits localStorage shadows of it.
  Editing a real record means seeding these folders with the real markdown or accepting
  the shadow workflow.
- Everything is client-side; there is no authentication because there is nothing remote to
  protect.
- The `settings` content type is a single object, not an array, and is handled separately
  in the service and context.
