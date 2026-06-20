import AdminShell from "@/components/admin/AdminShell";
import { WorkflowBoard } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Workflow | Labari CMS",
  description: "Track Labari blog content through editorial approval stages."
};

export default function WorkflowPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="workflow"
          description="Follow content from draft through review, final approval, and publishing."
          title="Approval workflow"
        >
          <WorkflowBoard posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
