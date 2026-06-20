import AdminShell from "@/components/admin/AdminShell";
import { PostsManager } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Blog Posts | Labari CMS",
  description: "Manage Labari blog posts, filters, statuses, and bulk actions."
};

export default function PostsPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="posts"
          description="Search, filter, edit, publish, archive, or restore blog posts."
          title="Blog posts"
        >
          <PostsManager posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
