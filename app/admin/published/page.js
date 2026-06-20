import AdminShell from "@/components/admin/AdminShell";
import { PublishedPosts } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Published Posts | Labari CMS",
  description: "View published Labari blog posts."
};

export default function PublishedPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="published"
          description="Published articles that are visible on the public blog."
          title="Published posts"
        >
          <PublishedPosts posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
