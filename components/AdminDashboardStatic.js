import { createSlug } from "@/utils/slug";

const menuItems = [
  ["Dashboard", "dashboard"],
  ["Blog Posts", "blog-posts"],
  ["Create Post", "create-post"],
  ["Categories", "categories"],
  ["Tags", "tags"],
  ["Authors / Contributors", "authors"],
  ["Review Queue", "review-queue"],
  ["Approval Workflow", "approval-workflow"],
  ["Published Posts", "published-posts"],
  ["Scheduled Posts", "scheduled-posts"],
  ["Media Library", "media-library"],
  ["Comments / Feedback", "comments"],
  ["Analytics", "analytics"],
  ["User Roles & Permissions", "roles"],
  ["Settings", "settings"],
  ["Activity Logs", "activity-logs"]
];

const categoryNames = [
  "Platform Updates",
  "Educational Posts",
  "Announcements",
  "Feature Updates",
  "User Guides",
  "News",
  "Community Updates",
  "Security Tips"
];

const tagNames = [
  "Reading",
  "Dashboard",
  "Text to Speech",
  "Library",
  "Book Discovery",
  "Security",
  "Announcements"
];

const roles = [
  "Super Admin",
  "Head of Social",
  "Final Approver",
  "Content Manager",
  "Editor",
  "Author",
  "Contributor"
];

const workflowStages = [
  "Draft",
  "Submitted for Review",
  "Changes Requested",
  "Approved by Reviewer",
  "Awaiting Final Approval",
  "Scheduled",
  "Published",
  "Rejected"
];

function statusForPost(post) {
  if (post.status === "published" && post.approvalStatus === "submitted") {
    return "submitted for review";
  }
  if (post.status === "published") return "published";
  return post.approvalStatus || post.status || "draft";
}

function countBy(posts, predicate) {
  return posts.filter(predicate).length;
}

export default function AdminDashboardStatic({ initialPosts, initialAuthors }) {
  const publishedPosts = initialPosts.filter((post) => post.status === "published");
  const reviewPosts = initialPosts.filter((post) =>
    ["submitted", "needs changes", "approved"].includes(post.approvalStatus)
  );

  return (
    <section className="container cms-shell" id="dashboard">
      <aside className="cms-sidebar" aria-label="Blog administration">
        <div className="cms-sidebar-header">
          <h2>Labari CMS</h2>
          <a className="cms-new-link" href="#create-post">
            New post
          </a>
        </div>
        <nav className="cms-menu" aria-label="Admin menu">
          {menuItems.map(([label, id], index) => (
            <a className={index === 0 ? "active" : ""} href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="cms-main">
        <div className="cms-topbar">
          <div>
            <p className="eyebrow">Admin system</p>
            <h2>Professional publishing workspace</h2>
            <span className="autosave-note">
              Review build for structure, workflow, and integration planning.
            </span>
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

        <div className="cms-stack">
          <section className="cms-stat-grid" aria-label="Publishing summary">
            <span>
              <strong>{initialPosts.length}</strong>
              Total posts
            </span>
            <span>
              <strong>{reviewPosts.length}</strong>
              Pending approval
            </span>
            <span>
              <strong>{publishedPosts.length}</strong>
              Published
            </span>
            <span>
              <strong>0</strong>
              Scheduled
            </span>
            <span>
              <strong>{countBy(initialPosts, (post) => post.status === "draft")}</strong>
              Drafts
            </span>
          </section>

          <section className="cms-panel" id="blog-posts">
            <div className="cms-panel-header">
              <h3>Blog posts</h3>
              <a className="cms-new-link" href="#create-post">
                Create post
              </a>
            </div>
            <div className="cms-toolbar">
              <label>
                Search posts
                <input placeholder="Search title, author, category..." type="search" />
              </label>
              <label>
                Status
                <select defaultValue="all">
                  <option value="all">All statuses</option>
                  {workflowStages.map((stage) => (
                    <option key={stage} value={createSlug(stage)}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select defaultValue="all">
                  <option value="all">All categories</option>
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="bulk-actions">
              <span>Bulk actions</span>
              <button type="button">Publish</button>
              <button type="button">Archive</button>
              <button type="button">Restore draft</button>
            </div>
            <PostTable posts={initialPosts} />
          </section>

          <section className="cms-editor" id="create-post">
            <div className="editor-header">
              <div>
                <p className="eyebrow">Publishing editor</p>
                <h2>Create or edit post</h2>
                <span className="autosave-note">
                  Autosave, revision history, approval comments, and publishing
                  actions are represented for backend integration.
                </span>
              </div>
              <div className="editor-actions">
                <button type="button">Save draft</button>
                <button type="button">Submit review</button>
                <button type="button">Publish</button>
              </div>
            </div>
            <div className="workflow-map" aria-label="Publishing workflow">
              {["Draft", "Review", "Head Approval", "Final Approval", "Published"].map(
                (stage, index) => (
                  <span className={index === 0 ? "active" : ""} key={stage}>
                    {stage}
                  </span>
                )
              )}
            </div>
            <div className="cms-editor-grid">
              <div className="cms-panel cms-stack">
                <label>
                  Title
                  <input placeholder="Enter blog post title" />
                </label>
                <label>
                  Slug
                  <input placeholder="clean-readable-slug" />
                </label>
                <label>
                  Rich text editor
                  <div className="editor-toolbar" aria-label="Editor tools">
                    <button type="button">B</button>
                    <button type="button">I</button>
                    <button type="button">H2</button>
                    <button type="button">Link</button>
                    <button type="button">Quote</button>
                  </div>
                  <textarea rows="14" placeholder="Write the article content here..." />
                </label>
                <div className="approval-comments">
                  <h3>Approval comments</h3>
                  <textarea rows="3" placeholder="Reviewer feedback appears here..." />
                  <button type="button">Add comment</button>
                </div>
              </div>

              <aside className="cms-panel cms-stack">
                <span className="status-badge status-draft">draft</span>
                <label>
                  Author
                  <select defaultValue="">
                    <option value="">Assign author</option>
                    {initialAuthors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Category
                  <select defaultValue="User Guides">
                    {categoryNames.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Featured image
                  <input placeholder="https://..." type="url" />
                </label>
                <label>
                  Schedule date
                  <input type="datetime-local" />
                </label>
                <div className="checkbox-list">
                  <label>
                    <input type="checkbox" />
                    Featured post
                  </label>
                  <label>
                    <input type="checkbox" />
                    Pin post
                  </label>
                </div>
                <label>
                  SEO title
                  <input placeholder="SEO title" />
                </label>
                <label>
                  Meta description
                  <textarea rows="4" maxLength="180" />
                </label>
                <div className="tag-picker">
                  <span>Tags</span>
                  {tagNames.slice(0, 5).map((tag) => (
                    <button key={tag} type="button">
                      {tag}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <section className="cms-two-column" id="categories">
            <div className="cms-panel cms-stack">
              <h3>Create category</h3>
              <label>
                Category name
                <input placeholder="Category name" />
              </label>
              <label>
                Description
                <textarea rows="4" />
              </label>
              <label className="inline-check">
                <input type="checkbox" defaultChecked />
                Visible on public blog
              </label>
              <button type="button">Save category</button>
            </div>
            <div className="cms-panel">
              <h3>Categories</h3>
              <div className="taxonomy-list">
                {categoryNames.map((category) => (
                  <div key={category}>
                    <span>
                      <strong>{category}</strong>
                      {countBy(initialPosts, (post) => post.category === category)} posts
                    </span>
                    <button type="button">Edit</button>
                    <button type="button">Disable</button>
                    <button type="button">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="cms-two-column" id="tags">
            <div className="cms-panel cms-stack">
              <h3>Create tag</h3>
              <label>
                Tag name
                <input placeholder="Tag name" />
              </label>
              <button type="button">Save tag</button>
            </div>
            <div className="cms-panel">
              <h3>Tags</h3>
              <div className="tag-admin-list">
                {tagNames.map((tag) => (
                  <span key={tag}>
                    {tag}
                    <button type="button">Remove</button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="cms-panel" id="authors">
            <h3>Authors and contributors</h3>
            <div className="user-list">
              {initialAuthors.map((author) => (
                <div key={author.id}>
                  <span>
                    <strong>{author.name}</strong>
                    {author.bio}
                  </span>
                  <span className="status-badge">{author.role}</span>
                  <button type="button">Edit</button>
                </div>
              ))}
            </div>
          </section>

          <section className="cms-panel" id="review-queue">
            <h3>Review queue</h3>
            <PostTable posts={reviewPosts} />
          </section>

          <section className="cms-stack" id="approval-workflow">
            <div className="workflow-board">
              {workflowStages.map((stage) => (
                <div key={stage}>
                  <h3>{stage}</h3>
                  {initialPosts.slice(0, 2).map((post) => (
                    <button key={`${stage}-${post.slug}`} type="button">
                      <strong>{post.title}</strong>
                      <span>{post.authorName}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="cms-panel" id="published-posts">
            <h3>Published posts</h3>
            <PostTable posts={publishedPosts} />
          </section>

          <section className="cms-panel" id="scheduled-posts">
            <h3>Scheduled posts</h3>
            <p className="muted-copy">Scheduled articles will appear here.</p>
          </section>

          <section className="cms-panel" id="media-library">
            <div className="cms-panel-header">
              <h3>Media library</h3>
              <button type="button">Upload image</button>
            </div>
            <div className="media-grid">
              {initialPosts.slice(0, 6).map((post) => (
                <span className={`image-placeholder tone-${post.imageTone || "green"}`} key={post.slug}>
                  {post.category}
                </span>
              ))}
            </div>
          </section>

          <section className="cms-two-column">
            <div className="cms-panel" id="comments">
              <h3>Comments / Feedback</h3>
              <div className="activity-list">
                <span>
                  <strong>Request changes</strong>
                  <small>Improve intro clarity before final approval.</small>
                  <small>Head of Social - Review stage</small>
                </span>
              </div>
            </div>
            <div className="cms-panel" id="analytics">
              <h3>Analytics</h3>
              <div className="analytics-grid">
                <span>
                  <strong>{publishedPosts.length}</strong>
                  Published posts
                  <small>Visible on public blog</small>
                </span>
                <span>
                  <strong>0</strong>
                  GA4 connected
                  <small>Set NEXT_PUBLIC_GA_ID for live tracking</small>
                </span>
              </div>
            </div>
          </section>

          <section className="cms-two-column">
            <div className="cms-panel" id="roles">
              <h3>User Roles & Permissions</h3>
              <div className="user-list">
                {roles.map((role) => (
                  <div key={role}>
                    <span>
                      <strong>{role}</strong>
                      Role-based publishing permissions
                    </span>
                    <button type="button">Manage</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="cms-panel cms-stack" id="settings">
              <h3>Settings</h3>
              <label className="inline-check">
                <input type="checkbox" defaultChecked />
                Require final approval before publishing
              </label>
              <label className="inline-check">
                <input type="checkbox" defaultChecked />
                Notify approvers when posts are submitted
              </label>
            </div>
          </section>

          <section className="cms-panel" id="activity-logs">
            <h3>Activity logs</h3>
            <div className="activity-list">
              <span>
                <strong>CMS workspace prepared</strong>
                <small>Labari Blog</small>
                <small>System - Review build</small>
              </span>
              <span>
                <strong>Role workflow mapped</strong>
                <small>Author, reviewer, final approver, and super admin</small>
                <small>System - Review build</small>
              </span>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function PostTable({ posts }) {
  return (
    <div className="cms-table" role="table" aria-label="Blog posts">
      <div className="cms-row cms-row-head" role="row">
        <span>Post</span>
        <span>Status</span>
        <span>Author</span>
        <span>Category</span>
        <span>Updated</span>
      </div>
      {posts.map((post) => (
        <div className="cms-row" key={post.slug} role="row">
          <span>
            <input aria-label={`Select ${post.title}`} type="checkbox" />
            <a href={`/blog/${post.slug}`}>
              <strong>{post.title}</strong>
              <small>/blog/{post.slug}</small>
            </a>
          </span>
          <span className={`status-badge status-${createSlug(statusForPost(post))}`}>
            {statusForPost(post)}
          </span>
          <span>{post.authorName}</span>
          <span>{post.category}</span>
          <span>{post.date || "Not set"}</span>
        </div>
      ))}
    </div>
  );
}
