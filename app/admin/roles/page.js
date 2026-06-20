import AdminShell, { roles } from "@/components/admin/AdminShell";
import { RolesPanel } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Roles | Labari CMS",
  description: "Manage blog role and permission structure."
};

export default function RolesPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="roles"
          description="Control who can write, review, approve, publish, and manage settings."
          title="User roles and permissions"
        >
          <RolesPanel roles={roles} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
