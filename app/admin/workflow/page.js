import AdminShell from "@/components/admin/AdminShell";
import { WorkflowBoard } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Publishing Flow | Labari CMS",
  description: "Track how Labari blog content moves from draft to publishing."
};

export default function WorkflowPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="workflow"
          description="Follow content from draft to assigned author publishing or Super Admin publishing."
          title="Publishing flow"
        >
          <WorkflowBoard posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
