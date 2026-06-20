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
  "Ready to Publish",
  "Scheduled",
  "Published",
  "Archived"
];

export function getPostStatus(post) {
  if (post.status === "published") return "published";

  return post.status || "draft";
}

export function getAdminPostGroups(posts) {
  const publishedPosts = posts.filter((post) => post.status === "published");
  const accessPosts = posts.filter((post) => post.canPublishDirectly);
  const draftPosts = posts.filter((post) => post.status === "draft");
  const scheduledPosts = posts.filter((post) => post.status === "scheduled");

  return {
    accessPosts,
    draftPosts,
    publishedPosts,
    scheduledPosts
  };
}

function countBy(posts, predicate) {
  return posts.filter(predicate).length;
}

export function StatGrid({ posts }) {
  const { accessPosts, draftPosts, publishedPosts, scheduledPosts } =
    getAdminPostGroups(posts);

  return (
    <section className="cms-stat-grid" aria-label="Publishing summary">
      <span>
        <strong>{posts.length}</strong>
        Total posts
      </span>
      <span>
        <strong>{accessPosts.length}</strong>
        Direct access
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
  const { accessPosts, draftPosts, publishedPosts } = getAdminPostGroups(posts);
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
              <strong>{accessPosts.length} direct-publish posts</strong>
              <small>Posts assigned to authors who can publish without approval</small>
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
            Prepare the article, SEO fields, image, schedule, and publishing access.
          </span>
        </div>
        <div className="editor-actions">
          <button type="button">Save draft</button>
          <button type="button">Assign access</button>
          <button type="button">Publish</button>
        </div>
      </div>
      <div className="workflow-map" aria-label="Publishing workflow">
        {["Draft", "Assigned Author", "Super Admin", "Published"].map((stage, index) => (
          <span className={index === 0 ? "active" : ""} key={stage}>
            {stage}
          </span>
        ))}
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
            <h3>Publishing notes</h3>
            <textarea rows="3" placeholder="Internal note for this post..." />
            <button type="button">Add note</button>
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
  const { accessPosts } = getAdminPostGroups(posts);

  return (
    <section className="cms-panel">
      <div className="cms-panel-header">
        <h3>Assigned publishing access</h3>
        <span className="status-badge">{accessPosts.length} assigned</span>
      </div>
      <PostTable posts={accessPosts} />
    </section>
  );
}

export function WorkflowBoard({ posts }) {
  return (
    <section className="cms-stack">
      <div className="workflow-map" aria-label="Publishing workflow">
        {["Draft", "Assigned Author", "Super Admin", "Published"].map((stage, index) => (
          <span className={index < 2 ? "active" : ""} key={stage}>
            {stage}
          </span>
        ))}
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
          <strong>Content note</strong>
          <small>Improve intro clarity before publishing.</small>
          <small>Super Admin - Publishing</small>
        </span>
        <span>
          <strong>Publishing note</strong>
          <small>Confirm that the featured image is cleared for publishing.</small>
          <small>Assigned Author - Draft</small>
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
      <h3>Publishing access</h3>
      <div className="user-list">
        {roles.map((role) => (
          <div key={role}>
            <span>
              <strong>{role}</strong>
              {role === "Super Admin"
                ? "Can publish any post and assign direct-publish access"
                : role === "Assigned Author"
                  ? "Can publish assigned posts without approval"
                  : "Can draft posts until access is assigned"}
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
        Super Admin can publish directly
      </label>
      <label className="inline-check">
        <input defaultChecked type="checkbox" />
        Assigned authors can publish their assigned posts
      </label>
      <label className="inline-check">
        <input type="checkbox" />
        Limit assigned authors to draft-only access
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
          <strong>Publishing access mapped</strong>
          <small>Super Admin and assigned author access</small>
          <small>System - Today</small>
        </span>
        <span>
          <strong>Category visibility updated</strong>
          <small>Platform Updates remains visible on the public blog</small>
          <small>Super Admin - Today</small>
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
