# 0025. Let a role name more than one employment kind

Status: Accepted
Date: 2026-09-25

## Context

An experience entry named its employment kind in one field that held one word, and the
panel set it with a single dropdown. The five words describe two things, the hours a role
takes and the terms it is held on, so a part-time contract could not be written without
losing half of it. The site this panel edits now lets the field hold one kind or a list,
and refuses an unknown kind or an empty list at its door. The panel shares that door and
writes the field, so it has to write what the door accepts.

## Evidence

A production build served locally opened a demo role marked full-time with that kind on,
took two more clicks for part-time and contract, and saved the list in the order the kinds
are offered. A reload showed no refused-copy notice. Unticking every kind and saving left
the entry with no employmentType at all. The door carries the site's suites unchanged, and
the draft suite written here was mutated six ways before it landed, a test failing for
each.

## Options considered

- **Keep the dropdown and let a list pass through untouched.** Opening such an entry would
  show one kind and saving would overwrite the rest. Refused.
- **Save an empty choice as an empty list.** The door refuses it, so the panel would write
  a copy its own door sets aside. Refused in favour of dropping the field.

## Decision

The door, the model, and the kind reader carry the site's change. The editor offers the
kinds as toggles, any number on, and returns the chosen ones in the order offered. Saving
stores no kind as no field, one as a single word, and several as a list, so every older
entry keeps its shape.

## Consequences

A role says what it is from the panel as well as by hand. A new role still starts as
full-time, as it did with the dropdown.
