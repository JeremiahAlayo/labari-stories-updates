import AdminShell from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { authors } from "@/data/authors";

export const metadata = {
  title: "Create Post | Labari CMS",
  description: "Create and prepare Labari blog posts with SEO and workflow fields."
};

export default function CreatePostPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="create-post"
          description="Write the article, assign ownership, prepare SEO fields, and publish when access allows."
          title="Create post"
        >
          <PostEditor authors={authors} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
