import AdminShell from "@/components/admin/AdminShell";
import ApprovalSimulator from "@/components/admin/ApprovalSimulator";
import { ReviewQueue } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Publishing Access | Labari CMS",
  description: "Manage direct publishing access for Labari blog authors."
};

export default function ReviewQueuePage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="review-queue"
          description="Super Admins can publish directly and assign trusted authors to publish without approval."
          title="Publishing access"
        >
          <ApprovalSimulator posts={posts} />
          <ReviewQueue posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
