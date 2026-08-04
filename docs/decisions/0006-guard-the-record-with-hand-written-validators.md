# 0006. Guard the record with hand-written validators

Status: Accepted
Date: 2026-08-04

## Context

Content entered the panel through two unchecked doors. The markdown loader
assembled an item out of frontmatter and cast it with
`as unknown as AnyContentItem[]`, and the store read the localStorage override with
`JSON.parse` and returned the result as domain types directly.

The panel is the ecosystem's only writer, which makes an unchecked read worse here
than elsewhere. Everything it reads back it will eventually serialize to markdown,
push to a repository, or pack into a portfolio snapshot, so a malformed value does
not merely break a screen; it can be written out as if it were the record. The keys
also outlive any single version of the panel, since they persist in a browser across
deploys.

## Options considered

- **Leave the casts.** Rejected: the panel writes what it reads, so a bad value
  propagates into files the sister repositories commit.
- **Adopt a schema library.** Rejected. It is the client template's instrument and a
  good one, but this repository already validates by hand-written type guard
  (`isSiteIdentity` predates this decision) and the shapes are shallow. Consistency
  with the code already here beat consistency with the template.
- **Hand-written validators plus a named error.** Accepted.

## Decision

`entities/record/schema.ts` holds the contract and a `RecordContractError` naming
the file or storage key the offending value came from. Both doors run through it and
fail differently:

- The **seed** is committed content, so a file whose frontmatter cannot produce a
  valid item throws with the markdown path, and the suite that loads every type turns
  that into a failing test.
- The **override** is what this panel and its predecessors wrote, so a malformed value
  reports the key to clear and the committed seed is served instead. Failing hard
  there would break the one tool capable of fixing the bad value.

Only invariants every consumer depends on are checked: the value is a list, each item
is an object with a usable id, each item's `type` matches the collection it was filed
under, and `tags` is a list when present.

## Consequences

The loader's return type is earned rather than asserted, and a stale or wrong-shaped
key degrades to the committed seed with the cause named. The guards are the same ones
the companion site uses, so the two copies of the content model now agree on what
counts as valid.

The checks are deliberately shallow, so a value can satisfy them and still be missing
a field some form wants. That is the accepted limit: per-type depth would have to be
maintained against the model forever, in two repositories, to stay honest.
