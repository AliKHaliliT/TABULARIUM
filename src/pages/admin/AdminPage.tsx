import { useState } from "react";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import { AdminTabs } from "./AdminTabs";
import type { AdminTab } from "@/features/edit-record";
import { SettingsTab } from "./SettingsTab";
import { ProfileTab, SkillsTab } from "@/features/edit-settings";
import { AppearanceTab } from "@/features/appearance";
import { EditModal, EditDraft, newItemDraft } from "@/features/edit-record";
import { ConfirmDialog } from "@/shared/ui";
import { ContentService, useContent, AnyContentItem, ContentType } from "@/entities/record";

// AdminTab maps 1:1 to ContentType except "settings" and "appearance",
// which are handled separately (settings = single object; appearance =
// palette editor). The resume builder is the sister app EPITOMA.
const TAB_TO_CONTENT_TYPE: Record<
  Exclude<AdminTab, "settings" | "profile" | "skills" | "appearance">,
  ContentType
> =
  {
    experience:   "experience",
    education:    "education",
    awards:       "awards",
    publications: "publications",
    speaking:     "speaking",
    volunteering: "volunteering",
    certificates:  "certificates",
    references:    "references",
    interests:     "interests",
    organizations: "organizations",
    projects:      "projects",
    books:        "books",
    courses:      "courses",
    trips:        "trips",
    countries:    "countries",
    posts:        "posts",
    blog:         "blog",
    updates:      "updates",
  };

/** TABULARIUM's pixel mark: VITA's 3×2 mosaic read as a records hall, with a
 *  lintel laid across the top so the six cells become columns (matches
 *  favicon.svg). */
const BrandMark = () => (
  <svg viewBox="0 0 32 32" className="h-9 w-9 text-ink" aria-hidden="true">
    <rect x="2.5" y="3" width="27" height="3.75" fill="currentColor" />
    <rect x="2.5" y="9.5" width="7.5" height="7.5" fill="currentColor" />
    <rect x="12.25" y="9.5" width="7.5" height="7.5" fill="#ff6b2e" />
    <rect x="22" y="9.5" width="7.5" height="7.5" fill="currentColor" />
    <rect x="2.5" y="19" width="7.5" height="7.5" fill="currentColor" />
    <rect x="12.25" y="19" width="7.5" height="7.5" fill="currentColor" />
    <rect x="22" y="19" width="7.5" height="7.5" fill="#7fb5c9" />
  </svg>
);

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("settings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnyContentItem | EditDraft | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | number | null>(null);

  const {
    projects,
    posts,
    books,
    trips,
    countries,
    blog,
    updates,
    courses,
    experience,
    education,
    awards,
    publications,
    speaking,
    volunteering,
    certificates,
    references,
    interests,
    organizations,
    deleteItem,
    updateContent,
  } = useContent();

  const getItems = () => {
    switch (activeTab) {
      case "experience":
        return experience;
      case "education":
        return education;
      case "awards":
        return awards;
      case "publications":
        return publications;
      case "speaking":
        return speaking;
      case "volunteering":
        return volunteering;
      case "certificates":
        return certificates;
      case "references":
        return references;
      case "interests":
        return interests;
      case "organizations":
        return organizations;
      case "projects":
        return projects;
      case "posts":
        return posts;
      case "books":
        return books;
      case "trips":
        return trips;
      case "countries":
        return countries;
      case "blog":
        return blog;
      case "updates":
        return updates;
      case "courses":
        return courses;
      default:
        return [];
    }
  };

  const handleSaveItem = (updatedItem: AnyContentItem) => {
    if (activeTab === "settings" || activeTab === "profile" || activeTab === "skills" || activeTab === "appearance") return;
    const contentType = TAB_TO_CONTENT_TYPE[activeTab as Exclude<AdminTab, "settings" | "profile" | "skills" | "appearance">];
    const currentItems = getItems();
    const index = currentItems.findIndex(
      (i) => String(i.id) === String(updatedItem.id)
    );
    const newItems =
      index >= 0
        ? currentItems.map((item, i) => (i === index ? updatedItem : item))
        : [updatedItem, ...currentItems];
    updateContent(contentType, newItems as AnyContentItem[]);
  };

  const handleDelete = (id: string | number) => {
    if (activeTab === "settings" || activeTab === "profile" || activeTab === "skills" || activeTab === "appearance") return;
    setPendingDelete(id);
  };

  const confirmDelete = () => {
    if (pendingDelete == null || activeTab === "settings" || activeTab === "profile" || activeTab === "skills" || activeTab === "appearance") return;
    const contentType = TAB_TO_CONTENT_TYPE[activeTab as Exclude<AdminTab, "settings" | "profile" | "skills" | "appearance">];
    deleteItem(contentType, pendingDelete);
    setPendingDelete(null);
  };

  // Items span every content type, so read fields loosely for display.
  const getDisplayData = (source: AnyContentItem) => {
    const item = source as unknown as Record<string, unknown>;
    return {
      id: source.id,
      title: (item.title || item.city || item.name || "Untitled") as string,
      subtitle: (item.organization ||
        item.role ||
        item.author ||
        item.provider ||
        item.country ||
        item.excerpt ||
        item.desc ||
        item.updateType ||
        item.venue ||
        item.event ||
        item.relationship ||
        item.issuer) as string | undefined,
      image: (item.image || item.cover) as string | undefined,
      badge: (item.status ||
        item.postType ||
        item.updateType ||
        (item.visited ? "Visited" : undefined)) as string | undefined,
    };
  };

  const items = getItems();

  return (
    <div className="space-y-8 pb-12">

      <div>
        <div className="flex items-center gap-3 mb-2">
          <BrandMark />
          <h1 className="text-3xl font-bold tracking-[0.06em] text-ink">
            TABULARIUM
          </h1>
        </div>
        <p className="text-muted ml-12">
          The admin panel: every ledger of the record, in one place
        </p>
      </div>

      <AdminTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "settings" ? (
        <SettingsTab />
      ) : activeTab === "profile" ? (
        <ProfileTab />
      ) : activeTab === "skills" ? (
        <SkillsTab />
      ) : activeTab === "appearance" ? (
        <AppearanceTab />
      ) : (
        <div className="bg-card border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <button
              onClick={() => {
                setEditingItem(newItemDraft(activeTab));
                setIsNewItem(true);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-ink text-surface rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Add New
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const d = getDisplayData(item);
              return (
                <div
                  key={d.id}
                  className="flex items-center gap-4 p-4 border border-line rounded-xl hover:bg-surface/60 transition-colors"
                >
                  <div className="w-14 h-10 rounded-lg bg-surface overflow-hidden flex-shrink-0">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                        -
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-ink truncate text-sm">
                        {d.title}
                      </h3>
                      {d.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-surface text-muted rounded-full whitespace-nowrap">
                          {d.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">
                      {d.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => ContentService.downloadMarkdown(item)}
                      className="p-2 text-muted hover:text-signal hover:bg-field/10 rounded-lg transition-colors"
                      title="Download as Markdown"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNewItem(false);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-muted hover:text-signal hover:bg-field/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="text-4xl mb-4">📭</p>
                <p className="font-medium">No items yet.</p>
                <p className="text-sm mt-1">Click "Add New" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab}
        data={editingItem}
        isNew={isNewItem}
        onSave={handleSaveItem}
      />

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete this item?"
        message="The entry is removed from this browser's content. A page reload keeps the deletion; re-importing or reseeding brings it back only if it exists in the seed files."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
