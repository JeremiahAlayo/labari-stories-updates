import AdminShell from "@/components/admin/AdminShell";
import { ScheduledPosts } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Scheduled Posts | Labari CMS",
  description: "Manage scheduled Labari blog posts."
};

export default function ScheduledPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="scheduled"
          description="Plan article releases and keep upcoming content organized."
          title="Scheduled posts"
        >
          <ScheduledPosts />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
