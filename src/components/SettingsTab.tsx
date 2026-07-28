import { SiteIdentityCard } from "./SiteIdentityCard";
import { PortfolioExportCard } from "./PortfolioExportCard";

/** Site-level settings: the site's identity (name, metas, page copy) and the
 *  portfolio export. Personal fields live under Profile; skills under Skills. */
export const SettingsTab = () => (
  <div className="space-y-8">
    <SiteIdentityCard />
    <PortfolioExportCard />
  </div>
);
