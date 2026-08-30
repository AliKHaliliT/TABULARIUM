# 0012. Align with the prose law and the mechanical security rules

Status: Accepted
Date: 2026-08-30

## Context

The style moved past the baseline this project froze at its last alignment, and the
family refuses ratcheting, so the wave lands complete or not at all. Since then the
template named its prose law inside the rulebook, replaced the em-dash ban with a
budget of two per tracked file, split checks into verdicts and advice, adopted the
mechanical security rules with three advisory heuristics, added Adversary honesty as
the delivery gate's nineteenth item, bound every rule to the jurisdiction its text
claims, and required the Node version story to be one number. The reasoning lives in
the style's records 0024 through 0034, once, and is not repeated here.

## Evidence

The frozen rulebook and the pinned audit script were re-copied from the style and
their CI pins updated; `sha256sum` over both copies reproduces the pinned values. The
new lint rules ran against the whole tree and found one thing real, the GitHub
client's SHA-1 blob-id computation, quoted in Options below. After the waiver, lint,
the docs audit, typecheck, the suites (88 passing), and the build all passed against
the final tree.

## Options considered

- Replace the GitHub client's SHA-1 with a stronger hash to satisfy
  `sonarjs/hashing`, which fired on `src/shared/api/github.ts` with "Make sure this
  weak hash algorithm is not used in a sensitive context here". Lost because the hash
  computes git blob ids for change detection and git's object format fixes the
  algorithm; a stronger hash would compare against nothing. Bending the work to earn
  a green run is exactly what the new hard rule forbids, so the rule is waived for
  that one file with the reason written beside the waiver.
- Keep the total em-dash ban as a stricter local rule. Lost because a derived project
  never diverges from the rulebook in either direction; the budget is the law now.
- Leave the Node story as it was, with CI on 24 and deploy on 22. Lost because the
  audit now holds floor claims against `engines`, and two numbers for one floor is
  drift already visible.

## Decision

Re-copy `docs/CONVENTIONS.md` and `scripts/audit-docs.mjs` from the style and re-pin
both in CI. Replace CI's em-dash ban with the two-per-file budget and add the
advisory vocabulary grep. Carry the style's new hard rules and the two-level check
contract in AGENTS.md verbatim, add Adversary honesty to the gate, and extend The
commands to cover advisory findings. Adopt the mechanical security lint block with
its three warnings, waiving `sonarjs/hashing` only for the GitHub client's
protocol-dictated SHA-1. Declare `engines.node >= 24` and build on 24 in both
workflows. Append the file-shape paragraph to the README's Conventions and carry the
template's clause-level prose corrections into the baseline document.

## Consequences

CI now counts em dashes instead of banning them, so review inherits the judgment of
fit the ban used to make trivial. Warnings are part of delivery, read and answered in
the change that produced them, never suppressed. A trust-boundary change owes one
written sentence about its adversary. The pins mean the next style move fails CI here
until the next complete wave, which is the alignment working as intended.
