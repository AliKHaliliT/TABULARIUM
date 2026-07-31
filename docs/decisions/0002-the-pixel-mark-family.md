# 0002. One genome, three marks: TABULARIUM's lintel

Status: Accepted
Date: 2026-07-29

## Context

VITA's brand mark is a 3×2 mosaic of square cells: four ink cells that flip with the
theme (near-black on light, bone-white on dark), the orange "pulse" cell in the top
middle, and the blue "field" cell in the bottom right. When TABULARIUM became a
standalone sister repository it shipped VITA's favicon verbatim, which made the apps
indistinguishable in a tab strip. The owner asked for a mark of its own, derived "by
expanding or adding" to VITA's icon, so the family stays recognizable. (VITA's
decision record 0005 holds the family-wide reasoning.)

## Options considered

- **An unrelated icon.** Rejected: the kinship with VITA and EPITOMA is the point.
- **Keep VITA's mark.** Rejected: identical favicons hide which tab is which.
- **The shared genome with one functional mutation.** Chosen.

## Decision

The mark keeps VITA's genome untouched: the same 3×2 grid, cell size, and spacing;
the pulse and field accents in the same positions; the same theme-flipping ink. Its
one mutation is architectural: a lintel, a single bar laid across the top of the
mosaic. Under a roof, the six cells read as the columns of a records hall, after the
Roman Tabularium on the Capitoline where the state archive lived. The admin panel is
the building that keeps the record, and its mark says so in one stroke.

The mutation is silhouette-level on purpose: at favicon size (16px) only silhouette
survives, so the roofline is what tells this tab apart, not any fine detail.

## Consequences

The mark lives twice, in `public/favicon.svg` and in the BrandMark component in
`src/pages/Admin.tsx`, and the two must stay in sync by hand. The seed colors in the
mark do not follow a custom palette; they are the family's fixed signature. Any
change to the mark's geometry is a family decision, not a repo-local one.
