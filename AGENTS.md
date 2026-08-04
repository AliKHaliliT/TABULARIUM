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
| `npx tsc -b` | Type-check all projects (the root tsconfig is solution-style; a plain `tsc --noEmit` checks nothing) |

Run `npm test` after touching the record's `seed`, `store`, or `schema`, or the publish
`snapshot`: those suites pin parsing, sorting, localStorage fallback, the record
contract, and the export contract.

## Hard rules

These are non-negotiable. Depth lives in the indexed documents; this is the checklist.

- **Prose carries no em dashes.** Not in docs, comments, or UI copy. Use a semicolon to
  join two clauses or parentheses for an aside.
- **All prose must read as if a person wrote it.** Never write the clause-colon splice, a
  sentence shaped as claim, colon, elaboration; in prose a colon may only introduce a
  list, a quote, or a label. The softer language-model tells (balanced semicolon
  antitheses, triadic lists, not-X-but-Y reversals) are fine one at a time and forbidden
  stacked, so allow at most one flourish per paragraph and keep the rest plain declarative
  sentences.
- **Every tracked byte is public prose.** Confidential facts, private repository names,
  deployment details, and the description of what was withheld and why never enter a
  tracked file or a commit message, even in a private repository, because visibility can
  flip and history is permanent. Such context goes to the untracked `LOCAL.md` at the root
  (see [docs/BASELINE.md](docs/BASELINE.md)); read it when it exists, create it when first
  needed, and when unsure whether a fact is sensitive, ask the owner instead of recording
  it.
- **The layer rule is absolute.** Imports point downward through
  `app -> pages -> features -> entities -> shared`, never up or sideways. A slice is
  entered only through its `index.ts` (suites excepted), and same-layer slices never
  import each other; a concern spanning two of them moves up a layer or inverts its
  dependencies. See
  [decision 0004](docs/decisions/0004-build-the-panel-as-one-way-sliced-layers.md).
- **Content is checked at the door.** Everything entering the record passes through
  `entities/record/schema.ts`; never widen a type with a cast to make a value fit. This
  panel writes what it reads, so an unchecked value becomes a committed file. See
  [decision 0006](docs/decisions/0006-guard-the-record-with-hand-written-validators.md).
- **Only `shared/api` speaks HTTP.** The GitHub client is the single network door; no
  feature or component calls `fetch` directly.
- **The environment is read only through `shared/config`.** No other module touches
  `import.meta.env`.
- **Motion runs behind `LazyMotion` strict** (`domAnimation` features): always import and
  use `m.` from framer-motion, never `motion.` (a `motion.` component throws at runtime).
- **Colors come only from the token utilities** defined in `src/app/styles/tokens.css`
  (`bg-surface`, `text-ink`, `border-line`, `text-signal`, and so on). Never hardcode a
  color, never reach for a raw palette class, and never spell a token the long way as
  `bg-[var(--surface)]`; a composite value such as a `color-mix()` is the only place the
  variable itself appears. The design language is the dossier: data is square, actions are
  round, one working accent.
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
