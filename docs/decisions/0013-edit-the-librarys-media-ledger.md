# 0013. Edit the library's media ledger

Status: Accepted
Date: 2026-08-31

## Context

The VITA template grew a `media` content type (its decision 0017): the library
now shelves films, series, anime, and games beside books, categorized by an
open `medium` string. This panel claims every ledger of the record, so a
collection it cannot edit would rot that claim, and the snapshot contract both
sister repositories copy gained the new collection name additively at
version 1.

## Options considered

- A closed medium dropdown (film / series / anime / game). Lost because the
  field is open by design upstream; a select would gate what a shelf can be,
  which is exactly what the family's open-type convention forbids.
- Reuse the book form for media. Lost because the fields differ (creator
  against author, medium against nothing, a free status against a fixed
  triad), and a shared form would carry dead fields for both.

## Decision

Mirror the `media` type into this repo's model copy, loader, provider, and
context. Give it a tab in the Life group, a form whose medium and status
fields are free text with the site's stage heuristic explained in their
labels, a default draft of a queued film, and a row in the folder map so the
zip bundle and the repository push serialize it to `src/content/media/`. Add
`media` to the snapshot contract copy in the same place the template put it,
and carry the template's five demo entries so the panel opens with the shelf
populated.

## Consequences

The panel edits all twenty content types, and the README says twenty where it
said nineteen. The generic markdown serializer needed no change, since it
already writes every set field. A media entry downloaded, zipped, or pushed
lands exactly where the site's loader globs it.
