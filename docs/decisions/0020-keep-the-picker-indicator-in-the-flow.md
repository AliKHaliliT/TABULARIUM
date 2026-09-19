# 0020. Keep the date picker indicator in the flow rather than over the control

Status: Superseded by [0021](0021-own-the-month-control.md)
Date: 2026-09-19

## Context

The edit forms carry both kinds of date-like control. Three fields are `<input type="date">`, on the publication, award, and certification forms, and four are `<input type="month">`, the start and end dates on volunteering and on memberships. Each of them is a row of editable segments plus a button that opens the native picker, and every segment has to be reachable by click.

The stylesheet carried a block whose second rule was not scoped to any input type.

```css
::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
```

The rule that put the indicator back in the flow, `position: static`, was scoped to `input[type="date"]`. The date fields were therefore correct by accident of that scope, and the four month fields were left with an invisible picker button filling the whole control, so a click anywhere in the field opened the picker instead of reaching the year.

## Evidence

A grep of `src/` found four `type="month"` fields in `src/features/edit-record/editForms.tsx` and no month selector in the stylesheet, so the reset never applied to them.

A month field and a date field rendered side by side on the built panel both show the calendar glyph at its own size at the right edge, with the segments beside it. Under the old rule the month field showed no glyph, because its indicator was transparent and stretched across the control.

Headless Chromium does not drive the native picker, so the click behavior was not reproduced in an automated run. The diagnosis rests on the rule, the grep, and the rendered fields.

## Options considered

- **Add `position: static` to the unscoped rule.** It would have fixed the geometry and left a blanket pseudo-element rule reaching every input type a later form might use. Rejected for reach.
- **Give the month fields a hand built picker.** It would replace a platform control, with its keyboard handling and locale ordering, over a styling mistake. Rejected.
- **Leave the month fields unstyled.** They would have worked and would not have matched the date fields beside them in the same row. Rejected.

## Decision

The block names both `input[type="date"]` and `input[type="month"]`, and the indicator is styled as an ordinary in-flow element with its own 18 px box. No rule on `::-webkit-calendar-picker-indicator` is written unscoped, and none of them positions the indicator over the control.

## Consequences

Every segment of both control kinds is clickable and the two look alike in a shared row. A further input type with a picker, a week or a time field, needs its own selector added here rather than inheriting a rule written for another type. The resume builder carried the same defect on its month fields and was corrected in the same change.
