// Draft model for the admin EditModal.

import { AdminTab } from "./tabs";

/** Item being edited: the union of every editable field across all content
 *  types, loosely typed on purpose: the modal edits raw item records. */
export interface EditDraft {
  id?: string | number;
  tags?: string[];
  [field: string]: unknown;
}

/** Read a draft field as a display string. */
export const str = (draft: EditDraft, field: string): string =>
  (draft[field] as string | undefined) || "";

/** How a form reports one field change back to the draft it is editing. */
export type SetField = (field: string, value: string | string[] | boolean) => void;

const DEFAULT_BY_TYPE: Record<string, EditDraft> = {
  experience: { tags: [], body: "", title: "", company: "", employmentType: "full-time" },
  education:  { tags: [], body: "", title: "", institution: "", degree: "Bachelor" },
  awards:     { tags: [], body: "", title: "", issuer: "", awardType: "award" },
  projects:   { tags: [], body: "", title: "", status: undefined },
  books:      { tags: [], body: "", title: "", status: "To Read" },
  media:      { tags: [], body: "", title: "", medium: "film", status: "To Watch" },
  courses:    { tags: [], body: "", title: "" },
  trips:      { tags: [], body: "", city: "" },
  countries:  { tags: [], body: "", name: "", visited: true },
  posts:        { tags: [], body: "", title: "", postType: "Seedling" },
  blog:         { tags: [], body: "", title: "", cover: "" },
  updates:      { tags: [], body: "", updateType: "note" },
  publications:  { tags: [], body: "", title: "", pubType: "journal" },
  speaking:      { tags: [], body: "", title: "", speakingType: "talk" },
  volunteering:  { tags: [], body: "", title: "", organization: "" },
  certificates:  { tags: [], body: "", title: "", issuer: "", certType: "technical" },
  references:    { tags: [], body: "", name: "", title: "" },
  interests:     { tags: [], body: "", title: "", category: "hobby" },
  organizations: { tags: [], body: "", title: "", memberType: "professional" },
  settings:      {},
};

/** Fresh draft for a "New item" flow. Impure (id/date stamps): call from an
 *  event handler, not during render. */
export const newItemDraft = (type: AdminTab): EditDraft => ({
  id: Date.now(),
  ...DEFAULT_BY_TYPE[type],
  date: new Date().toISOString().split("T")[0],
});
