# 0014. Edit the pin and the section order

Status: Accepted
Date: 2026-08-31

## Context

The template let owners pin entries to the front of their section and choose
alphabetical or chronological order per section through a new settings seed,
`ordering.json` (its decision 0018). Both are owner choices this panel must be
able to make, or the record grows knobs only hand edits can reach.

## Options considered

- A pin input inside each of the nineteen type forms. Lost because the field
  is identical everywhere; the edit modal renders it once below whatever form
  is open, so every collection gets it for the cost of one.
- A dedicated Ordering tab in the strip. Lost because the tab strip's guards
  name the settings surfaces in four places and ordering is site-level
  configuration like the identity; a card on the existing Settings tab costs
  no new tab plumbing.
- Offering ordering rows for the travel collections. Lost because the site's
  atlas orders itself hierarchically and would ignore the choice; a select
  that does nothing is a false promise, so those rows do not exist.

## Decision

Mirror the `pin` field into the model copy and render one Pin input in the
edit modal for every collection, normalized to a number or removed on save.
Add an `ordering.ts` module to the site entity following the identity's
pattern (seed json, an `os_ordering` browser draft, download as the exact
seed-file format), and an Ordering card on the Settings tab listing every
policy-honoring section plus one row per library shelf the media collection
currently names. The zip bundle and the repository push now carry
`settings/ordering.json` beside the other settings seeds, and the panel's
seed mirrors the template's demo file.

## Consequences

Choosing what a section fronts and how it sorts is now panel work: set pins
on entries, pick policies on the Settings tab, and publish. The bundle grew
one file, which the per-file three-way merge treats like any other seed. The
panel's own ledger lists keep their loader order and do not re-sort by the
draft policies; the card says plainly that saving affects this browser and
publishing affects the site.
