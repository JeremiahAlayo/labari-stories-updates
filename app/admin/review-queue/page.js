import AdminShell from "@/components/admin/AdminShell";
import ApprovalSimulator from "@/components/admin/ApprovalSimulator";
import { ReviewQueue } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Review Queue | Labari CMS",
  description: "Review submitted Labari blog posts and approval status."
};

export default function ReviewQueuePage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="review-queue"
          description="Review submitted posts, request changes, or move content to final approval."
          title="Review queue"
        >
          <ApprovalSimulator posts={posts} />
          <ReviewQueue posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
