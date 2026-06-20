import AdminShell from "@/components/admin/AdminShell";
import { AnalyticsPanel } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";

export const metadata = {
  title: "Analytics | Labari CMS",
  description: "View Labari blog analytics and publishing performance summary."
};

export default function AnalyticsPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="analytics"
          description="Monitor article performance and Google Analytics readiness."
          title="Analytics"
        >
          <AnalyticsPanel posts={posts} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
