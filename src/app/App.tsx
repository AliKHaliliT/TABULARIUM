import { AdminPage } from "@/pages/admin";
import { AppProviders } from "./providers";
import { AppLayout } from "./layout/AppLayout";

/**
 * TABULARIUM is one page: the admin panel.
 *
 * @returns The panel inside its providers and its chrome.
 */
export function App() {
  return (
    <AppProviders>
      <AppLayout>
        <AdminPage />
      </AppLayout>
    </AppProviders>
  );
}
