import {
  Settings,
  Palette,
  FolderOpen,
  BookOpen,
  GraduationCap,
  MapPin,
  Globe,
  PenTool,
  FileText,
  Zap,
  Briefcase,
  Trophy,
  BookMarked,
  Mic2,
  Heart,
  BadgeCheck,
  Users,
  Building2,
  Smile,
  Wrench,
} from "lucide-react";
import { cn } from "@/shared/lib";
import type { AdminTab } from "@/features/edit-record";

interface AdminTabsProps {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}

// Groups mirror the public site: the order a visitor meets the content in
// the navigation and on the home page, so the admin reads like the site map.
const TAB_GROUPS = [
  {
    label: "System",
    tabs: [
      { id: "settings",   label: "Site",       icon: Settings },
      { id: "profile",    label: "Profile",    icon: Users    },
      { id: "skills",     label: "Skills",     icon: Wrench   },
      { id: "appearance", label: "Appearance", icon: Palette  },
    ],
  },
  {
    label: "Career",
    tabs: [
      { id: "experience",    label: "Experience",    icon: Briefcase     },
      { id: "education",     label: "Education",     icon: GraduationCap },
      { id: "courses",       label: "Courses",       icon: BookMarked    },
      { id: "awards",        label: "Awards",        icon: Trophy        },
      { id: "certificates",  label: "Certificates",  icon: BadgeCheck    },
      { id: "publications",  label: "Publications",  icon: FileText      },
      { id: "speaking",      label: "Speaking",      icon: Mic2          },
      { id: "volunteering",  label: "Volunteering",  icon: Heart         },
      { id: "organizations", label: "Organizations", icon: Building2     },
      { id: "references",    label: "References",    icon: Users         },
      { id: "projects",      label: "Projects",      icon: FolderOpen    },
    ],
  },
  {
    label: "Writing",
    tabs: [
      { id: "blog",    label: "Blog",    icon: FileText },
      { id: "posts",   label: "Garden",  icon: PenTool  },
      { id: "updates", label: "Updates", icon: Zap      },
    ],
  },
  {
    label: "Life",
    tabs: [
      { id: "books",     label: "Books",     icon: BookOpen },
      { id: "interests", label: "Interests", icon: Smile    },
      { id: "countries", label: "Countries", icon: Globe    },
      { id: "trips",     label: "Cities",    icon: MapPin   },
    ],
  },
] as const;

/** The tab strip, grouped to mirror the order a visitor meets the site. */
export const AdminTabs = ({ activeTab, onChange }: AdminTabsProps) => {
  return (
    <div className="space-y-2 pb-2">
      {TAB_GROUPS.map((group) => (
        <div key={group.label} className="flex items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            {group.label}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {group.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-ink text-surface shadow-sm"
                    : "bg-card text-muted hover:bg-surface border border-line"
                )}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
