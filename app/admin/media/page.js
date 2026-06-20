import AdminShell from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Media Library | Labari CMS",
  description: "Manage featured images and blog media assets."
};

export default function MediaPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="media"
          description="Organize article images and other publishing assets."
          title="Media library"
        >
          <MediaLibrary posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
