/**
 * Which section of the record an editing session is pointed at.
 *
 * The edit machinery switches on this to choose a form, and the page's tab
 * strip renders it. It lives here rather than beside the strip so the feature
 * does not depend on the page that displays it.
 */

/** A tab is either one of the settings panels or one content collection. */
export type AdminTab =
  | "settings"
  | "profile"
  | "skills"
  | "appearance"
  | "experience"
  | "education"
  | "awards"
  | "certificates"
  | "publications"
  | "speaking"
  | "volunteering"
  | "organizations"
  | "references"
  | "interests"
  | "projects"
  | "books"
  | "courses"
  | "countries"
  | "trips"
  | "posts"
  | "blog"
  | "updates";
