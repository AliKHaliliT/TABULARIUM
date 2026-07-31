# TABULARIUM

<div align="center">

![License](https://img.shields.io/github/license/AliKHaliliT/TABULARIUM) ![Last Commit](https://img.shields.io/github/last-commit/AliKHaliliT/TABULARIUM) ![Open Issues](https://img.shields.io/github/issues/AliKHaliliT/TABULARIUM)

![TABULARIUM](util_resources/readme/logo.svg)

**[Live demo](https://alikhalilit.github.io/TABULARIUM/)**

</div>

**The admin panel of the [VITA](https://github.com/AliKHaliliT/VITA) ecosystem.** The Tabularium was Rome's hall of records, and that is what this app is to a VITA record: the one place where every ledger (content, profile, skills, site identity, palette) gets written, and the source of every file the sister apps consume.

Built with React + Vite, one page, no server. Everything you edit stays in your browser until you publish it. The repository's documentation and engineering conventions follow [My-Styles](https://github.com/AliKHaliliT/My-Styles).

---

## The ecosystem

TABULARIUM is one of three sister repositories:

| App | Role | Demo |
| --- | --- | --- |
| [**VITA**](https://github.com/AliKHaliliT/VITA) | The site: renders the record | [alikhalilit.github.io/VITA](https://alikhalilit.github.io/VITA/) |
| **TABULARIUM** (this repo) | The admin panel: edits every ledger | [alikhalilit.github.io/TABULARIUM](https://alikhalilit.github.io/TABULARIUM/) |
| [**EPITOMA**](https://github.com/AliKHaliliT/EPITOMA) | The resume builder: condenses the record | [alikhalilit.github.io/EPITOMA](https://alikhalilit.github.io/EPITOMA/) |

All three talk through files rather than imports: content markdown and the `site.json`/`palette.json` seeds flow to the site, and the `portfolio.json` snapshot (contract in `src/types/portfolio.ts`, format `vita-portfolio`, versioned) flows to the builder.

---

## Features

- **Every ledger in one panel.** Grouped tabs mirror the site's map (System, Career, Writing, Life) with create, edit, and delete for all nineteen content types, a rich-text editor, and open type fields that never gate what a record can hold.
- **Site identity and palette editors** with live previews, five palette presets, and a shelf for custom palettes you design and save yourself.
- **Publish three ways.** Download individual seed files, download the whole record as a zip laid out in the site repo's `src/content` structure, or connect the panel straight to your repository.
- **A real repository connection.** Git as the backend, straight from the browser with a fine-grained token: connect validates the target is a VITA, fetch and push run a per-file three-way merge, files changed on both sides come back as conflicts you resolve one by one, and pushes are atomic commits that never force.
- **Portfolio export.** One click produces the `portfolio.json` snapshot (palette included) that the resume builder imports, which doubles as a full backup of the record.
- **Everything local.** Edits live in your browser's localStorage; nothing leaves the machine unless you download or push it.

---

## Getting started

The [hosted panel](https://alikhalilit.github.io/TABULARIUM/) works as-is: it opens seeded with the same fantasy demo record the VITA template ships, and your edits persist in your browser.

To run it locally:

```powershell
npm install
npm run dev
```

The panel opens on port 3100 (VITA runs on 3000 and EPITOMA on 3200, so all three run side by side). Edit anything, then publish through Site → the download buttons, the content zip, or the repository connection.

For contributors and coding agents, see [`AGENTS.md`](AGENTS.md): the vendor-neutral entry point and the full documentation index.

---

## License

This work is under an [MIT](https://choosealicense.com/licenses/mit/) License.
