# 0015. Align with the adoption gate and the mechanical tree checks

Status: Accepted
Date: 2026-09-03

## Context

The style moved past the commit this project was aligned to, and the family
refuses ratcheting, so the wave lands complete or not at all. Since that pin the
style defined when a re-alignment is done, moved the code-level documentation
convention out of the README and into the rulebook, shortened the `Now` horizon
to thirty days, and taught the docs audit to hold the tree itself: every
directory and root file needs a room in the map or the baseline, and every record
its immutability across git history. The reasoning lives in the style's records
0035 through 0037, once, and is not repeated here.

## Evidence

The re-copied audit reported fourteen findings against this tree before any fix,
because the map carried the layer diagram and the data flow but never drew the
tree itself, so eight directories and six root files had no room. The new
`jsdoc/check-param-names` rule found four real drifts: three docstrings naming a
`config` parameter the signatures call `cfg`, in the repository sync and the
GitHub client, and one naming `nowIso` for a parameter called `exportedAt` in the
snapshot builder. After the fixes the docs audit, lint, type-check, the ninety
suites, and the build all passed against the final tree.

## Options considered

- Point the audit at the README's condensed tree, which already existed. Lost
  because the rule says a room lives in the map or the baseline, and the README
  tree is a summary that deliberately stops at one level.
- Rename the `cfg` parameters to match their docstrings instead. Lost because the
  name in the signature is the one every caller reads; the comment was the half
  that had gone stale.

## Decision

Re-copy `docs/CONVENTIONS.md` and `scripts/audit-docs.mjs` from the style and
take the template's finished CI workflow, which brings the full-history clone,
the audit after the install, and both new pins. Draw the whole tree into the map,
add an Exemplars section, adopt `jsdoc/check-param-names` and fix the four
docstrings it flagged, carry the baseline's two README schema changes, collapse
the README's Conventions section to the two canonical paragraphs, name the
template commit in the attribution, and carry the guide's new clauses.

## Consequences

A new directory or root file here now fails the audit until the map admits it,
which is what the map being complete buys. CI clones full history, costing a
little time and buying the record-immutability check. The README carries no law
of its own, so a convention question has exactly one home.
