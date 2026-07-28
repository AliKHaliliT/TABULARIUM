# TABULARIUM

The admin panel of the VITA ecosystem, named for Rome's hall of records. It edits every
ledger of the record (content, profile, skills, site identity, palette), keeps runtime
edits in the browser's localStorage, and exports the artifacts the sister apps consume:
seed files for the VITA site and `portfolio.json` for the EPITOMA resume builder. React
and Vite, one page, no server.

This file is the single entry point for any contributor, human or agent. Read
[STATE.md](STATE.md) first to learn what is in flight, then this file for the rules, then
the indexed document that covers whatever you are about to touch.

## Commands

| Command | Purpose |
| ------- | ------- |
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server on port 3100 (strict) |
| `npm run build` | Type-check then production build to `dist/` |
| `npm test` | Vitest suites for the loader, exports, and identity/palette seeds |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check without emitting |

Run `npm test` after touching `contentLoader`, `contentService`, or `portfolioSnapshot`:
those suites pin parsing, sorting, localStorage fallback, and the export contract.

## Hard rules

These are non-negotiable. Depth lives in the indexed documents; this is the checklist.

- **Prose carries no em dashes.** Not in docs, comments, or UI copy. Use a colon for an
  explanatory clause, a semicolon to join two clauses, or parentheses for an aside.
- **All prose must read as if a person wrote it.** The language-model tells (colon-led
  definitions, balanced semicolon antitheses, triadic lists, not-X-but-Y reversals) are fine
  one at a time and forbidden stacked: at most one such flourish per paragraph.
- **Motion runs behind `LazyMotion` strict** (`domAnimation` features): always import and
  use `m.` from framer-motion, never `motion.` (a `motion.` component throws at runtime).
- **Colors come from CSS variables** (`--color-card`, `--color-signal`, and so on); never
  hardcode a color. The design language is the dossier: data is square, actions are round,
  one working accent.
- **Self-containment.** This app imports only npm packages plus its own `src/`. The shared
  core (`types/content.ts`, the services, the lib modules) is this repo's own copy; sister
  repos share by copying, never by importing, and the portfolio contract's
  `format`/`version` fields keep the sides honest.
- **Edits go to localStorage** (`os_content_<type>`, `os_settings`, `os_site`,
  `os_palette`); the markdown under `src/content/` is seed data only, and publishing an
  edit means downloading the file and committing it to the VITA repo.
- **Never use `type` as a frontmatter key** (it collides with the internal `ContentType`
  field). Use the specific name: `employmentType`, `awardType`, `updateType`, `pubType`,
  `speakingType`, `certType`, `memberType`. The `posts` type is the exception; its
  frontmatter `type` is remapped to `postType` in the loader.
- **Markdown formatting.** Every fenced block gets a language identifier; lists and fences
  are surrounded by blank lines (MD031, MD032, MD040).

## Documentation index

A document that is not listed here does not exist: no reader can be expected to find it.
Register a new document in this table in the same change that creates it.

| Document | Species | Read it when |
| -------- | ------- | ------------ |
| [STATE.md](STATE.md) | living | Always first: what is Now, Next, Deferred, or Blocked |
| [README.md](README.md) | living | Human-facing overview and getting started |
| [CHANGELOG.md](CHANGELOG.md) | records | What shipped, per release |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | living | Before any structural change: data flow, exports, boundaries |
| [docs/BASELINE.md](docs/BASELINE.md) | living | Which root files must exist, which are never tracked, and why |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | living, frozen | Before writing any document: the rulebook, never edited directly |
| [docs/decisions/](docs/decisions/) | records | Why a durable choice was made; cite by number, never edit |

There are no assistant-specific instruction files: every agent reads this one.
