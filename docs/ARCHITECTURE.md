# Architecture

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (design tokens in `src/app/styles/tokens.css`) |
| Content | Markdown seed files + `front-matter` (YAML parsing) |
| Rich text | `react-quill-new` + `showdown` (Markdown to HTML) + `turndown` (HTML back) |
| Animation | Framer Motion behind `LazyMotion` (`domAnimation`, strict) |
| Testing | Vitest (`npm test`): characterization suites for the services and seeds |

## The layers and their one rule

The panel is built as one-way sliced layers. Imports point downward, never up or
sideways:

```text
app  ->  pages  ->  features  ->  entities  ->  shared
```

- **app** is the composition root: the bootstrap, the provider stack, and the chrome.
- **pages** is the one page, plus the parts only it composes (the tab strip and the
  Settings tab, which arranges three features side by side).
- **features** are the interactions with logic of their own: editing a record entry,
  editing the owner profile, appearance, site identity, and publishing.
- **entities** are the domain nouns. `record` owns the content model, both of its doors,
  and the collections every tab reads; `site` owns file-seeded identity and appearance.
- **shared** is the base: the GitHub API client, typed configuration, the small libraries,
  the UI kit, and the test helpers.

A slice is entered only through its `index.ts`, suites excepted. Same-layer slices do not
import each other, which is the reason `publish` is one feature rather than two: the repo
sync and the zip export both serialize the record through the same bundle, and splitting
them would make one feature import another. The reasoning is recorded in
[decision 0004](decisions/0004-build-the-panel-as-one-way-sliced-layers.md), and the choice
to keep the record as a single entity slice in
[decision 0005](decisions/0005-keep-the-record-as-one-entity-slice.md).

## The shape of the app

One page. `src/app/App.tsx` composes the providers and the chrome around
`src/pages/admin/AdminPage.tsx`, which is the whole product: a grouped tab bar (System,
Career, Writing, Life), per-type content tables with create, edit, and delete, and the
special-cased Site, Profile, Skills, and Appearance tabs. There is no router and no server.

## Data flow

```text
src/content/**/*.md (demo seed)
  -> entities/record/seed.ts     import.meta.glob at build time; parses and checks frontmatter
  -> entities/record/store.ts    checks localStorage first, falls back to the parsed files
  -> entities/record/context.ts  React context; typed collections + writers
  -> the admin tabs              consume via useContent()
```

Edits are stored in localStorage under `os_content_<type>` and `os_settings` and shadow
the seed; clearing browser storage resets everything, which is intentional. Saves record a
fingerprint of the bundled seed so a rebuild that changes shadowed markdown logs a console
warning naming the key to clear. All writes go through `safeSetItem`
(`src/shared/lib/storage.ts`).

## The record boundary

Content reaches the panel through two doors, and neither is trusted by construction.
`entities/record/schema.ts` holds the contract both are checked against, and a violation
becomes a `RecordContractError` naming the file or the storage key.

The two doors fail differently on purpose. Bundled markdown is committed content, so a
file whose frontmatter cannot produce a valid item is an authoring bug and the loader
throws with the path. The localStorage override is what this panel and its predecessors
wrote, so a malformed value reports the key to clear and the committed seed is served
instead, which keeps a stale key from breaking the editor that has to fix it. See
[decision 0006](decisions/0006-guard-the-record-with-hand-written-validators.md).

## What the panel exports

This app is the ecosystem's only writer; everything it produces is a file the sister repos
commit or import:

- **Content markdown** per item (Download MD in any table), destined for the VITA repo's
  `src/content/<type>/`.
- **`site.json` and `palette.json`** from the Site and Appearance tabs, the identity and
  palette seeds the VITA build bakes into its `index.html`.
- **`portfolio.json`** from Site, Portfolio export (`src/features/publish/snapshot.ts`,
  contract in `src/features/publish/contract.ts`, format `vita-portfolio`, versioned): the
  full record snapshot the EPITOMA builder imports, doubling as a backup format.

## The shared core

`src/entities/record/model.ts`, the record's doors, its context, and the small modules
(labels, linkIcons, palette, site, text, and friends) are this repo's own copies of code
that also lives in VITA. The ecosystem shares by copying, never by importing, so a change to the content
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

## The repository connection

Git is the panel's backend, reached straight from the browser over the GitHub REST API
with a fine-grained token (Contents read/write on the one site repo) that never leaves
localStorage. `shared/api/github.ts` is the thin API client, the one module that speaks
HTTP; `features/publish/repoSync.ts` is the engine. A connect first validates that the target actually is a VITA (it must
carry `src/content/settings/site.json` and `profile.md`) and refuses anything else.

Sync is a per-file three-way merge. The blob shas recorded at the last fetch or push are
the base, the serialized local record is ours, the branch head is theirs; local blob shas
are computed in the browser (git's own `blob` hash via WebCrypto), so planning needs no
downloads. Files only one side touched sync silently; files both sides touched surface in
the UI as conflicts resolved per file (keep mine or take theirs), covering the
edited-here-deleted-there cases too. Pushes go through the Git Data API as one atomic
commit and never force: if the branch moves mid-push, GitHub rejects the ref update and
the user fetches first. Files under `src/content` that the panel does not model are
invisible to sync and can never be deleted by a push. The first connect has no base, so
the owner picks a direction explicitly: adopt the repository (replace the local record) or
push the local record wholesale.

## The zip bundle

For the no-repo workflow, the export card serializes the same record to seed files (every
item as markdown plus the three settings seeds, in the site repo's `src/content` layout)
and packs them with `shared/lib/zip.ts`, a dependency-free STORE-method zip writer. The manual
contract is unzip, diff, commit: the archive cannot delete files, so removals made in the
panel must be mirrored by hand, and it knows nothing about edits made in the repo since
the record was last fetched.

## Testing

Three rules hold however broad the suite is. Suites live in `tests/`, mirroring the source
tree, one suite named after the unit it covers. A collaborator is replaced only at an
architectural seam, by a hand-written fake satisfying the contract it stands in for, never by
mocking a module's internals, since a test bound to an implementation voids the
substitutability the layering exists to provide. And no coverage threshold is imposed, because
a percentage gate buys assertions that assert nothing, so breadth stays a judgment call while
placement and substitution do not.

The 6 suites here are characterization tests over the content loader, the publish exports, and the identity and palette seeds. They contain no module
mocking at all, which is what made adopting the rule a description of existing practice rather
than a migration. The reasoning is recorded in
[decision 0010](decisions/0010-adopt-the-styles-test-contract.md), and the rule itself is owned by the style.
