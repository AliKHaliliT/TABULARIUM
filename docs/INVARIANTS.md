# Invariants

What must stay true about this panel, one row per claim, each bound to the holder that refuses a violation and graded by what its green is worth. The rulebook's section on the invariants ledger defines the columns and the five rungs; the docs audit holds that every holder is in the tree and prints every claim held by review alone on every run, and whether a claim is true stays with review.

| Claim | Held by | Rung |
| --- | --- | --- |
| Imports point downward only, from app through pages, features, and entities to shared, never back up. | `eslint.config.js` "Imports point downward only" | impossible |
| A slice is entered only through its `index.ts`. | `eslint.config.js` "Enter a slice through its index.ts" | impossible |
| The environment is read only through `shared/config`. | `eslint.config.js` "Read the environment through shared/config" | impossible |
| Only `shared/api` calls `fetch`, so the GitHub client is the one network door. | `eslint.config.js` "HTTP lives in its documented home" | impossible |
| Nothing in product code prints to the console. | `eslint.config.js` "no-console" | impossible |
| Colors come only from the token utilities, and no raw palette class ships. | `scripts/audit-docs.mjs` "raw palette class" | impossible |
| No test opens a connection to a host beyond this machine. | `tests/setup.ts` "refused a connection" | impossible |
| A committed markdown file whose frontmatter cannot make an item is refused with the file named. | `tests/src/entities/record/schema.test.ts` "names the markdown file when frontmatter cannot make an item" | listed cases |
| A saved copy that breaks the record's contract never reaches the editor, and its key is named. | `tests/src/entities/record/store.test.ts` "falls back to the seed and names the key refused when the override is corrupt JSON" | listed cases |
| A saved copy that outlived a changed seed is still served, and it is named as stale. | `tests/src/entities/record/store.test.ts` "keeps serving an override that outlived a changed seed, and names it stale" | listed cases |
| The portfolio export round-trips through its file format with the contract fields intact. | `tests/src/features/publish/snapshot.test.ts` "round-trips through the file format with the contract fields intact" | listed cases |
| A malformed saved identity or palette is refused instead of thrown. | `tests/src/entities/site/identity.test.ts` "rejects malformed payloads instead of throwing" | listed cases |
| Only a browser holding a saved copy the door refused or found stale shows the saved-copy notice. | review | review |
