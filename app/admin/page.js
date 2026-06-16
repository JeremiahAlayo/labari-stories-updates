import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Editorial Workspace",
  description:
    "Manage Labari blog drafts, published posts, categories, and article metadata."
};

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <section className="container admin-intro">
          <p className="eyebrow">Editorial Workspace</p>
          <h1>Manage Labari stories and updates.</h1>
          <p>
            Create, edit, and organize articles for announcements, tutorials,
            platform updates, user guides, and general educational content.
          </p>
        </section>
        <AdminDashboard initialPosts={posts} />
      </main>
      <Footer />
    </>
  );
}
