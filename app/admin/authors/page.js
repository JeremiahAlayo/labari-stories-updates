import AdminShell from "@/components/admin/AdminShell";
import { AuthorsManager } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { authors } from "@/data/authors";

export const metadata = {
  title: "Authors | Labari CMS",
  description: "Manage Labari authors, contributors, and editorial profiles."
};

export default function AuthorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="authors"
          description="Invite contributors, manage author profiles, and assign content ownership."
          title="Authors"
        >
          <AuthorsManager authors={authors} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
