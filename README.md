# TABULARIUM

<div align="center">

![License](https://img.shields.io/github/license/AliKHaliliT/TABULARIUM) ![Last Commit](https://img.shields.io/github/last-commit/AliKHaliliT/TABULARIUM) ![Open Issues](https://img.shields.io/github/issues/AliKHaliliT/TABULARIUM)

![TABULARIUM](util_resources/readme/logo.svg)

**[Live demo](https://alikhalilit.github.io/TABULARIUM/)**

</div>

TABULARIUM is the admin panel of the [VITA](https://github.com/AliKHaliliT/VITA) ecosystem. The Tabularium was Rome's hall of records, and this app plays the same part for a VITA record. It is the one place where every ledger gets written, from content and profile to skills, site identity, and palette, and it is the source of every file the sister apps consume.

The panel is built with React and Vite as a single page with no server. Everything you edit stays in your browser until you choose to publish it. The repository's documentation and engineering conventions follow [My-Styles](https://github.com/AliKHaliliT/My-Styles).

---

## The ecosystem

TABULARIUM is one of three sister repositories.

| App | Role | Demo |
| --- | --- | --- |
| [**VITA**](https://github.com/AliKHaliliT/VITA) | Renders the record as the public site | [alikhalilit.github.io/VITA](https://alikhalilit.github.io/VITA/) |
| **TABULARIUM** (this repo) | Edits every ledger and publishes the seed files | [alikhalilit.github.io/TABULARIUM](https://alikhalilit.github.io/TABULARIUM/) |
| [**EPITOMA**](https://github.com/AliKHaliliT/EPITOMA) | Condenses the record into resumes and CVs | [alikhalilit.github.io/EPITOMA](https://alikhalilit.github.io/EPITOMA/) |

The three apps talk through files rather than imports. Content markdown and the `site.json` and `palette.json` seeds flow to the site, and the `portfolio.json` snapshot flows to the resume builder. This repo carries its copy of the snapshot contract in `src/types/portfolio.ts`, versioned under the `vita-portfolio` format name.

---

## Features

- **Every ledger in one panel.** Grouped tabs mirror the site's map across System, Career, Writing, and Life, with create, edit, and delete for all nineteen content types, a rich-text editor, and open type fields that never gate what a record can hold.
- **Site identity and palette editors.** Both preview live, five palette presets ship with the panel, and a shelf holds the custom palettes you design and save yourself.
- **Three ways to publish.** You can download individual seed files, download the whole record as a zip laid out in the site repo's `src/content` structure, or connect the panel straight to your repository.
- **A real repository connection.** The panel talks to GitHub from the browser with a fine-grained token and treats git as its backend. Connecting validates that the target really is a VITA, fetching and pushing run a per-file three-way merge, files changed on both sides come back as conflicts you resolve one by one, and pushes are atomic commits that never force.
- **Portfolio export.** One click produces the `portfolio.json` snapshot that the resume builder imports, palette included, and the same file doubles as a full backup of the record.
- **Everything local.** Edits live in your browser's localStorage, and nothing leaves the machine unless you download or push it.

---

## Getting started

The [hosted panel](https://alikhalilit.github.io/TABULARIUM/) works as it stands. It opens seeded with the same fantasy demo record the VITA template ships, and your edits persist in your browser.

To run it locally instead, install and start it like any Vite app.

```powershell
npm install
npm run dev
```

The panel opens on port 3100. VITA runs on 3000 and EPITOMA on 3200, so all three run side by side. Edit anything, then publish through the download buttons, the content zip, or the repository connection.

Contributors and coding agents should start at [`AGENTS.md`](AGENTS.md), which is the vendor-neutral entry point and the full documentation index.

---

## License

This work is under an [MIT](https://choosealicense.com/licenses/mit/) License.
