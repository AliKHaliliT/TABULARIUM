import { useState } from "react";
import { useContent, UserSettings } from "@/entities/record";

/**
 * Shared form state for the tabs that edit the profile settings (Profile,
 * Skills): each tab holds its own draft of the whole settings object and
 * saves it wholesale, so a save from either tab never loses the other's
 * persisted fields.
 */
export function useSettingsForm() {
  const { settings, updateSettings } = useContent();
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  // Re-seed the form when settings are replaced (render-time adjustment -
  // https://react.dev/learn/you-might-not-need-an-effect).
  const [seededFrom, setSeededFrom] = useState(settings);
  if (settings && settings !== seededFrom) {
    setSeededFrom(settings);
    setFormData(settings);
  }

  const handleChange = (field: keyof UserSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return { formData, handleChange, handleSave, saved };
}
