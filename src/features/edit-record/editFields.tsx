// Typed field primitives for the admin EditModal. Every content-type form is
// composed from these six shapes; the styling matches the original inline
// markup exactly.

import { ReactNode } from "react";
import { Upload } from "lucide-react";
import { TagInput, RichTextEditor } from "@/shared/ui";

const INPUT_CLS =
  "w-full px-3 py-2 bg-well border border-line rounded-lg text-sm text-ink";

const LABEL_CLS = "text-sm font-medium text-muted";

/** Two-column (single on mobile) field row. */
export const Row = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

export const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  withUploadIcon = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "month" | "email";
  placeholder?: string;
  withUploadIcon?: boolean;
}) => (
  <div className="space-y-2">
    <label className={LABEL_CLS}>{label}</label>
    {withUploadIcon ? (
      <div className="relative">
        <Upload
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${INPUT_CLS} pl-9`}
        />
      </div>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLS}
      />
    )}
  </div>
);

export const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Either bare values (value === label) or value/label pairs. */
  options: Array<string | { value: string; label: string }>;
}) => (
  <div className="space-y-2">
    <label className={LABEL_CLS}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_CLS}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o}>{o}</option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  </div>
);

/** Text input with datalist suggestions: the common values are one click
 *  away, but any owner-invented value is accepted (open type fields). */
export const SuggestField = ({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: Array<string | { value: string; label: string }>;
  placeholder?: string;
}) => {
  const listId = `suggest-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <label className={LABEL_CLS}>{label}</label>
      <input
        type="text"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLS}
      />
      <datalist id={listId}>
        {suggestions.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o} />
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </datalist>
    </div>
  );
};

export const TextAreaField = ({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <div className="space-y-2">
    <label className={LABEL_CLS}>{label}</label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT_CLS} resize-none`}
    />
  </div>
);

export const TagsField = ({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) => (
  <div className="space-y-2">
    <label className={LABEL_CLS}>Tags</label>
    <TagInput tags={tags} onChange={onChange} />
  </div>
);

export const RichBodyField = ({
  label,
  value,
  onChange,
  minHeight,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Tailwind min-h utility, e.g. "min-h-[300px]": kept per-form as before. */
  minHeight: string;
}) => (
  <div className={`space-y-2 flex flex-col ${minHeight}`}>
    <label className={LABEL_CLS}>{label}</label>
    <div className="flex-1">
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  </div>
);
