# Upstream

Aligned to Helm at `e069bab`.

Every entry below is a lead and not a verdict, to be verified against the template's own tree
before it is adopted.

## Open

### 2026-09-09 A protocol-fixed hash has to waive the weak-hash rule

Kind: defect

Pin: e069bab

**What it is.** The security block sets `sonarjs/hashing` to error for the whole source tree.
A client that speaks git's own object protocol has to compute blob ids, and git fixes that
algorithm at SHA-1, so the call trips the rule on a hash the code did not choose and cannot
change. The rule's question, whether a weak algorithm is being trusted with security, has one
answer for a password and another for an identifier a protocol dictates, and the configuration
cannot tell them apart.

**How the work surfaced it.** Adopting the security block reported the rule against the one
call that computes blob ids to compare local text with a remote tree. Nothing about the
comparison is a security decision; a stronger hash would compare against nothing.

**What was worked around.** `sonarjs/hashing` is disabled for that single file, with the
protocol named in a comment beside the waiver, rather than the hash changed.

**Records checked.** The record that adopted the mechanical security rules calls the
exclusions narrow and reason-bearing, which is what this is, and no record rules on a hash a
wire protocol fixes.
