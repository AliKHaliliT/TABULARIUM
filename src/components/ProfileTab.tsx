import { Save, CheckCircle2 } from "lucide-react";
import { UserSettings } from "@/types/content";
import { LinksEditor } from "./LinksEditor";
import { useSettingsForm } from "./useSettingsForm";

/** Who you are: identity, contact, links, and languages. Skills live in
 *  their own tab; site-level identity lives under Settings. */
export const ProfileTab = () => {
  const { formData, handleChange, handleSave, saved } = useSettingsForm();

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Name
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Role / Headline
          </label>
          <input
            type="text"
            value={formData.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Location
          </label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Current Focus (legacy: not displayed; post an Update instead)
          </label>
          <input
            type="text"
            value={formData.focus || ""}
            onChange={(e) => handleChange("focus", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Bio
          </label>
          <textarea
            rows={3}
            value={formData.body || formData.bio || ""}
            onChange={(e) => handleChange("body", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Nationality
          </label>
          <input
            type="text"
            value={formData.nationality || ""}
            onChange={(e) => handleChange("nationality", e.target.value)}
            placeholder="Canadian"
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
          <p className="m-0 text-xs text-[var(--color-text-secondary)]">
            Not shown on any page, but like every profile field it ships inside the
            public site data. Leave empty on a public deployment; type it into a resume
            document directly if one needs it.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Availability
          </label>
          <input
            type="text"
            value={formData.availability || ""}
            onChange={(e) => handleChange("availability", e.target.value)}
            placeholder="Open to opportunities from September 2025"
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Work Mode
          </label>
          <input
            type="text"
            value={formData.workMode || ""}
            onChange={(e) => handleChange("workMode", e.target.value)}
            placeholder="Remote · Hybrid · On-site"
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          Profile Photo URL
        </label>
        <div className="flex gap-4 items-center">
          {formData.avatar && (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-background)] flex-shrink-0 border-2 border-[var(--color-border)]">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <input
            type="text"
            value={formData.avatar || ""}
            onChange={(e) => handleChange("avatar", e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <h3 className="font-semibold text-[var(--color-text-primary)]">
          Contact &amp; Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              { key: "email",   label: "Email" },
              { key: "phone",   label: "Phone" },
              { key: "website", label: "Website / Portfolio" },
              { key: "github",  label: "GitHub" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "twitter", label: "Twitter / X" },
              { key: "scholar", label: "Google Scholar" },
              { key: "medium",  label: "Medium" },
              { key: "orcid",   label: "ORCID" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
              </label>
              <input
                type="text"
                value={(formData[key as keyof typeof formData] as string) || ""}
                onChange={(e) => handleChange(key as keyof UserSettings, e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)]"
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            More links
          </label>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Any other platform: Kaggle, Hugging Face, ResearchGate, Instagram, YouTube,
            anything. Pick an icon from the site's set or leave it as a text chip. They
            join the social links on the home page and in the footer. This site is public,
            so add only what you want the world to see.
          </p>
          <LinksEditor
            value={formData.links || ""}
            onChange={(v) => handleChange("links", v)}
          />
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Languages</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            One language per line: <code className="font-mono">English: Native</code>
          </p>
        </div>
        <textarea
          rows={4}
          value={formData.languages || ""}
          onChange={(e) => handleChange("languages", e.target.value)}
          placeholder={"English: Native\nFarsi: Native\nFrench: Conversational"}
          className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] font-mono resize-none"
        />
      </div>

      {/* Declaration */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Declaration</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            End-of-resume statement, e.g. "I hereby declare that all information given above is true and correct to the best of my knowledge."
          </p>
        </div>
        <textarea
          rows={3}
          value={formData.declaration || ""}
          onChange={(e) => handleChange("declaration", e.target.value)}
          placeholder="I hereby declare that..."
          className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] resize-none"
        />
      </div>

      {/* Now */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Now (legacy)</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            No longer displayed: the Home page's Now chapter reads from your Updates feed.
            Post an update instead.
          </p>
        </div>
        <textarea
          rows={4}
          value={formData.now || ""}
          onChange={(e) => handleChange("now", e.target.value)}
          placeholder="Currently building..."
          className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] resize-none"
        />
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-text-primary)] text-[var(--color-background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          Save Profile
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
