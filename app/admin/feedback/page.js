import AdminShell from "@/components/admin/AdminShell";
import { FeedbackPanel } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Feedback | Labari CMS",
  description: "Review editorial notes and content feedback."
};

export default function FeedbackPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="feedback"
          description="Track internal notes, requested edits, and content feedback."
          title="Comments and feedback"
        >
          <FeedbackPanel />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
