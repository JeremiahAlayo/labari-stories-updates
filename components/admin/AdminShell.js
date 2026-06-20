import Link from "next/link";
import AdminActionNotice from "@/components/admin/AdminActionNotice";

export const adminMenuItems = [
  { label: "Dashboard", href: "/admin", id: "dashboard" },
  { label: "Project Brief", href: "/admin/project-brief", id: "project-brief" },
  { label: "Blog Posts", href: "/admin/posts", id: "posts" },
  { label: "Create Post", href: "/admin/create-post", id: "create-post" },
  { label: "Categories", href: "/admin/categories", id: "categories" },
  { label: "Tags", href: "/admin/tags", id: "tags" },
  { label: "Authors", href: "/admin/authors", id: "authors" },
  { label: "Publishing Access", href: "/admin/review-queue", id: "review-queue" },
  { label: "Publishing Flow", href: "/admin/workflow", id: "workflow" },
  { label: "Published", href: "/admin/published", id: "published" },
  { label: "Scheduled", href: "/admin/scheduled", id: "scheduled" },
  { label: "Media Library", href: "/admin/media", id: "media" },
  { label: "Feedback", href: "/admin/feedback", id: "feedback" },
  { label: "Analytics", href: "/admin/analytics", id: "analytics" },
  { label: "Access Settings", href: "/admin/roles", id: "roles" },
  { label: "Settings", href: "/admin/settings", id: "settings" },
  { label: "Activity Logs", href: "/admin/activity", id: "activity" }
];

export const roles = [
  "Super Admin",
  "Assigned Author",
  "Author"
];

export default function AdminShell({
  active,
  children,
  eyebrow = "Admin system",
  title,
  description
}) {
  return (
    <section className="container cms-shell">
      <aside className="cms-sidebar" aria-label="Blog administration">
        <div className="cms-sidebar-header">
          <h2>Labari CMS</h2>
          <Link className="cms-new-link" href="/admin/create-post">
            New post
          </Link>
        </div>
        <nav className="cms-menu" aria-label="Admin menu">
          {adminMenuItems.map((item) => (
            <Link
              aria-current={active === item.id ? "page" : undefined}
              className={active === item.id ? "active" : ""}
              href={item.href}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="cms-main">
        <div className="cms-topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            {description ? (
              <span className="autosave-note">{description}</span>
            ) : null}
          </div>
          <label>
            Preview role
            <select defaultValue="Super Admin">
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="cms-stack">{children}</div>
      </div>
      <AdminActionNotice />
    </section>
  );
}
