import { Save, CheckCircle2 } from "lucide-react";
import { useSettingsForm } from "./useSettingsForm";

/** The toolkit's editing home: the skill matrix source and the optional
 *  setup notes, both rendered on /skills and the home Toolkit chapter. */
export const SkillsTab = () => {
  const { formData, handleChange, handleSave, saved } = useSettingsForm();

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Skills</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            One category per line: <code className="font-mono">Category: item1, item2, item3</code>.
            Shown as the skill matrix on the Home page and at <code className="font-mono">/skills</code>.
          </p>
        </div>
        <textarea
          rows={12}
          value={formData.skills || ""}
          onChange={(e) => handleChange("skills", e.target.value)}
          placeholder={"Core AI: Machine Learning, Deep Learning\nComputer Vision: Object Detection, Segmentation"}
          className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] font-mono resize-none"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">The setup (optional)</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Markdown: hardware, software, workflows, anything about how you work. Shown at
            the end of the <code className="font-mono">/skills</code> page when filled; invisible when empty.
          </p>
        </div>
        <textarea
          rows={10}
          value={formData.uses || ""}
          onChange={(e) => handleChange("uses", e.target.value)}
          placeholder={"## Hardware\n\n- **MacBook Pro**: ...\n\n## Software\n\n- **VS Code**: ..."}
          className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] font-mono resize-none"
        />
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-text-primary)] text-[var(--color-background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          Save Skills
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-signal">
            <CheckCircle2 size={16} />
            Saved!
          </span>
        )}
      </div>
    </div>
  );
};
