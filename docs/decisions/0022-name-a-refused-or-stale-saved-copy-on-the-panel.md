# 0022. Name a refused or stale saved copy on the panel

Status: Accepted
Date: 2026-09-24

## Context

The style's next alignment brings a lint rule that refuses any `console` call in
product code, with the instruction that a diagnostic goes where the failure path
already sends it and never to the console. The record's door printed three console
lines. Two named the key when a broken override or a broken profile was refused, the
promise [decision 0006, Guard the record with hand-written validators](0006-guard-the-record-with-hand-written-validators.md)
makes when it says a broken key degrades to the seed with the cause named. The third
warned, once a session, that the published markdown under a saved collection had
changed while the saved copy still won, and it was the only thing that told the
owner the panel was showing an older copy than the site's. The storage helper also
printed a console error beside the alert it raises when a write fails. The owner
chose, for the site that shares this record's door, to name such copies on the page,
and the panel follows the same form.

## Evidence

A production build served locally, with a corrupt `os_content_books` and a valid
`os_content_projects` whose recorded fingerprint no longer matched the seed planted in
storage, rendered one notice with both lines. The projects line said the published
projects changed after the saved copy was made and the saved copy still wins, and
the books line named the key with the reason the check gave,
`Expected property name or '}' in JSON at position 1 (line 1 column 2)`. With storage
cleared it rendered nothing.

The door had no suite of its own, and the one written for this change was mutated
nine ways before it landed: no refusal recorded, a read that never forgets, a stale
copy never noted, a stale note raised when the seed matches, a save that keeps its
note, a profile save that keeps its note, unreadable storage left to throw, the
profile's refusal filed under the wrong collection, and an empty list always
returned. A test failed for each.

## Options considered

- Drop the stale warning, as the site did for its stale drop. Refused, because the
  site drops a stale copy and has nothing left to say, while the panel keeps serving
  it, and an owner editing an older copy than the published one should be told.
- Drop the diagnostics and supersede the promise. Refused, for the reason the owner
  gave for the site, since a refused copy would then fail with no explanation at all.

## Decision

The door notes each saved copy worth naming, a refused one with its key, the
collection it claimed, and the check's reason, and a stale one with its key and the
collection, and it forgets the note once the key reads cleanly, is saved afresh, or
holds nothing. The context carries the notes, and the shell renders a small notice
when there are any, one line per key, dismissible for the page view. Storage that
cannot be read at all holds nothing to name. The storage helper keeps its one-time
alert and loses its console line.

## Consequences

The owner learns in the panel itself when a saved copy was refused or has fallen
behind the published markdown, and which key to clear. The door now has a suite that
pins both kinds of note.
