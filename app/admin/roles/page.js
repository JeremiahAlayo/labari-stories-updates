import AdminShell, { roles } from "@/components/admin/AdminShell";
import { RolesPanel } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Access Settings | Labari CMS",
  description: "Manage blog publishing access."
};

export default function RolesPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="roles"
          description="Keep publishing simple: Super Admins publish directly, assigned authors publish assigned posts."
          title="Access settings"
        >
          <RolesPanel roles={roles} />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
