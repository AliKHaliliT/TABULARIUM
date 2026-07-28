import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDateForInput } from "@/lib/utils";
import { useScrollLock } from "@/lib/useScrollLock";
import { AnyContentItem } from "@/types/content";
import { AdminTab } from "./AdminTabs";
import { EditDraft } from "./editDraft";
import { TypeFields } from "./editForms";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AdminTab;
  /** Item to edit, or a fresh draft from newItemDraft() when creating. */
  data?: AnyContentItem | EditDraft | null;
  /** Switches the header between "New" and "Edit". */
  isNew?: boolean;
  onSave: (data: AnyContentItem) => void;
}

const MODAL_TITLES: Record<string, string> = {
  experience: "Experience",
  education:  "Education",
  awards:     "Award",
  projects:   "Project",
  books:      "Book",
  courses:    "Course",
  trips:      "City",
  countries:  "Country",
  posts:        "Garden Note",
  blog:         "Blog Post",
  updates:      "Update",
  publications:  "Publication",
  speaking:      "Speaking Engagement",
  volunteering:  "Volunteering",
  certificates:  "Certificate",
  references:    "Reference",
  interests:     "Interest",
  organizations: "Organization",
  settings:      "Settings",
};

export const EditModal = ({
  isOpen,
  onClose,
  type,
  data,
  isNew = false,
  onSave,
}: EditModalProps) => {
  const [formData, setFormData] = useState<EditDraft>({});
  const [error, setError] = useState<string | null>(null);

  // Re-seed the draft whenever the edited item, tab, or open state changes
  // (render-time adjustment: react.dev/learn/you-might-not-need-an-effect).
  const [seed, setSeed] = useState<{
    data: EditModalProps["data"];
    isOpen: boolean;
    type: AdminTab;
  } | null>(null);
  if (!seed || seed.data !== data || seed.isOpen !== isOpen || seed.type !== type) {
    setSeed({ data, isOpen, type });
    setError(null);
    if (data) {
      const draft = data as unknown as EditDraft;
      setFormData({
        ...draft,
        date: formatDateForInput(draft.date as string | undefined),
      });
    }
  }

  const set = (field: string, value: string | string[] | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Validation reports inline (no browser alert): the message sits next to
  // the Save action where the eye already is.
  const handleSave = () => {
    const needsTitle = !["trips", "countries", "updates", "references"].includes(type);
    const hasTitle =
      formData.title || formData.city || formData.name || formData.body;
    if (needsTitle && !formData.title) {
      setError("A title is required.");
      return;
    }
    if (type === "references" && !formData.name) {
      setError("A name is required.");
      return;
    }
    if (!hasTitle) {
      setError("Please fill in the required fields.");
      return;
    }
    setError(null);
    onSave(formData as unknown as AnyContentItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={`${isNew ? "New" : "Edit"} ${MODAL_TITLES[type] || "item"}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--color-card)] w-full max-w-4xl rounded-card shadow-overlay border border-[var(--color-border)] flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {isNew ? "New" : "Edit"} {MODAL_TITLES[type] || "Item"}
            </h2>
            {/* The single dismiss control (Escape and backdrop click also
                close): no duplicate Cancel in the footer. */}
            <button
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center hover:bg-[var(--color-background)] rounded-full transition-colors"
            >
              <X size={20} className="text-[var(--color-text-secondary)]" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <TypeFields type={type} draft={formData} set={set} />
          </div>

          <div className="p-6 border-t border-[var(--color-border)] flex items-center justify-end gap-4 bg-[var(--color-card)] rounded-b-card">
            {error && (
              <p
                role="alert"
                className="m-0 flex-1 font-mono text-[11px] uppercase tracking-[0.06em] text-red-500"
              >
                {error}
              </p>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium bg-[var(--color-text-primary)] text-[var(--color-background)] rounded-lg hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};
