import AdminShell from "@/components/admin/AdminShell";
import { TagsManager } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Tags | Labari CMS",
  description: "Manage blog tags for filtering and topic discovery."
};

export default function TagsPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="tags"
          description="Use tags to group related guides, updates, and announcements."
          title="Tags"
        >
          <TagsManager />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
