import AdminShell from "@/components/admin/AdminShell";
import { ActivityLogs } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Activity Logs | Labari CMS",
  description: "Track Labari blog publishing and admin activity."
};

export default function ActivityPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="activity"
          description="See recent publishing actions, role changes, and workflow updates."
          title="Activity logs"
        >
          <ActivityLogs />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
