import AdminShell from "@/components/admin/AdminShell";
import { ProjectBrief } from "@/components/admin/AdminSections";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Project Brief | Labari CMS",
  description: "Supervisor and CEO update notes for the Labari blog module."
};

export default function ProjectBriefPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-shell" id="main-content">
        <AdminShell
          active="project-brief"
          description="A clear update summary for supervisors, leadership, and the next development phase."
          title="Project brief"
        >
          <ProjectBrief />
        </AdminShell>
      </main>
      <Footer />
    </>
  );
}
