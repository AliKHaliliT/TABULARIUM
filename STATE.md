# State

Current project status. Read this before starting work. Format and rules: see
[docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## Now

- The source tree moved to one-way sliced layers after the client template in the style
  family, and both record doors are now checked at the boundary (2026-08-04). The
  reasoning is in decisions 0004 through 0006; the layer rule is enforced by review only.
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
  fine-grained token (owner's hands: the token never leaves the browser) (2026-07-28).

## Deferred

- Adopt a boundary linter (eslint-plugin-boundaries or similar) so the layer rule is
  checked rather than reviewed; deferred until the rule has proven itself in practice
  (2026-08-04).
- Consider inverting the content bundle's dependencies so it takes the site identity and
  palette as arguments; that would let the repo sync and the zip export be two features
  instead of one `publish` slice (2026-08-04).
- Normalize the verbose token spelling, where a class string says `bg-[var(--color-card)]`
  and the token utility `bg-card` compiles to the same rule. Both honor the token rule, so
  this is consistency work rather than a fix (2026-08-04).
- Bring every export up to the doc-comment convention. The files touched by the layer move
  carry it; the rest still carry their original informal comments (2026-08-04).
- A diff preview inside the conflict dialog (today it names the file and the divergence
  kind; showing both versions side by side is the natural next step) (2026-07-28).
- A house favicon of its own; the app currently reuses the shared pixel-mark (2026-07-28).

## Blocked

- Nothing blocked.
