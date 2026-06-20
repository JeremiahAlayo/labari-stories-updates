import Link from "next/link";

import { createSlug } from "@/utils/slug";

export const categoryNames = [
  "Platform Updates",
  "Educational Posts",
  "Announcements",
  "Feature Updates",
  "User Guides",
  "News",
  "Community Updates",
  "Security Tips"
];

export const tagNames = [
  "Reading",
  "Dashboard",
  "Text to Speech",
  "Library",
  "Book Discovery",
  "Security",
  "Announcements"
];

export const workflowStages = [
  "Draft",
  "Submitted for Review",
  "Changes Requested",
  "Approved by Reviewer",
  "Awaiting Final Approval",
  "Scheduled",
  "Published",
  "Rejected"
];

export function getPostStatus(post) {
  if (post.status === "published" && post.approvalStatus === "submitted") {
    return "submitted for review";
  }

  if (post.status === "published") return "published";

  return post.approvalStatus || post.status || "draft";
}

export function getAdminPostGroups(posts) {
  const publishedPosts = posts.filter((post) => post.status === "published");
  const reviewPosts = posts.filter((post) =>
    ["submitted", "needs changes", "approved"].includes(post.approvalStatus)
  );
  const draftPosts = posts.filter((post) => post.status === "draft");
  const scheduledPosts = posts.filter((post) => post.status === "scheduled");

  return {
    draftPosts,
    publishedPosts,
    reviewPosts,
    scheduledPosts
  };
}

function countBy(posts, predicate) {
  return posts.filter(predicate).length;
}

export function StatGrid({ posts }) {
  const { draftPosts, publishedPosts, reviewPosts, scheduledPosts } =
    getAdminPostGroups(posts);

  return (
    <section className="cms-stat-grid" aria-label="Publishing summary">
      <span>
        <strong>{posts.length}</strong>
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
        <strong>{scheduledPosts.length}</strong>
        Scheduled
      </span>
      <span>
        <strong>{draftPosts.length}</strong>
        Drafts
      </span>
    </section>
  );
}

export function DashboardHome({ posts, authors }) {
  const { draftPosts, publishedPosts, reviewPosts } = getAdminPostGroups(posts);
  const recentPosts = posts.slice(0, 4);

  return (
    <>
      <StatGrid posts={posts} />
      <section className="cms-two-column">
        <div className="cms-panel">
          <div className="cms-panel-header">
            <h3>Recent work</h3>
            <Link className="cms-new-link" href="/admin/posts">
              View posts
            </Link>
          </div>
          <div className="cms-mini-list">
            {recentPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <strong>{post.title}</strong>
                <span>{post.category} - {getPostStatus(post)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="cms-panel">
          <h3>Publishing health</h3>
          <div className="activity-list">
            <span>
              <strong>{reviewPosts.length} in review</strong>
              <small>Posts waiting for editorial action</small>
            </span>
            <span>
              <strong>{publishedPosts.length} published</strong>
              <small>Visible on the public blog</small>
            </span>
            <span>
              <strong>{draftPosts.length} draft</strong>
              <small>Still being prepared by authors</small>
            </span>
            <span>
              <strong>{authors.length} contributors</strong>
              <small>Available author profiles</small>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export function PostsManager({ posts }) {
  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Blog posts</h3>
        <Link className="cms-new-link" href="/admin/create-post">
          Create post
        </Link>
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
      <PostTable posts={posts} />
    </section>
  );
}

export function PostEditor({ authors }) {
  return (
    <section className="cms-editor">
      <div className="editor-header">
        <div>
          <p className="eyebrow">Publishing editor</p>
          <h2>Create or edit post</h2>
          <span className="autosave-note">
            Prepare the article, SEO fields, image, schedule, and approval notes.
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
              {authors.map((author) => (
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
            <textarea maxLength="180" rows="4" />
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
  );
}

export function CategoriesManager({ posts }) {
  return (
    <section className="cms-two-column">
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
          <input defaultChecked type="checkbox" />
          Visible on public blog
        </label>
        <button type="submit">Save category</button>
      </div>
      <div className="cms-panel">
        <h3>Categories</h3>
        <div className="taxonomy-list">
          {categoryNames.map((category) => (
            <div key={category}>
              <span>
                <strong>{category}</strong>
                {countBy(posts, (post) => post.category === category)} posts
              </span>
              <button type="button">Edit</button>
              <button type="button">Disable</button>
              <button type="button">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TagsManager() {
  return (
    <section className="cms-two-column">
      <div className="cms-panel cms-stack">
        <h3>Create tag</h3>
        <label>
          Tag name
          <input placeholder="Tag name" />
        </label>
        <button type="submit">Save tag</button>
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
  );
}

export function AuthorsManager({ authors }) {
  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Authors and contributors</h3>
        <button type="button">Invite author</button>
      </div>
      <div className="user-list">
        {authors.map((author) => (
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
  );
}

export function ReviewQueue({ posts }) {
  const { reviewPosts } = getAdminPostGroups(posts);

  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Review queue</h3>
        <span className="status-badge">{reviewPosts.length} pending</span>
      </div>
      <PostTable posts={reviewPosts} />
    </section>
  );
}

export function WorkflowBoard({ posts }) {
  return (
    <section className="cms-stack">
      <div className="workflow-map" aria-label="Publishing workflow">
        {["Author", "Review Stage", "Head Approval", "Final Approval", "Published"].map(
          (stage, index) => (
            <span className={index < 2 ? "active" : ""} key={stage}>
              {stage}
            </span>
          )
        )}
      </div>
      <div className="workflow-board">
        {workflowStages.map((stage) => (
          <div key={stage}>
            <h3>{stage}</h3>
            {posts.slice(0, 2).map((post) => (
              <button key={`${stage}-${post.slug}`} type="button">
                <strong>{post.title}</strong>
                <span>{post.authorName}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function PublishedPosts({ posts }) {
  const { publishedPosts } = getAdminPostGroups(posts);

  return (
    <section className="cms-panel">
      <h3>Published posts</h3>
      <PostTable posts={publishedPosts} />
    </section>
  );
}

export function ScheduledPosts() {
  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Scheduled posts</h3>
        <Link className="cms-new-link" href="/admin/create-post">
          Schedule post
        </Link>
      </div>
      <p className="muted-copy">
        Scheduled articles will appear here after a publish date is assigned.
      </p>
    </section>
  );
}

export function MediaLibrary({ posts }) {
  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Media library</h3>
        <button type="button">Upload image</button>
      </div>
      <div className="media-grid">
        {posts.slice(0, 6).map((post) => (
          <span
            className={`image-placeholder tone-${post.imageTone || "green"}`}
            key={post.slug}
          >
            {post.category}
          </span>
        ))}
      </div>
    </section>
  );
}

export function FeedbackPanel() {
  return (
    <section className="cms-panel">
      <h3>Comments and feedback</h3>
      <div className="activity-list">
        <span>
          <strong>Request changes</strong>
          <small>Improve intro clarity before final approval.</small>
          <small>Head of Social - Review stage</small>
        </span>
        <span>
          <strong>Approval note</strong>
          <small>Confirm that the featured image is cleared for publishing.</small>
          <small>Final approver - Publishing stage</small>
        </span>
      </div>
    </section>
  );
}

export function AnalyticsPanel({ posts }) {
  const { publishedPosts } = getAdminPostGroups(posts);

  return (
    <section className="cms-panel">
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
        <span>
          <strong>4m</strong>
          Average reading time
          <small>Estimated from article metadata</small>
        </span>
      </div>
    </section>
  );
}

export function RolesPanel({ roles }) {
  return (
    <section className="cms-panel">
      <h3>User roles and permissions</h3>
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
    </section>
  );
}

export function SettingsPanel() {
  return (
    <section className="cms-panel cms-stack">
      <h3>Settings</h3>
      <label className="inline-check">
        <input defaultChecked type="checkbox" />
        Require final approval before publishing
      </label>
      <label className="inline-check">
        <input defaultChecked type="checkbox" />
        Notify approvers when posts are submitted
      </label>
      <label className="inline-check">
        <input defaultChecked type="checkbox" />
        Allow authors to edit returned posts
      </label>
    </section>
  );
}

export function ActivityLogs() {
  return (
    <section className="cms-panel">
      <h3>Activity logs</h3>
      <div className="activity-list">
        <span>
          <strong>Publishing workflow mapped</strong>
          <small>Author, reviewer, final approver, and super admin permissions</small>
          <small>System - Today</small>
        </span>
        <span>
          <strong>Category visibility updated</strong>
          <small>Platform Updates remains visible on the public blog</small>
          <small>Content Manager - Today</small>
        </span>
      </div>
    </section>
  );
}

export function PostTable({ posts }) {
  if (!posts.length) {
    return (
      <div className="cms-empty">
        <strong>No posts found</strong>
        <span>Items will appear here when they match this section.</span>
      </div>
    );
  }

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
            <Link href={`/blog/${post.slug}`}>
              <strong>{post.title}</strong>
              <small>/blog/{post.slug}</small>
            </Link>
          </span>
          <span className={`status-badge status-${createSlug(getPostStatus(post))}`}>
            {getPostStatus(post)}
          </span>
          <span>{post.authorName}</span>
          <span>{post.category}</span>
          <span>{post.date || "Not set"}</span>
        </div>
      ))}
    </div>
  );
}
