/** The notice that names the saved copies this browser holds that need the owner. */

import { useState } from "react";
import { m } from "framer-motion";
import { X } from "lucide-react";
import { useContent, type SavedCopyNote } from "@/entities/record";

// "the profile" for the settings key, the collection's own name otherwise.
const copyOf = (note: SavedCopyNote) => (note.type === "settings" ? "the profile" : note.type);

// One note's sentence: a refused copy gives way to the published version, a
// stale one still wins over markdown that has moved on.
const NoteLine = ({ note }: { note: SavedCopyNote }) => {
  const key = <code className="font-mono text-[12px] text-signal">{note.key}</code>;
  return note.kind === "refused" ? (
    <li className="text-sm leading-relaxed text-ink">
      Your saved copy of {copyOf(note)} didn't pass its check, so the published version is
      showing. Clear {key} from this browser's storage to remove it.
      <span className="mt-1 block break-words font-mono text-[11px] text-muted">{note.reason}</span>
    </li>
  ) : (
    <li className="text-sm leading-relaxed text-ink">
      The published {copyOf(note)} changed after your saved copy was made, and the saved copy
      still wins here. Clear {key} to load the published version instead.
    </li>
  );
};

/**
 * Tells the owner which saved copies in this browser failed their check or
 * outlived the markdown they were made from, and which key to clear. A
 * browser holding none renders nothing.
 *
 * @returns The notice, or nothing when every saved copy is current or it was dismissed.
 */
export const SavedCopyNotice = () => {
  const { savedCopies } = useContent();
  const [dismissed, setDismissed] = useState(false);
  if (savedCopies.length === 0 || dismissed) return null;

  return (
    <m.aside
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl rounded-card border border-signal bg-card p-4 shadow-lift"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-mono text-eyebrow uppercase text-signal">Saved copy needs you</p>
        <button
          onClick={() => setDismissed(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
          title="Dismiss"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
      <ul className="space-y-3">
        {savedCopies.map((note) => (
          <NoteLine key={note.key} note={note} />
        ))}
      </ul>
    </m.aside>
  );
};
