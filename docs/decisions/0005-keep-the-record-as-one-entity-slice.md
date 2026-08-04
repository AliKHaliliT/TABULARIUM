# 0005. Keep the record as one entity slice

Status: Accepted
Date: 2026-08-04

## Context

Adopting sliced layers ([decision 0004](0004-build-the-panel-as-one-way-sliced-layers.md))
raised the question of how many entity slices the panel needs. It knows sixteen
content types, so the obvious reading is sixteen slices.

The content model does not work that way. Every type extends one `BaseContent`
shape, differing only in a few structured fields, and one generic loader keyed by
type reads them all. The panel leans on that genericity harder than its sibling
site does, because a single set of table, form, and draft components serves every
type; the tab decides which fields to render, not a per-type component.

## Options considered

- **One slice per content type.** Rejected. `AnyContentItem` and `ContentType` are
  used by the loader, the store, the edit machinery, and the publish feature, so the
  union would have to sit below all sixteen slices in `shared`, where the layering
  stops meaning anything. The edit machinery would then import sixteen slices to
  render one form.
- **Slices grouped by domain kinship.** Rejected: the groupings are arbitrary at the
  edges and each group would still need the shared base type from below.
- **One `record` slice, with `site` beside it.** Accepted.

## Decision

The entity layer holds two slices. `entities/record` owns the content union, both of
its doors, and the collections the tabs read and write. `entities/site` owns
file-seeded identity and appearance, which is a different noun with its own storage
keys and its own seed files.

Internal structure inside the record slice carries the weight separate slices would
have: `model.ts`, `schema.ts`, `seed.ts`, `store.ts`, and the context trio, all
behind one `index.ts`.

## Consequences

The union stays in the layer that owns it, and the generic editing surfaces that are
the panel's whole reason for existing enter through one door. The record slice is
the largest thing in the source tree, which is the accepted cost.

This decision is deliberately identical to the one taken in the companion site, so
the two repositories that share the content model also share its shape. Propagating
a model change by hand remains the ecosystem's method, and matching structure makes
the diff between the two copies easier to read.
