import AdminShell from "@/components/admin/AdminShell";
import { DashboardHome } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { authors } from "@/data/authors";
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
            Create articles, assign authors, prepare social captions, submit
            drafts for review, and track final approval before publishing.
          </p>
        </section>
        <AdminShell
          active="dashboard"
          description="A clear overview of publishing activity, team work, and blog health."
          title="Dashboard"
        >
          <DashboardHome authors={authors} posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
