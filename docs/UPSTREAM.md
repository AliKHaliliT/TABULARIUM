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

### 2026-09-22 The link-repair proof plants on a Status line, where every edit is legal

Kind: defect

Pin: a0db0a4

**What it is.** The docs audit's selftest proves the link-repair clause of record immutability
on the first relative link it finds, reading the project's own records in filename order. When
the first record has been superseded, that link is the one the rulebook prescribes on its Status
line, `Superseded by [NNNN](NNNN-the-new-record.md)`, and a Status line may change freely. So
the plant that points the target at a missing file and the plant that changes the link's text
both pass as legal Status edits, the selftest reports two rules not working, and the plant that
repairs the target to another resolving file passes for the wrong reason. Choosing the link from
a line that does not open with `Status: ` would land the plants in a record's body, where the
clause applies.

**How the work surfaced it.** A re-alignment carried the new selftest, and the link it would
choose here is the first record's Status line, since that record was superseded in the prescribed
form. The same plant run over a tree shaped this way reported that a ghost link target and a
changed link text raised nothing, and a ghost planted by hand showed the diff landing on the
Status line, the immutability check rightly letting that line move, and only the record-link check
naming the dead target. The template's own first record is still accepted, so its run never
meets the case. Keel's audit chooses its link the same way.

**What was worked around.** Nothing. The re-alignment is held until the template fixes the
plant, rather than landing with a patched copy of a style-owned script or with the selftest's
step made advisory.

**Records checked.** The record that added the link-repair clause lists the proof's cases and
says nothing about which line the chosen link sits on, and the rulebook's supersession form puts
a link on exactly the line immutability leaves free, so the two rulings meet in any project whose
first record was superseded.
