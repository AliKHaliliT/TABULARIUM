# 0004. Build the panel as one-way sliced layers

Status: Accepted
Date: 2026-08-04

## Context

The panel grew from a scaffold, so its source tree grouped files by technical kind:
`components/` beside `lib/`, `services/`, `context/`, `types/`, and `hooks/`. That
answers "what sort of file is this" and says nothing about which way a dependency
is allowed to run.

The symptoms were concrete. `components/` held nineteen files at one level, mixing
a tab strip, seven editing surfaces, three export cards, and two form helpers, so
nothing distinguished a part with logic from a part that only arranges other parts.
`AdminTabs.tsx` exported both the tab strip and the `AdminTab` type that the whole
edit machinery switches on, which made the editing code depend on a piece of page
chrome. And `App.tsx` carried the motion runtime, the provider, and the chrome at
once.

The sibling repositories of this ecosystem were moving to the same shape at the
same time, so a reader who learns one learns all three.

## Options considered

- **Leave the kind-based tree and document the intended direction.** Rejected: an
  unenforced direction is what produced the tangle being fixed.
- **Split `components/` into subfolders by area.** Rejected: it tidies the symptom
  and leaves every import direction legal, so the tab strip would still be able to
  hand a type to the editing code.
- **One-way sliced layers.** Accepted.

## Decision

Source lives in five layers, and imports point downward only:

```text
app  ->  pages  ->  features  ->  entities  ->  shared
```

A slice is entered through its `index.ts`, suites excepted, and same-layer slices
do not import each other.

Three consequences shaped the layout. The `AdminTab` type moved into the
`edit-record` feature and the tab strip now reads it from there, inverting the old
dependency so the feature no longer leans on the page. The Settings tab stayed with
the page, because it only arranges three features side by side and a feature may
not import a sibling. And the repo sync and the zip export became one `publish`
feature rather than two, because both serialize the record through the same bundle,
which spans the record and the site and therefore cannot sit in either entity
slice.

The GitHub client moved to `shared/api`, which makes it the one module in the panel
that speaks HTTP.

## Consequences

The direction of every dependency is now a property of where a file sits. Splitting
the content provider from its hook also removed an ESLint exemption that existed
only to tolerate a file exporting a component beside its hook.

The `publish` feature is the honest cost: it is larger than the others and covers
three outputs (a portfolio snapshot, a seed-file zip, and a repository sync) because
they share the bundle. The alternative was inverting the bundle's dependencies so it
took the site identity and palette as arguments, which would allow two smaller
features; that remains available if `publish` grows uncomfortable. No linter checks
the layer rule yet, so it is enforced by review, and a boundary linter is recorded as
deferred rather than adopted unproven.
