# 0021. Pick a month from two lists the panel owns, not from the platform control

Status: Accepted
Date: 2026-09-19

## Context

Record [0020](0020-keep-the-picker-indicator-in-the-flow.md) held that a stylesheet rule stretching the native picker button across the control was what kept a person from choosing a year on the panel's month fields. Measurement in the sister project falsified that, and the same measurement applies here, because both carried the same rule and the same control.

The eight month fields across the experience, education, volunteering, and membership forms were `<input type="month">`. What that offers in Chromium is a popup listing every year as a scrolling run of month grids, drawn outside the page, where nothing the panel writes can reach it.

## Evidence

Clicking across the control at six pixel steps and pressing ArrowUp says which segment a click reached. The walk ran with the old overlay rule reinstated and again without it, with M for the month segment, Y for the year, and a dot for neither.

```text
x from 4 to 256 step 6
old: ....MMMMMMYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
new: YYMMMMMMMMYYYYYYYYYYYYYYYYYYYYYYYYYYY....MM
```

The year answered clicks across most of the control even with the overlay in place, so the overlay was never what blocked it. It did hide the calendar glyph and swallow clicks at the left edge, which is why removing it was still right.

After the change, driving the built panel against the demo record confirms both directions. An entry already holding `2024-03` opens with the two lists reading March and 2024, and picking November 1991 and saving writes it back.

```text
Start Date, month="03" (13 opts)
Start Date, year="2024" (67 opts)
saved
os_content_experience contains 1991-11
```

## Options considered

- **Style the popup.** It is browser chrome drawn outside the page and takes nothing from it. Rejected as impossible rather than unwise.
- **Keep the native control.** It leaves a person dragging a scrolling list through every year to reach a date decades back, which is most of what this record holds. Rejected.
- **A calendar popover of the panel's own.** More positioning, focus, and dismissal surface than a month needs. Rejected.
- **A free text year box.** It accepts anything and moves the checking into the field. Rejected in favor of a closed list.

## Decision

A month is picked from two selects the panel owns, wrapped as `MonthField` in `shared/ui` over the value helpers in `shared/lib`, and the `Field` primitive renders it wherever a form asks for `type="month"`. Every call site keeps the shape it had, and the stored value keeps the `YYYY-MM` string the content contract already reads.

Date fields keep the platform control, whose popup is an ordinary calendar with its own year header and does not have this problem. The stylesheet therefore names only `input[type="date"]`, and it declares `color-scheme` per theme at the root, because the platform draws select popups, date pickers, scrollbars, and focus rings itself and takes their colors from that rather than from the tokens.

## Consequences

Any year in range is one list away, in every browser alike. The panel owns one more piece of chrome, and the month names are its own strings. A form that later wants a week or a time field will find no rule waiting for it in the stylesheet, which is the intended shape. The resume builder carried the same control and the same mistaken record, and both were corrected in the same change.
