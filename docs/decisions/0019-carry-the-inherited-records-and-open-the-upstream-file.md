# 0019. Carry the inherited records and open the upstream file

Status: Accepted
Date: 2026-09-09

## Context

The style moved eight commits past the pin this project carried, and the family
refuses ratcheting, so the wave lands complete or not at all. Three of those
commits reshape what a derived project holds. The style's own decision records
now travel as one `inherited/` folder under `docs/`, byte-identical at the pin,
leaving `docs/decisions/` for this project's own choices alone. The upstream
report becomes `UPSTREAM.md`, a living document with a fixed schema that carries
defects as well as improvements and resolves its own entries at each
re-alignment rather than waiting for a reply. The alignment pin moves out of the
README attribution onto that file's first line. The reasoning lives in the
style's records 0041 through 0050, once, and is not repeated here.

## Evidence

The re-copied audit reported one finding, the new upstream file unregistered in
the index, and passed once its row was added. The docs audit, lint, type-check,
the ninety suites, and the build all passed against the final tree. The advisory
spell check the style added runs `codespell` through `pipx`, which this machine
cannot run because its only Python is the Windows Store stub, so its first
findings are read from the CI log rather than locally.

## Options considered

- Open the upstream file with `Nothing open.` Lost because this tree waives a
  style-owned lint rule for the GitHub client's blob-id hash, and the new rule
  says a workaround of template-prescribed behavior earns an entry whatever its
  size and whether or not the child is sure it is a defect.
- Report the waiver as an improvement rather than a defect. Lost because an
  improvement is judged and a defect is not; the child is not the one to decide
  whether the rule should learn about protocol-fixed hashes.

## Decision

Re-copy `docs/CONVENTIONS.md` and `scripts/audit-docs.mjs` from the style and
re-pin both in CI, and add the advisory spell check beside the prose grep. Carry
the style's fifty decision records into `docs/inherited/`, registered by one index
row and never edited here. Open `docs/UPSTREAM.md` with the alignment pin on its
first line and one entry, the weak-hash rule waived for git's own blob ids.
Rewrite the guide's upstream section to the new law, add Upstream honesty to the
delivery gate, carry the baseline's six README schema changes, and replace the
README's pin with the template attribution the schema now fixes.

## Consequences

The waiver in the lint configuration is now also a claim this project has made
to its style, where a maintainer can rule on it, rather than a comment only a
reader of this repository would ever see. The pin has one home, and the next
re-alignment starts by reading it and ends by moving it.
