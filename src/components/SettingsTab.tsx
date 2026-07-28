import { SiteIdentityCard } from "./SiteIdentityCard";
import { RepoSyncCard } from "./RepoSyncCard";
import { PortfolioExportCard } from "./PortfolioExportCard";

/** Site-level settings: the site's identity (name, metas, page copy), the
 *  repository connection, and the exports. Personal fields live under
 *  Profile; skills under Skills. */
export const SettingsTab = () => (
  <div className="space-y-8">
    <SiteIdentityCard />
    <RepoSyncCard />
    <PortfolioExportCard />
  </div>
);
