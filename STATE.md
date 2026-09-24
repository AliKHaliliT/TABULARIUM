# State

Current project status. Read this before starting work. Format and rules: see
[docs/CONVENTIONS.md](docs/CONVENTIONS.md).

## Now

- Nothing in flight.

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
