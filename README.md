# TABULARIUM

<div align="center">

![License](https://img.shields.io/github/license/AliKHaliliT/TABULARIUM) ![Last Commit](https://img.shields.io/github/last-commit/AliKHaliliT/TABULARIUM) ![Open Issues](https://img.shields.io/github/issues/AliKHaliliT/TABULARIUM)

![TABULARIUM](util_resources/readme/logo.svg)

**[Live demo](https://alikhalilit.github.io/TABULARIUM/)**

</div>

TABULARIUM is the admin panel of the [VITA](https://github.com/AliKHaliliT/VITA) ecosystem. The Tabularium was Rome's hall of records, and this app plays the same part for a VITA record. It is the one place where every ledger gets written, from content and profile to skills, site identity, and palette, and it is the source of every file the sister apps consume.

The panel is built with React and Vite as a single page with no server. Everything you edit stays in your browser until you choose to publish it. The repository's documentation and engineering conventions follow [My-Styles](https://github.com/AliKHaliliT/My-Styles), aligned to its commit `767fbff`.

---

## The Philosophy: Why Does This Exist?

A content editor is where a file-based record usually goes to die. The moment editing lives in a database, the files stop being the truth and start being an export, and the whole reason for keeping plain files evaporates. The tool becomes load-bearing, and the record can no longer be read without it.

TABULARIUM exists to be an editor that never takes ownership. It stages edits in the browser, and what it hands back is exactly the Markdown and JSON a person would have typed by hand. Panel edits and hand edits coexist because they produce the same bytes, and if the panel disappeared tomorrow the record would be unaffected. That is the test the design has to pass: the editor is disposable, and the files are not.

---

## The Domain: Why an Editor Without a Backend?

Editing a record you do not host is a genuinely awkward problem, which is what makes it worth building against. There is no server to hold a draft, so the browser has to be the staging area. There is no database to enforce a schema, so the record's shape has to be checked on the way in and on the way out. And the destination is a git repository, not a table, so publishing is a merge rather than an update.

That last constraint shapes the most of it. Because the same files can change in the repository while they are being edited here, a push cannot simply overwrite; it needs a per-file three-way merge against the last state the panel saw, conflicts a person resolves one file at a time, and commits that never force. A domain with a server and a single writer would have made all of that unnecessary, and would have taught nothing.

---

## The ecosystem

TABULARIUM is one of three sister repositories.

| App | Role | Demo |
| --- | --- | --- |
| [**VITA**](https://github.com/AliKHaliliT/VITA) | Renders the record as the public site | [alikhalilit.github.io/VITA](https://alikhalilit.github.io/VITA/) |
| **TABULARIUM** (this repo) | Edits every ledger and publishes the seed files | [alikhalilit.github.io/TABULARIUM](https://alikhalilit.github.io/TABULARIUM/) |
| [**EPITOMA**](https://github.com/AliKHaliliT/EPITOMA) | Condenses the record into resumes and CVs | [alikhalilit.github.io/EPITOMA](https://alikhalilit.github.io/EPITOMA/) |

The three apps talk through files rather than imports. Content markdown and the `site.json` and `palette.json` seeds flow to the site, and the `portfolio.json` snapshot flows to the resume builder. This repo carries its copy of the snapshot contract in `src/features/publish/contract.ts`, versioned under the `vita-portfolio` format name.

---

## How the panel works

TABULARIUM is a CMS without a backend. It opens in the browser, seeds itself with the demo record, and stages every edit in localStorage, so editing works offline and nothing leaves the machine while you work. What you edit is not a private database format. The twenty content types are Markdown files with YAML frontmatter, and the identity and palette are small JSON seeds, which is exactly what the site publishes.

Publishing is therefore just a matter of moving files, and the panel offers three ways to do it. The lightest is downloading a single seed after editing it. The middle path is a zip of the whole record, laid out in the site repo's `src/content` structure so it can be dropped straight in. The direct path connects the panel to the repository itself with a fine-grained token that grants contents access on that one repo and is stored only in your browser.

The repository connection treats git as the panel's backend. Every fetch and push runs a per-file three-way merge against the last state the panel saw, so changes made elsewhere and changes made in the panel travel past each other cleanly. A file that changed on both sides comes back as a conflict you resolve by keeping yours or taking theirs, one file at a time. Pushes are atomic commits and the panel never force-pushes, so the repository history stays honest.

Because both sides speak plain files, panel edits and hand edits coexist. You can write one entry in your editor, fix another in the panel, and the merge sorts out who touched what. Once a push lands, the site's Pages workflow rebuilds on its own, and the resume builder can pull the updated record the next time it syncs.

---

## Core Architectural Pillars

1. **The files are the truth, and the panel is disposable.** Every edit is staged in localStorage and published as the same Markdown and JSON a person would write by hand. Nothing here is a private format.
2. **Imports point downward, and a linter says so.** The source tree is five sliced layers, `app -> pages -> features -> entities -> shared`, entered only through each slice's own door. ESLint checks the direction, so an upward import fails the build rather than surviving a diff.
3. **One network door.** Only `shared/api` speaks HTTP. No feature and no component calls `fetch`, which keeps the whole remote surface in one auditable module.
4. **Content is checked at the door.** Everything entering the record passes its contract. This matters more here than anywhere else in the family, because this panel writes out what it reads back, so an unchecked value becomes a committed file.
5. **Git is the backend.** Publishing is a per-file three-way merge against the last seen state, with conflicts resolved one file at a time, atomic commits, and no force-push. The token grants contents access to one repository and never leaves the browser.

---

## Project Structure

```text
tabularium/
├── AGENTS.md              # Agent entry point and the single documentation index
├── docs/                  # Technical documentation, indexed in AGENTS.md
└── src/
    ├── app/               # Composition root: bootstrap, providers, chrome, tokens
    ├── pages/             # The one page, and the parts only it composes
    ├── features/          # edit-record, edit-settings, appearance, site-identity, publish
    ├── entities/          # record (the content model and both its doors), site (identity, palette)
    ├── shared/            # api (the single network door), config, lib, ui, testing
    └── content/           # The demo record this panel edits
```

The annotated map of the whole system, including the layer rule and the sync engine, lives in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Key Features

- **Every ledger in one panel.** Grouped tabs mirror the site's map across System, Career, Writing, and Life, with create, edit, and delete for all twenty content types, a rich-text editor, and open type fields that never gate what a record can hold.
- **Site identity and palette editors.** Both preview live, five palette presets ship with the panel, and a shelf holds the custom palettes you design and save yourself.
- **Three ways to publish.** You can download individual seed files, download the whole record as a zip laid out in the site repo's `src/content` structure, or connect the panel straight to your repository.
- **A real repository connection.** The panel talks to GitHub from the browser with a fine-grained token and treats git as its backend. Connecting validates that the target really is a VITA, fetching and pushing run a per-file three-way merge, files changed on both sides come back as conflicts you resolve one by one, and pushes are atomic commits that never force.
- **Portfolio export.** One click produces the `portfolio.json` snapshot that the resume builder imports, palette included, and the same file doubles as a full backup of the record.
- **Everything local.** Edits live in your browser's localStorage, and nothing leaves the machine unless you download or push it.

---

## Getting Started

The [hosted panel](https://alikhalilit.github.io/TABULARIUM/) works as it stands. It opens seeded with the same fantasy demo record the VITA template ships, and your edits persist in your browser.

To run it locally instead, install and start it like any Vite app.

```powershell
npm install
npm run dev
```

The panel opens on port 3100. VITA runs on 3000 and EPITOMA on 3200, so all three run side by side. Edit anything, then publish through the download buttons, the content zip, or the repository connection. The hosted panel always runs the latest build; a local clone catches up with an ordinary `git pull`.

Contributors and coding agents should start at [`AGENTS.md`](AGENTS.md), which is the vendor-neutral entry point and the full documentation index.

---

## Conventions

The project's conventions live in one place, the rulebook at [docs/CONVENTIONS.md](docs/CONVENTIONS.md). It holds the documentation system (a vendor-neutral [AGENTS.md](AGENTS.md) as the agent entry point and the single index of every document, [STATE.md](STATE.md) as the living project state, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) as the current map, and immutable decision records under [docs/decisions/](docs/decisions/) as the reasoning behind every settled choice), the doc-comment convention in its code-level section, and the prose law in its Prose section. That file is normative and must not be modified; the rationale behind adopting it here is recorded in [the style-alignment decision record](docs/decisions/0009-adopt-the-client-styles-documentation-system.md).

The rulebook is owned at the style level. A project built from this template never changes it locally, and an improvement discovered while refactoring against the template is not kept as a private advantage; [AGENTS.md](AGENTS.md) describes the upstream report that carries it back to the template, where it is verified and, if it holds, adopted for every project that follows the style.

---

## License

This work is under an [MIT](https://choosealicense.com/licenses/mit/) License.
