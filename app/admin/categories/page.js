import AdminShell from "@/components/admin/AdminShell";
import { CategoriesManager } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Categories | Labari CMS",
  description: "Create, edit, disable, and manage Labari blog categories."
};

export default function CategoriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="categories"
          description="Keep blog topics organized and control category visibility."
          title="Categories"
        >
          <CategoriesManager posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
