# State

Current project status. Read this before starting work. Format and rules: see
[docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## Now

- Aligned with the style's 2026-08-10 rulings: the rulebook refreshed and its hash now
  pinned in CI, the docs audit and its Docs step adopted, the version pinned at 0.0.1,
  the quotes rule checked by ESLint, doc-comment presence checked by the jsdoc plugin,
  every workflow on latest stable action majors, and the vendor libraries split into
  their own cached chunk (2026-08-10). The reasoning lives in the style's decision
  records, 0013 through 0016 in Helm.
- The conflict dialog now shows both versions side by side: a View toggle per file lazily
  reads the branch copy and lays it beside the local one, so choosing no longer means
  opening GitHub (2026-08-10).
- CI greps every tracked byte for an em dash before anything installs, so the prose ban
  is checked rather than remembered (2026-08-08).
- The style's test contract is adopted, and the suites already satisfied it. Suites mirror
  `src/`, collaborators are substituted only at a seam, no coverage threshold is imposed, and a
  check found no module mocking anywhere here (2026-08-05). The fifth command is now a named
  `typecheck` script rather than a bare `tsc -b`, so CI and the guide run the same thing.
  Decision 0010 carries the reasoning, and two details of this project's CI travelled
  upstream into the style in exchange.
- The documentation system is the client style's own: the rulebook is a byte-identical
  copy of the Helm template's, the changelog is gone with its trigger unmet, the index
  took the style's shape, and improvements now travel upstream through the report path
  in AGENTS.md (2026-08-04). Decision 0009 carries the reasoning.
- Every export carries the TSDoc convention now, at 164 of 164, with the weight per export
  following what the convention prescribes rather than applied uniformly (2026-08-04).
- The source tree moved to one-way sliced layers after the client template in the style
  family, and both record doors are now checked at the boundary (2026-08-04). The
  reasoning is in decisions 0004 through 0006.
- The layer rule is now checked by ESLint rather than by review, and the design tokens moved
  to the template's two-layer shape with semantic names behind a `data-theme` attribute
  (2026-08-04). Decisions 0007 and 0008 carry the reasoning.
- The repository is public: badges, the License section, and the sister READMEs' source
  links all resolve for visitors now (2026-08-01).
- The docs baseline synced with the 2026-08-01 My-Styles changes, adopting the sharpened
  human-prose rule and the public-audience rule with the untracked LOCAL.md ledger
  (2026-08-01).
- The panel became the ecosystem's writer in earnest: a GitHub repository connection with
  per-file three-way sync and conflict resolution, the zip bundle for the no-repo
  workflow, the palette riding in the portfolio export, and the house theme switch all
  landed (2026-07-28). The publish dress followed: LICENSE, badges, the README plaque,
  and the Pages demo workflow are all in place (2026-08-01).

## Next

- Exercise the repository connection end to end against the real deployment repo with a
  fine-grained token; still pending, and only the owner's hands can run it because the
  token never leaves the browser (2026-08-10).

## Deferred

- Consider inverting the content bundle's dependencies so it takes the site identity and
  palette as arguments; that would let the repo sync and the zip export be two features
  instead of one `publish` slice (2026-08-10).
- A diff preview inside the conflict dialog (today it names the file and the divergence
  kind; showing both versions side by side is the natural next step) (2026-07-28).

## Blocked

- Nothing blocked.
