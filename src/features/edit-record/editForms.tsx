// Per-content-type field groups for the admin EditModal, composed from the
// editFields primitives. Labels, placeholders, options, and rich-editor
// heights are unchanged from the original inline markup.

import { AdminTab } from "./tabs";
import { EditDraft, SetField, str } from "./editDraft";
import {
  AWARD_TYPE_LABEL,
  EMPLOYMENT_TYPE_LABEL,
  PUB_TYPE_LABEL,
  SPEAKING_TYPE_LABEL,
} from "@/entities/record";
import {
  Field,
  RichBodyField,
  Row,
  SelectField,
  SuggestField,
  TagsField,
  TextAreaField,
} from "./editFields";

interface FormProps {
  draft: EditDraft;
  set: SetField;
}

/** Select options straight from the shared label maps in src/lib/labels.ts. */
const optionsFrom = (map: Record<string, string>) =>
  Object.entries(map).map(([value, label]) => ({ value, label }));

const ExperienceFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Job Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Company *" value={str(draft, "company")} onChange={(v) => set("company", v)} />
    </Row>
    <Row>
      <SelectField
        label="Employment Type"
        value={str(draft, "employmentType") || "full-time"}
        onChange={(v) => set("employmentType", v)}
        options={optionsFrom(EMPLOYMENT_TYPE_LABEL)}
      />
      <Field label="Location" value={str(draft, "location")} onChange={(v) => set("location", v)} placeholder="City, Province" />
    </Row>
    <Row>
      <Field label="Start Date" type="month" value={str(draft, "startDate")} onChange={(v) => set("startDate", v)} />
      <Field label="End Date (leave blank for Present)" type="month" value={str(draft, "endDate")} onChange={(v) => set("endDate", v)} />
    </Row>
    <Field label="Company Website" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Responsibilities & Achievements" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const EducationFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Degree / Certificate Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="B.Sc. Computer Science" />
      <Field label="Institution *" value={str(draft, "institution")} onChange={(v) => set("institution", v)} />
    </Row>
    <Row>
      <SuggestField
        label="Degree Type"
        value={str(draft, "degree") || "Bachelor"}
        onChange={(v) => set("degree", v)}
        suggestions={["Bachelor", "Master", "PhD", "Certificate", "Diploma", "Associate"]}
      />
      <Field label="Field of Study" value={str(draft, "field")} onChange={(v) => set("field", v)} placeholder="Computer Science" />
    </Row>
    <Row>
      <Field label="Start Date" type="month" value={str(draft, "startDate")} onChange={(v) => set("startDate", v)} />
      <Field label="End Date (blank = Present)" type="month" value={str(draft, "endDate")} onChange={(v) => set("endDate", v)} />
    </Row>
    <Row>
      <Field label="GPA (optional)" value={str(draft, "gpa")} onChange={(v) => set("gpa", v)} placeholder="3.9" />
      <Field label="Location" value={str(draft, "location")} onChange={(v) => set("location", v)} placeholder="City, Region" />
    </Row>
    <Field label="Institution Website" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Notes / Coursework" minHeight="min-h-[240px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const AwardFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Award Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Issuing Organization *" value={str(draft, "issuer")} onChange={(v) => set("issuer", v)} />
    </Row>
    <Row>
      <SuggestField
        label="Type (any domain: academic, sport, art, ...)"
        value={str(draft, "awardType") || "award"}
        onChange={(v) => set("awardType", v)}
        suggestions={optionsFrom(AWARD_TYPE_LABEL)}
      />
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
    </Row>
    <Row>
      <Field label="Amount (optional)" value={str(draft, "amount")} onChange={(v) => set("amount", v)} placeholder="$2,500" />
      <Field label="Link (optional)" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    </Row>
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Description" minHeight="min-h-[200px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const PublicationFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <SuggestField
        label="Type"
        value={str(draft, "pubType") || "journal"}
        onChange={(v) => set("pubType", v)}
        suggestions={optionsFrom(PUB_TYPE_LABEL)}
      />
    </Row>
    <Field label="Authors" value={str(draft, "authors")} onChange={(v) => set("authors", v)} placeholder="Jane Doe, John Smith, ..." />
    <Row>
      <Field label="Venue / Journal" value={str(draft, "venue")} onChange={(v) => set("venue", v)} placeholder="ICML 2024" />
      <Field label="Year" value={str(draft, "year")} onChange={(v) => set("year", v)} placeholder="2024" />
    </Row>
    <Row>
      <Field label="DOI (optional)" value={str(draft, "doi")} onChange={(v) => set("doi", v)} placeholder="10.1234/example.2024" />
      <Field label="Link (PDF / arXiv)" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    </Row>
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Abstract" minHeight="min-h-[200px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const SpeakingFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Talk Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <SuggestField
        label="Type"
        value={str(draft, "speakingType") || "talk"}
        onChange={(v) => set("speakingType", v)}
        suggestions={optionsFrom(SPEAKING_TYPE_LABEL)}
      />
    </Row>
    <Row>
      <Field label="Event / Conference" value={str(draft, "event")} onChange={(v) => set("event", v)} placeholder="MLConf 2024" />
      <Field label="Location" value={str(draft, "location")} onChange={(v) => set("location", v)} placeholder="San Francisco, CA" />
    </Row>
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <Field label="Event Link" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    </Row>
    <Row>
      <Field label="Slides URL (optional)" value={str(draft, "slides")} onChange={(v) => set("slides", v)} placeholder="https://..." />
      <Field label="Video / Recording (optional)" value={str(draft, "video")} onChange={(v) => set("video", v)} placeholder="https://..." />
    </Row>
    <Field label="Story link (a blog/garden route about this, optional; separate from the event link)" value={str(draft, "story")} onChange={(v) => set("story", v)} placeholder="/blog/what-i-learned-at-the-symposium" />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Description" minHeight="min-h-[200px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const VolunteeringFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="Open Source Contributor" />
      <Field label="Organization *" value={str(draft, "organization")} onChange={(v) => set("organization", v)} placeholder="PyTorch" />
    </Row>
    <Row>
      <Field label="Role (optional)" value={str(draft, "role")} onChange={(v) => set("role", v)} placeholder="Core Contributor" />
      <Field label="Location" value={str(draft, "location")} onChange={(v) => set("location", v)} placeholder="Remote" />
    </Row>
    <Row>
      <Field label="Start Date" type="month" value={str(draft, "startDate")} onChange={(v) => set("startDate", v)} />
      <Field label="End Date (blank = Present)" type="month" value={str(draft, "endDate")} onChange={(v) => set("endDate", v)} />
    </Row>
    <Field label="Link (optional)" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    <Field label="Story link (a blog/garden route about this, optional)" value={str(draft, "story")} onChange={(v) => set("story", v)} placeholder="/blog/..." />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Description" minHeight="min-h-[200px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const CertificateFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Certificate Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="AWS Certified Solutions Architect" />
      <Field label="Issuing Organization *" value={str(draft, "issuer")} onChange={(v) => set("issuer", v)} placeholder="Amazon Web Services" />
    </Row>
    <Row>
      <SelectField
        label="Type"
        value={str(draft, "certType") || "technical"}
        onChange={(v) => set("certType", v)}
        options={[
          { value: "technical", label: "Technical" },
          { value: "professional", label: "Professional" },
          { value: "academic", label: "Academic" },
          { value: "language", label: "Language" },
          { value: "other", label: "Other" },
        ]}
      />
      <Field label="Date Issued" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
    </Row>
    <Row>
      <Field label="Credential ID (optional)" value={str(draft, "credentialId")} onChange={(v) => set("credentialId", v)} placeholder="ABC123DEF456" />
      <Field label="Verification Link (optional)" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    </Row>
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Notes (optional)" minHeight="min-h-[180px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const ReferenceFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Full Name *" value={str(draft, "name")} onChange={(v) => set("name", v)} placeholder="Dr. Jane Smith" />
      <Field label="Title / Position" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="Professor of Computer Science" />
    </Row>
    <Row>
      <Field label="Organization" value={str(draft, "organization")} onChange={(v) => set("organization", v)} placeholder="Organization name" />
      <Field label="Relationship" value={str(draft, "relationship")} onChange={(v) => set("relationship", v)} placeholder="PhD Supervisor" />
    </Row>
    <Row>
      <Field label="Email" type="email" value={str(draft, "email")} onChange={(v) => set("email", v)} placeholder="j.smith@university.ca" />
      <Field label="Phone (optional)" value={str(draft, "phone")} onChange={(v) => set("phone", v)} placeholder="+1 (403) 000-0000" />
    </Row>
    <Field label="Profile / Website (optional)" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
    <RichBodyField label="Notes (optional)" minHeight="min-h-[160px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const InterestFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Interest / Hobby *" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="Photography" />
      <SuggestField
        label="Category (any label works)"
        value={str(draft, "category") || "hobby"}
        onChange={(v) => set("category", v)}
        suggestions={["hobby", "sport", "creative", "technical", "social", "other"]}
      />
    </Row>
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Story link (a blog/garden route with the long version, optional)" value={str(draft, "story")} onChange={(v) => set("story", v)} placeholder="/garden/games-i-have-played" />
    <RichBodyField label="Description (optional)" minHeight="min-h-[160px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const OrganizationFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Organization Name *" value={str(draft, "title")} onChange={(v) => set("title", v)} placeholder="IEEE" />
      <SelectField
        label="Membership Type"
        value={str(draft, "memberType") || "professional"}
        onChange={(v) => set("memberType", v)}
        options={[
          { value: "professional", label: "Professional" },
          { value: "academic", label: "Academic" },
          { value: "community", label: "Community" },
          { value: "other", label: "Other" },
        ]}
      />
    </Row>
    <Row>
      <Field label="Role / Membership Level" value={str(draft, "role")} onChange={(v) => set("role", v)} placeholder="Student Member" />
      <Field label="Location" value={str(draft, "location")} onChange={(v) => set("location", v)} placeholder="Global / Remote" />
    </Row>
    <Row>
      <Field label="Start Date" type="month" value={str(draft, "startDate")} onChange={(v) => set("startDate", v)} />
      <Field label="End Date (blank = Present)" type="month" value={str(draft, "endDate")} onChange={(v) => set("endDate", v)} />
    </Row>
    <Field label="Website (optional)" value={str(draft, "website")} onChange={(v) => set("website", v)} placeholder="https://..." />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <RichBodyField label="Description (optional)" minHeight="min-h-[180px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const ProjectFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Role / Your contribution" value={str(draft, "role")} onChange={(v) => set("role", v)} />
    </Row>
    <TextAreaField label="Summary" value={str(draft, "desc") || str(draft, "description")} onChange={(v) => set("desc", v)} />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Image URL" value={str(draft, "image")} onChange={(v) => set("image", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <Field label="Project Link" value={str(draft, "link")} onChange={(v) => set("link", v)} />
    </Row>
    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-muted">
      <input
        type="checkbox"
        checked={draft.featured === true}
        onChange={(e) => set("featured", e.target.checked)}
        className="h-4 w-4 accent-field"
      />
      Featured: headline the home page's Selected work chapter
    </label>
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const BookFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Author" value={str(draft, "author")} onChange={(v) => set("author", v)} />
    </Row>
    <TextAreaField label="Summary" value={str(draft, "desc") || str(draft, "description")} onChange={(v) => set("desc", v)} />
    <Field label="Cover Image URL" value={str(draft, "cover")} onChange={(v) => set("cover", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <SelectField
        label="Status"
        value={str(draft, "status") || "To Read"}
        onChange={(v) => set("status", v)}
        options={["Reading", "Read", "To Read"]}
      />
      <Field label="Rating (1–5)" value={str(draft, "rating")} onChange={(v) => set("rating", v)} />
    </Row>
    <Field label="Story link (a blog/garden route with the long version, optional)" value={str(draft, "story")} onChange={(v) => set("story", v)} placeholder="/blog/on-the-gambler" />
    <RichBodyField
      label="Notes"
      minHeight="min-h-[300px]"
      value={str(draft, "notes") || str(draft, "body")}
      onChange={(v) => set("notes", v)}
    />
  </>
);

const CourseFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Provider" value={str(draft, "provider")} onChange={(v) => set("provider", v)} />
    </Row>
    <TextAreaField label="Summary" value={str(draft, "desc") || str(draft, "description")} onChange={(v) => set("desc", v)} />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <Field label="Course Link" value={str(draft, "link")} onChange={(v) => set("link", v)} />
    </Row>
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const TripFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="City *" value={str(draft, "city")} onChange={(v) => set("city", v)} />
      <Field label="Country" value={str(draft, "country")} onChange={(v) => set("country", v)} />
    </Row>
    <TextAreaField
      label="Short Description"
      value={str(draft, "desc") || str(draft, "description")}
      onChange={(v) => set("description", v)}
    />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Image URL" value={str(draft, "image")} onChange={(v) => set("image", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <Field label="Coordinates" value={str(draft, "coordinates")} onChange={(v) => set("coordinates", v)} />
    </Row>
    <Field label="Story link (a blog/garden route with the long version, optional)" value={str(draft, "story")} onChange={(v) => set("story", v)} placeholder="/blog/a-week-in-istanbul" />
    <RichBodyField
      label="Highlights"
      minHeight="min-h-[300px]"
      value={str(draft, "highlights") || str(draft, "body")}
      onChange={(v) => set("highlights", v)}
    />
  </>
);

const CountryFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Country Name *" value={str(draft, "name")} onChange={(v) => set("name", v)} />
      <Field label="Country Code (e.g. JP)" value={str(draft, "code")} onChange={(v) => set("code", v)} />
    </Row>
    <TextAreaField
      label="Short Description"
      value={str(draft, "desc") || str(draft, "description")}
      onChange={(v) => set("description", v)}
    />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Image URL" value={str(draft, "image")} onChange={(v) => set("image", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <Field label="Years Visited" value={str(draft, "years")} onChange={(v) => set("years", v)} placeholder="e.g. 2022, 2024" />
      <Field label="Flag Emoji" value={str(draft, "flag")} onChange={(v) => set("flag", v)} />
    </Row>
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const PostFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Slug" value={str(draft, "slug")} onChange={(v) => set("slug", v)} />
    </Row>
    <TextAreaField label="Excerpt / Summary" value={str(draft, "desc") || str(draft, "description")} onChange={(v) => set("desc", v)} />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Image URL" value={str(draft, "image")} onChange={(v) => set("image", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <SuggestField
        label="Note kind"
        value={str(draft, "postType") || "Seedling"}
        onChange={(v) => set("postType", v)}
        suggestions={["Seedling", "Evergreen", "List"]}
      />
    </Row>
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const BlogFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <Field label="Series (optional)" value={str(draft, "series")} onChange={(v) => set("series", v)} />
    </Row>
    <TextAreaField label="Excerpt / Summary" value={str(draft, "excerpt")} onChange={(v) => set("excerpt", v)} />
    <Field
      label="External URL (if the piece lives elsewhere: Medium, dev.to, ...)"
      value={str(draft, "externalUrl")}
      onChange={(v) => set("externalUrl", v)}
      placeholder="https://medium.com/@you/story"
    />
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Cover Image URL" value={str(draft, "cover")} onChange={(v) => set("cover", v)} placeholder="https://..." withUploadIcon />
    <Row>
      <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
      <Field label="Reading Time (minutes)" value={str(draft, "readingTime")} onChange={(v) => set("readingTime", v)} />
    </Row>
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

const UpdateFields = ({ draft, set }: FormProps) => (
  <>
    <Row>
      <Field label="Title *" value={str(draft, "title")} onChange={(v) => set("title", v)} />
      <SelectField
        label="Type"
        value={str(draft, "updateType") || "note"}
        onChange={(v) => set("updateType", v)}
        options={[
          { value: "note", label: "Note" },
          { value: "link", label: "Link" },
          { value: "milestone", label: "Milestone" },
        ]}
      />
    </Row>
    {draft.updateType === "link" && (
      <Row>
        <Field label="Link URL" value={str(draft, "link")} onChange={(v) => set("link", v)} placeholder="https://..." />
        <Field label="Link Title" value={str(draft, "linkTitle")} onChange={(v) => set("linkTitle", v)} />
      </Row>
    )}
    <TagsField tags={draft.tags || []} onChange={(t) => set("tags", t)} />
    <Field label="Date" type="date" value={str(draft, "date")} onChange={(v) => set("date", v)} />
    <RichBodyField label="Content" minHeight="min-h-[300px]" value={str(draft, "body")} onChange={(v) => set("body", v)} />
  </>
);

/** Dispatch to the right field group for a tab. */
export const TypeFields = ({
  type,
  draft,
  set,
}: FormProps & { type: AdminTab }) => {
  switch (type) {
    case "experience":
      return <ExperienceFields draft={draft} set={set} />;
    case "education":
      return <EducationFields draft={draft} set={set} />;
    case "awards":
      return <AwardFields draft={draft} set={set} />;
    case "publications":
      return <PublicationFields draft={draft} set={set} />;
    case "speaking":
      return <SpeakingFields draft={draft} set={set} />;
    case "volunteering":
      return <VolunteeringFields draft={draft} set={set} />;
    case "certificates":
      return <CertificateFields draft={draft} set={set} />;
    case "references":
      return <ReferenceFields draft={draft} set={set} />;
    case "interests":
      return <InterestFields draft={draft} set={set} />;
    case "organizations":
      return <OrganizationFields draft={draft} set={set} />;
    case "projects":
      return <ProjectFields draft={draft} set={set} />;
    case "books":
      return <BookFields draft={draft} set={set} />;
    case "courses":
      return <CourseFields draft={draft} set={set} />;
    case "trips":
      return <TripFields draft={draft} set={set} />;
    case "countries":
      return <CountryFields draft={draft} set={set} />;
    case "posts":
      return <PostFields draft={draft} set={set} />;
    case "blog":
      return <BlogFields draft={draft} set={set} />;
    case "updates":
      return <UpdateFields draft={draft} set={set} />;
    default:
      // Non-content tabs (settings/documents/appearance) never open EditModal.
      return null;
  }
};
