import AdminShell from "@/components/admin/AdminShell";
import { SettingsPanel } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Settings | Labari CMS",
  description: "Manage Labari blog publishing settings."
};

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="settings"
          description="Configure publishing access, notifications, and content behavior."
          title="Settings"
        >
          <SettingsPanel />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
