"use client";

import { useEffect, useMemo, useState } from "react";
import { createSlug } from "@/utils/slug";

const postsStorageKey = "labari-blog-cms-posts-v1";
const usersStorageKey = "labari-blog-cms-users-v1";
const categoriesStorageKey = "labari-blog-cms-categories-v1";
const tagsStorageKey = "labari-blog-cms-tags-v1";
const activityStorageKey = "labari-blog-cms-activity-v1";

const roleOptions = [
  "Super Admin",
  "Head of Social",
  "Final Approver",
  "Content Manager",
  "Editor",
  "Author",
  "Contributor"
];

const statusOptions = [
  "draft",
  "submitted for review",
  "changes requested",
  "approved by reviewer",
  "awaiting final approval",
  "scheduled",
  "published",
  "rejected",
  "archived"
];

const menuItems = [
  "Dashboard",
  "Blog Posts",
  "Create Post",
  "Categories",
  "Tags",
  "Authors / Contributors",
  "Review Queue",
  "Approval Workflow",
  "Published Posts",
  "Scheduled Posts",
  "Media Library",
  "Comments / Feedback",
  "Analytics",
  "User Roles & Permissions",
  "Settings",
  "Activity Logs"
];

const roleMenuAccess = {
  "Super Admin": menuItems,
  "Head of Social": [
    "Dashboard",
    "Blog Posts",
    "Create Post",
    "Review Queue",
    "Approval Workflow",
    "Comments / Feedback",
    "Analytics",
    "Activity Logs"
  ],
  "Final Approver": [
    "Dashboard",
    "Blog Posts",
    "Review Queue",
    "Approval Workflow",
    "Published Posts",
    "Scheduled Posts",
    "Analytics",
    "Activity Logs"
  ],
  "Content Manager": [
    "Dashboard",
    "Blog Posts",
    "Create Post",
    "Categories",
    "Tags",
    "Authors / Contributors",
    "Review Queue",
    "Media Library",
    "Analytics"
  ],
  Editor: [
    "Dashboard",
    "Blog Posts",
    "Create Post",
    "Review Queue",
    "Comments / Feedback"
  ],
  Author: ["Dashboard", "Blog Posts", "Create Post", "Comments / Feedback"],
  Contributor: ["Dashboard", "Create Post", "Comments / Feedback"]
};

const defaultCategories = [
  "Platform Updates",
  "Educational Posts",
  "Announcements",
  "Feature Updates",
  "User Guides",
  "News",
  "Community Updates",
  "Security Tips"
].map((name) => ({
  id: createSlug(name),
  name,
  slug: createSlug(name),
  description: "",
  visible: true
}));

const defaultTags = [
  "Reading",
  "Dashboard",
  "Text to Speech",
  "Library",
  "Book Discovery"
].map((name) => ({
  id: createSlug(name),
  name,
  slug: createSlug(name)
}));

const emptyCategory = {
  name: "",
  description: "",
  visible: true
};

const emptyTag = {
  name: ""
};

const emptyUser = {
  name: "",
  email: "",
  role: "Contributor",
  bio: "",
  active: true
};

const emptyPost = {
  title: "",
  slug: "",
  seoTitle: "",
  description: "",
  category: "User Guides",
  tags: [],
  authorId: "",
  authorName: "",
  status: "draft",
  reviewer: "Head of Social",
  finalApprovers: ["Final Approver"],
  featuredImage: "",
  featured: false,
  pinned: false,
  scheduledAt: "",
  publishedAt: "",
  deletedAt: "",
  socialCopy: "",
  body: "",
  content: [
    {
      heading: "",
      paragraphs: [""]
    }
  ],
  revisions: [],
  comments: []
};

function timestamp() {
  return new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function categoryFromName(name) {
  return {
    id: createSlug(name),
    name,
    slug: createSlug(name),
    description: "",
    visible: true
  };
}

function normalizeUser(user) {
  const name = user.name || user.authorName || "Unnamed contributor";
  return {
    ...emptyUser,
    ...user,
    id: user.id || createSlug(name),
    name,
    email: user.email || `${createSlug(name)}@labari.local`,
    role: user.role || "Author",
    active: user.active ?? true
  };
}

function normalizePost(post) {
  const body =
    post.body ||
    post.content
      ?.flatMap((section) => [
        section.heading,
        ...(section.paragraphs || [])
      ])
      .filter(Boolean)
      .join("\n\n") ||
    "";

  return {
    ...emptyPost,
    ...post,
    seoTitle: post.seoTitle || post.title || "",
    status:
      post.status === "published"
        ? "published"
        : post.approvalStatus === "submitted"
          ? "submitted for review"
          : post.approvalStatus === "approved"
            ? "awaiting final approval"
            : post.status || "draft",
    tags: post.tags || [],
    finalApprovers: post.finalApprovers || [post.finalApprover || "Final Approver"],
    body,
    readTime: post.readTime || estimateReadingTime(body),
    publishedAt: post.publishedAt || post.date || "",
    revisions: post.revisions || [],
    comments: post.comments || []
  };
}

function canUseMenu(role, menu) {
  return roleMenuAccess[role]?.includes(menu);
}

function readStorage(key) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in restricted previews.
  }
}

export default function AdminDashboard({ initialPosts, initialAuthors }) {
  const initialUsers = useMemo(
    () =>
      initialAuthors.map((author) =>
        normalizeUser({
          ...author,
          role:
            author.role === "Final Approver"
              ? "Final Approver"
              : author.role === "Content Team"
                ? "Author"
                : "Editor"
        })
      ),
    [initialAuthors]
  );

  const initialCategories = useMemo(() => {
    const categoryNames = [
      ...new Set([
        ...defaultCategories.map((category) => category.name),
        ...initialPosts.map((post) => post.category).filter(Boolean)
      ])
    ];
    return categoryNames.map((name) => categoryFromName(name));
  }, [initialPosts]);

  const normalizedInitialPosts = useMemo(
    () => initialPosts.map((post) => normalizePost(post)),
    [initialPosts]
  );

  const [posts, setPosts] = useState(normalizedInitialPosts);
  const [users, setUsers] = useState(initialUsers);
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(defaultTags);
  const [activity, setActivity] = useState([
    {
      id: "system-ready",
      actor: "System",
      action: "CMS workspace prepared",
      target: "Labari Blog",
      date: timestamp()
    }
  ]);
  const [activeRole, setActiveRole] = useState("Super Admin");
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedSlug, setSelectedSlug] = useState(
    normalizedInitialPosts[0]?.slug || ""
  );
  const [draft, setDraft] = useState(normalizedInitialPosts[0] || emptyPost);
  const [categoryDraft, setCategoryDraft] = useState(emptyCategory);
  const [tagDraft, setTagDraft] = useState(emptyTag);
  const [userDraft, setUserDraft] = useState(emptyUser);
  const [commentDraft, setCommentDraft] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState([]);

  useEffect(() => {
    const savedPosts = readStorage(postsStorageKey);
    const savedUsers = readStorage(usersStorageKey);
    const savedCategories = readStorage(categoriesStorageKey);
    const savedTags = readStorage(tagsStorageKey);
    const savedActivity = readStorage(activityStorageKey);

    window.requestAnimationFrame(() => {
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts).map((post) =>
          normalizePost(post)
        );
        setPosts(parsedPosts);
        setSelectedSlug(parsedPosts[0]?.slug || "");
        setDraft(parsedPosts[0] || emptyPost);
      }

      if (savedUsers) {
        setUsers(JSON.parse(savedUsers).map((user) => normalizeUser(user)));
      }

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      if (savedTags) {
        setTags(JSON.parse(savedTags));
      }

      if (savedActivity) {
        setActivity(JSON.parse(savedActivity));
      }
    });
  }, []);

  useEffect(() => {
    writeStorage(postsStorageKey, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    writeStorage(usersStorageKey, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    writeStorage(categoriesStorageKey, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    writeStorage(tagsStorageKey, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    writeStorage(activityStorageKey, JSON.stringify(activity));
  }, [activity]);

  const allowedMenuItems = roleMenuAccess[activeRole] || menuItems;

  const selectedPost = posts.find((post) => post.slug === selectedSlug);

  const stats = useMemo(
    () => ({
      total: posts.length,
      drafts: posts.filter((post) => post.status === "draft").length,
      pending: posts.filter((post) =>
        ["submitted for review", "awaiting final approval"].includes(post.status)
      ).length,
      published: posts.filter((post) => post.status === "published").length,
      scheduled: posts.filter((post) => post.status === "scheduled").length,
      archived: posts.filter((post) => post.status === "archived").length
    }),
    [posts]
  );

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesQuery = [post.title, post.description, post.authorName]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || post.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || post.category === categoryFilter;
        return matchesQuery && matchesStatus && matchesCategory;
      }),
    [categoryFilter, posts, query, statusFilter]
  );

  const reviewQueue = posts.filter((post) =>
    [
      "submitted for review",
      "changes requested",
      "approved by reviewer",
      "awaiting final approval"
    ].includes(post.status)
  );

  const analyticsStatus = process.env.NEXT_PUBLIC_GA_ID
    ? "GA4 connected"
    : "GA4 ID not configured";

  function addActivity(action, target, actor = activeRole) {
    setActivity((currentActivity) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        actor,
        action,
        target,
        date: timestamp()
      },
      ...currentActivity
    ]);
  }

  function selectPost(post) {
    setSelectedSlug(post.slug);
    setDraft(normalizePost(post));
    setActiveMenu("Create Post");
  }

  function startNewPost() {
    const author = users.find((user) => user.active) || users[0];
    setSelectedSlug("");
    setDraft({
      ...emptyPost,
      authorId: author?.id || "",
      authorName: author?.name || "",
      category: categories.find((category) => category.visible)?.name || "",
      slug: ""
    });
    setActiveMenu("Create Post");
  }

  function updateDraft(field, value) {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        [field]: value
      };

      if (field === "title" && !selectedSlug) {
        nextDraft.slug = createSlug(value);
        nextDraft.seoTitle = value;
      }

      if (field === "authorId") {
        const author = users.find((user) => user.id === value);
        nextDraft.authorName = author?.name || "";
      }

      if (field === "body") {
        nextDraft.readTime = estimateReadingTime(value);
      }

      return nextDraft;
    });
  }

  function toggleDraftTag(tagName) {
    setDraft((currentDraft) => {
      const hasTag = currentDraft.tags.includes(tagName);
      return {
        ...currentDraft,
        tags: hasTag
          ? currentDraft.tags.filter((tag) => tag !== tagName)
          : [...currentDraft.tags, tagName]
      };
    });
  }

  function savePost(event) {
    event?.preventDefault();

    const nextPost = normalizePost({
      ...draft,
      slug: draft.slug || createSlug(draft.title),
      title: draft.title || "Untitled post",
      seoTitle: draft.seoTitle || draft.title || "Untitled post",
      readTime: estimateReadingTime(draft.body || draft.description),
      revisions: [
        {
          id: `${Date.now()}`,
          date: timestamp(),
          actor: activeRole,
          summary: "Saved content revision"
        },
        ...(draft.revisions || [])
      ]
    });

    setPosts((currentPosts) => {
      const exists = currentPosts.some((post) => post.slug === selectedSlug);
      if (exists) {
        return currentPosts.map((post) =>
          post.slug === selectedSlug ? nextPost : post
        );
      }
      return [nextPost, ...currentPosts];
    });
    setSelectedSlug(nextPost.slug);
    setDraft(nextPost);
    addActivity("Saved post", nextPost.title);
  }

  function changePostStatus(status) {
    const nextPost = normalizePost({
      ...draft,
      status,
      publishedAt:
        status === "published"
          ? new Date().toISOString().slice(0, 10)
          : draft.publishedAt
    });

    setDraft(nextPost);
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.slug === selectedSlug ? nextPost : post
      )
    );
    addActivity(`Moved post to ${status}`, nextPost.title);
  }

  function addApprovalComment() {
    if (!commentDraft.trim()) return;

    const nextPost = normalizePost({
      ...draft,
      comments: [
        {
          id: `${Date.now()}`,
          actor: activeRole,
          message: commentDraft.trim(),
          date: timestamp()
        },
        ...(draft.comments || [])
      ]
    });

    setDraft(nextPost);
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.slug === selectedSlug ? nextPost : post
      )
    );
    setCommentDraft("");
    addActivity("Added approval comment", nextPost.title);
  }

  function saveCategory(event) {
    event.preventDefault();
    if (!categoryDraft.name.trim()) return;

    const nextCategory = {
      ...categoryDraft,
      id: createSlug(categoryDraft.name),
      slug: createSlug(categoryDraft.name)
    };

    setCategories((currentCategories) => {
      const exists = currentCategories.some(
        (category) => category.id === nextCategory.id
      );
      if (exists) {
        return currentCategories.map((category) =>
          category.id === nextCategory.id ? nextCategory : category
        );
      }
      return [...currentCategories, nextCategory];
    });
    setCategoryDraft(emptyCategory);
    addActivity("Saved category", nextCategory.name);
  }

  function toggleCategoryVisibility(id) {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === id
          ? { ...category, visible: !category.visible }
          : category
      )
    );
  }

  function deleteCategory(id) {
    const category = categories.find((item) => item.id === id);
    setCategories((currentCategories) =>
      currentCategories.filter((item) => item.id !== id)
    );
    addActivity("Deleted category", category?.name || id);
  }

  function saveTag(event) {
    event.preventDefault();
    if (!tagDraft.name.trim()) return;

    const nextTag = {
      id: createSlug(tagDraft.name),
      name: tagDraft.name,
      slug: createSlug(tagDraft.name)
    };

    setTags((currentTags) => {
      const exists = currentTags.some((tag) => tag.id === nextTag.id);
      if (exists) {
        return currentTags.map((tag) => (tag.id === nextTag.id ? nextTag : tag));
      }
      return [...currentTags, nextTag];
    });
    setTagDraft(emptyTag);
    addActivity("Saved tag", nextTag.name);
  }

  function deleteTag(id) {
    const tag = tags.find((item) => item.id === id);
    setTags((currentTags) => currentTags.filter((item) => item.id !== id));
    addActivity("Deleted tag", tag?.name || id);
  }

  function saveUser(event) {
    event.preventDefault();
    if (!userDraft.name.trim()) return;

    const nextUser = normalizeUser({
      ...userDraft,
      id: createSlug(userDraft.email || userDraft.name)
    });

    setUsers((currentUsers) => {
      const exists = currentUsers.some((user) => user.id === nextUser.id);
      if (exists) {
        return currentUsers.map((user) =>
          user.id === nextUser.id ? nextUser : user
        );
      }
      return [...currentUsers, nextUser];
    });
    setUserDraft(emptyUser);
    addActivity("Saved user role", nextUser.name);
  }

  function runBulkAction(action) {
    if (selectedPosts.length === 0) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        selectedPosts.includes(post.slug)
          ? {
              ...post,
              status: action
            }
          : post
      )
    );
    addActivity(`Bulk moved ${selectedPosts.length} posts to ${action}`, "Posts");
    setSelectedPosts([]);
  }

  function togglePostSelection(slug) {
    setSelectedPosts((currentSelection) =>
      currentSelection.includes(slug)
        ? currentSelection.filter((item) => item !== slug)
        : [...currentSelection, slug]
    );
  }

  function renderDashboard() {
    return (
      <div className="cms-stack">
        <div className="cms-stat-grid">
          {[
            ["Total posts", stats.total],
            ["Pending approval", stats.pending],
            ["Published", stats.published],
            ["Scheduled", stats.scheduled],
            ["Archived", stats.archived]
          ].map(([label, value]) => (
            <span key={label}>
              <strong>{value}</strong>
              {label}
            </span>
          ))}
        </div>

        <div className="cms-two-column">
          <div className="cms-panel">
            <div className="cms-panel-header">
              <h3>Review queue</h3>
              <button type="button" onClick={() => setActiveMenu("Review Queue")}>
                Open queue
              </button>
            </div>
            <div className="cms-mini-list">
              {reviewQueue.slice(0, 5).map((post) => (
                <button key={post.slug} type="button" onClick={() => selectPost(post)}>
                  <strong>{post.title}</strong>
                  <span>{post.status} - {post.authorName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cms-panel">
            <div className="cms-panel-header">
              <h3>Recent activity</h3>
              <button type="button" onClick={() => setActiveMenu("Activity Logs")}>
                View logs
              </button>
            </div>
            <ActivityList items={activity.slice(0, 6)} />
          </div>
        </div>
      </div>
    );
  }

  function renderPostTable(postsToRender = filteredPosts) {
    return (
      <div className="cms-panel">
        <div className="cms-toolbar">
          <label>
            Search posts
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, author, description..."
            />
          </label>
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="bulk-actions">
          <span>{selectedPosts.length} selected</span>
          <button type="button" onClick={() => runBulkAction("published")}>
            Publish
          </button>
          <button type="button" onClick={() => runBulkAction("archived")}>
            Archive
          </button>
          <button type="button" onClick={() => runBulkAction("draft")}>
            Restore to draft
          </button>
        </div>

        <div className="cms-table" role="table" aria-label="Blog posts">
          <div className="cms-row cms-row-head" role="row">
            <span>Post</span>
            <span>Status</span>
            <span>Author</span>
            <span>Category</span>
            <span>Updated</span>
          </div>
          {postsToRender.map((post) => (
            <div className="cms-row" key={post.slug} role="row">
              <span>
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.slug)}
                  onChange={() => togglePostSelection(post.slug)}
                  aria-label={`Select ${post.title}`}
                />
                <button type="button" onClick={() => selectPost(post)}>
                  <strong>{post.title}</strong>
                  <small>/blog/{post.slug}</small>
                </button>
              </span>
              <StatusBadge status={post.status} />
              <span>{post.authorName}</span>
              <span>{post.category}</span>
              <span>{post.publishedAt || post.scheduledAt || "Not set"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderEditor() {
    return (
      <form className="cms-editor" onSubmit={savePost}>
        <div className="editor-header">
          <div>
            <p className="eyebrow">Publishing editor</p>
            <h2>{draft.title || "Create a post"}</h2>
            <span className="autosave-note">Draft autosave uses local storage in this review build.</span>
          </div>
          <div className="editor-actions">
            <button type="button" onClick={() => changePostStatus("submitted for review")}>
              Submit
            </button>
            <button type="submit">Save</button>
            <button type="button" onClick={() => changePostStatus("published")}>
              Publish
            </button>
          </div>
        </div>

        <div className="workflow-map" aria-label="Publishing workflow">
          {[
            "draft",
            "submitted for review",
            "approved by reviewer",
            "awaiting final approval",
            "published"
          ].map((stage) => (
            <span className={draft.status === stage ? "active" : ""} key={stage}>
              {stage}
            </span>
          ))}
        </div>

        <div className="cms-editor-grid">
          <div className="cms-panel cms-stack">
            <label>
              Title
              <input
                type="text"
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                required
              />
            </label>
            <label>
              Slug
              <input
                type="text"
                value={draft.slug}
                onChange={(event) =>
                  updateDraft("slug", createSlug(event.target.value))
                }
                required
              />
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
              <textarea
                rows="14"
                value={draft.body}
                onChange={(event) => updateDraft("body", event.target.value)}
                placeholder="Write the article content here..."
              />
            </label>

            <div className="approval-comments">
              <h3>Approval comments</h3>
              <textarea
                rows="3"
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Add review feedback or approval notes..."
              />
              <button type="button" onClick={addApprovalComment}>
                Add comment
              </button>
              <ActivityList items={draft.comments || []} />
            </div>
          </div>

          <aside className="cms-panel cms-stack">
            <StatusBadge status={draft.status} />
            <label>
              Status
              <select
                value={draft.status}
                onChange={(event) => updateDraft("status", event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Author
              <select
                value={draft.authorId}
                onChange={(event) => updateDraft("authorId", event.target.value)}
              >
                <option value="">Assign author</option>
                {users
                  .filter((user) => user.active)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Category
              <select
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
              >
                {categories
                  .filter((category) => category.visible)
                  .map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Featured image
              <input
                type="url"
                value={draft.featuredImage}
                onChange={(event) =>
                  updateDraft("featuredImage", event.target.value)
                }
                placeholder="https://..."
              />
            </label>
            <label>
              Schedule date
              <input
                type="datetime-local"
                value={draft.scheduledAt}
                onChange={(event) => updateDraft("scheduledAt", event.target.value)}
              />
            </label>
            <div className="checkbox-list">
              <label>
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) =>
                    updateDraft("featured", event.target.checked)
                  }
                />
                Featured post
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.pinned}
                  onChange={(event) => updateDraft("pinned", event.target.checked)}
                />
                Pin post
              </label>
            </div>
            <label>
              SEO title
              <input
                type="text"
                value={draft.seoTitle}
                onChange={(event) => updateDraft("seoTitle", event.target.value)}
              />
            </label>
            <label>
              Meta description
              <textarea
                rows="4"
                maxLength="180"
                value={draft.description}
                onChange={(event) =>
                  updateDraft("description", event.target.value)
                }
              />
            </label>
            <div className="tag-picker">
              <span>Tags</span>
              {tags.map((tag) => (
                <button
                  className={draft.tags.includes(tag.name) ? "active" : ""}
                  key={tag.id}
                  type="button"
                  onClick={() => toggleDraftTag(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <div className="seo-preview" aria-label="Post preview">
              <span>Preview</span>
              <strong>{draft.seoTitle || draft.title || "Article title"}</strong>
              <p>{draft.description || "Meta description appears here."}</p>
              <code>/blog/{draft.slug || "article-slug"}</code>
              <small>{draft.readTime || "1 min read"}</small>
            </div>
            <div className="revision-list">
              <h3>Revision history</h3>
              <ActivityList items={(draft.revisions || []).slice(0, 5)} />
            </div>
          </aside>
        </div>
      </form>
    );
  }

  function renderCategories() {
    return (
      <div className="cms-two-column">
        <form className="cms-panel cms-stack" onSubmit={saveCategory}>
          <h3>Create or edit category</h3>
          <label>
            Category name
            <input
              type="text"
              value={categoryDraft.name}
              onChange={(event) =>
                setCategoryDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value
                }))
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={categoryDraft.description}
              onChange={(event) =>
                setCategoryDraft((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value
                }))
              }
            />
          </label>
          <label className="inline-check">
            <input
              type="checkbox"
              checked={categoryDraft.visible}
              onChange={(event) =>
                setCategoryDraft((currentDraft) => ({
                  ...currentDraft,
                  visible: event.target.checked
                }))
              }
            />
            Visible on public blog
          </label>
          <button type="submit">Save category</button>
        </form>

        <div className="cms-panel">
          <h3>Categories</h3>
          <div className="taxonomy-list">
            {categories.map((category) => (
              <div key={category.id}>
                <span>
                  <strong>{category.name}</strong>
                  {posts.filter((post) => post.category === category.name).length} posts
                </span>
                <button type="button" onClick={() => setCategoryDraft(category)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleCategoryVisibility(category.id)}
                >
                  {category.visible ? "Disable" : "Enable"}
                </button>
                <button type="button" onClick={() => deleteCategory(category.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderTags() {
    return (
      <div className="cms-two-column">
        <form className="cms-panel cms-stack" onSubmit={saveTag}>
          <h3>Create tag</h3>
          <label>
            Tag name
            <input
              type="text"
              value={tagDraft.name}
              onChange={(event) => setTagDraft({ name: event.target.value })}
            />
          </label>
          <button type="submit">Save tag</button>
        </form>

        <div className="cms-panel">
          <h3>Tags</h3>
          <div className="tag-admin-list">
            {tags.map((tag) => (
              <span key={tag.id}>
                {tag.name}
                <button type="button" onClick={() => deleteTag(tag.id)}>
                  Remove
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderUsers() {
    return (
      <div className="cms-two-column">
        <form className="cms-panel cms-stack" onSubmit={saveUser}>
          <h3>Add user or contributor</h3>
          <label>
            Name
            <input
              type="text"
              value={userDraft.name}
              onChange={(event) =>
                setUserDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value
                }))
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={userDraft.email}
              onChange={(event) =>
                setUserDraft((currentDraft) => ({
                  ...currentDraft,
                  email: event.target.value
                }))
              }
            />
          </label>
          <label>
            Role
            <select
              value={userDraft.role}
              onChange={(event) =>
                setUserDraft((currentDraft) => ({
                  ...currentDraft,
                  role: event.target.value
                }))
              }
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label>
            Profile bio
            <textarea
              rows="4"
              value={userDraft.bio}
              onChange={(event) =>
                setUserDraft((currentDraft) => ({
                  ...currentDraft,
                  bio: event.target.value
                }))
              }
            />
          </label>
          <button type="submit">Save user</button>
        </form>

        <div className="cms-panel">
          <h3>Authors and contributors</h3>
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id}>
                <span>
                  <strong>{user.name}</strong>
                  {user.email}
                </span>
                <StatusBadge status={user.role} />
                <button type="button" onClick={() => setUserDraft(user)}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderWorkflow() {
    const lanes = [
      "draft",
      "submitted for review",
      "changes requested",
      "approved by reviewer",
      "awaiting final approval",
      "scheduled",
      "published",
      "rejected"
    ];

    return (
      <div className="cms-stack">
        <div className="workflow-board">
          {lanes.map((lane) => (
            <div key={lane}>
              <h3>{lane}</h3>
              {posts
                .filter((post) => post.status === lane)
                .slice(0, 4)
                .map((post) => (
                  <button key={post.slug} type="button" onClick={() => selectPost(post)}>
                    <strong>{post.title}</strong>
                    <span>{post.authorName}</span>
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div className="cms-panel">
          <h3>Recent approval activity</h3>
          <ActivityList items={activity.slice(0, 10)} />
        </div>
      </div>
    );
  }

  function renderAnalytics() {
    return (
      <div className="cms-stack">
        <div className="analytics-header">
          <div>
            <p className="eyebrow">Analytics</p>
            <h3>Publishing and traffic summary</h3>
            <p>
              The component is ready for GA4. Live page views, referrers, and
              engagement can be attached through the platform analytics API.
            </p>
          </div>
          <span>{analyticsStatus}</span>
        </div>
        <div className="analytics-grid">
          <span>
            <strong>{stats.published}</strong>
            Published posts
            <small>Content currently visible on the public blog.</small>
          </span>
          <span>
            <strong>{posts.filter((post) => post.featured).length}</strong>
            Featured posts
            <small>Posts marked for stronger placement.</small>
          </span>
          <span>
            <strong>{posts.filter((post) => post.pinned).length}</strong>
            Pinned posts
            <small>Priority posts for top placement.</small>
          </span>
          <span>
            <strong>{posts.filter((post) => post.description).length}</strong>
            SEO-ready
            <small>Posts with meta descriptions.</small>
          </span>
        </div>
        <div className="analytics-table">
          <h4>Post analytics placeholders</h4>
          {posts
            .filter((post) => post.status === "published")
            .map((post, index) => (
              <div key={post.slug}>
                <span>
                  <strong>{post.title}</strong>
                  {post.category} - {post.readTime}
                </span>
                <code>
                  {420 + index * 137} views / {12 + index * 4} shares
                </code>
              </div>
            ))}
        </div>
      </div>
    );
  }

  function renderMediaLibrary() {
    return (
      <div className="cms-panel cms-stack">
        <div className="cms-panel-header">
          <h3>Media library</h3>
          <button type="button">Upload image</button>
        </div>
        <div className="media-grid">
          {posts.map((post) => (
            <span className={`image-placeholder tone-${post.imageTone || "green"}`} key={post.slug}>
              {post.featuredImage ? "Image URL set" : post.category}
            </span>
          ))}
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="cms-panel cms-stack">
        <h3>Publishing settings</h3>
        <label>
          Default final approvers
          <input value="Head of Social, Final Approver" readOnly />
        </label>
        <label>
          Default public URL
          <input value="https://www.labaribooks.com/blog" readOnly />
        </label>
        <label className="inline-check">
          <input type="checkbox" defaultChecked />
          Require final approval before publishing
        </label>
        <label className="inline-check">
          <input type="checkbox" defaultChecked />
          Notify approvers when a post is submitted
        </label>
      </div>
    );
  }

  function renderActiveMenu() {
    if (!canUseMenu(activeRole, activeMenu)) {
      return (
        <div className="cms-panel empty-state">
          <h2>Restricted view</h2>
          <p>This role does not have permission to open this section.</p>
        </div>
      );
    }

    if (activeMenu === "Dashboard") return renderDashboard();
    if (activeMenu === "Blog Posts") return renderPostTable();
    if (activeMenu === "Create Post") return renderEditor();
    if (activeMenu === "Categories") return renderCategories();
    if (activeMenu === "Tags") return renderTags();
    if (activeMenu === "Authors / Contributors") return renderUsers();
    if (activeMenu === "Review Queue") return renderPostTable(reviewQueue);
    if (activeMenu === "Approval Workflow") return renderWorkflow();
    if (activeMenu === "Published Posts") {
      return renderPostTable(posts.filter((post) => post.status === "published"));
    }
    if (activeMenu === "Scheduled Posts") {
      return renderPostTable(posts.filter((post) => post.status === "scheduled"));
    }
    if (activeMenu === "Media Library") return renderMediaLibrary();
    if (activeMenu === "Comments / Feedback") {
      return (
        <div className="cms-panel">
          <h3>Approval comments</h3>
          <ActivityList
            items={posts.flatMap((post) =>
              (post.comments || []).map((comment) => ({
                ...comment,
                target: post.title,
                action: comment.message
              }))
            )}
          />
        </div>
      );
    }
    if (activeMenu === "Analytics") return renderAnalytics();
    if (activeMenu === "User Roles & Permissions") return renderUsers();
    if (activeMenu === "Settings") return renderSettings();
    if (activeMenu === "Activity Logs") {
      return (
        <div className="cms-panel">
          <h3>Activity logs</h3>
          <ActivityList items={activity} />
        </div>
      );
    }

    return null;
  }

  return (
    <section className="container cms-shell">
      <aside className="cms-sidebar" aria-label="Blog administration">
        <div className="cms-sidebar-header">
          <h2>Labari CMS</h2>
          <button type="button" onClick={startNewPost}>
            New post
          </button>
        </div>
        <nav className="cms-menu" aria-label="Admin menu">
          {menuItems.map((menu) => (
            <button
              className={activeMenu === menu ? "active" : ""}
              disabled={!canUseMenu(activeRole, menu)}
              key={menu}
              type="button"
              onClick={() => setActiveMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </nav>
      </aside>

      <div className="cms-main">
        <div className="cms-topbar">
          <div>
            <p className="eyebrow">Admin system</p>
            <h2>{activeMenu}</h2>
          </div>
          <label>
            Preview role
            <select
              value={activeRole}
              onChange={(event) => {
                setActiveRole(event.target.value);
                if (!canUseMenu(event.target.value, activeMenu)) {
                  setActiveMenu("Dashboard");
                }
              }}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>
        {renderActiveMenu()}
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${createSlug(status)}`}>{status}</span>;
}

function ActivityList({ items }) {
  if (!items || items.length === 0) {
    return <p className="muted-copy">No activity yet.</p>;
  }

  return (
    <div className="activity-list">
      {items.map((item) => (
        <span key={item.id || `${item.date}-${item.action}`}>
          <strong>{item.action || item.message || item.summary}</strong>
          {item.target ? <small>{item.target}</small> : null}
          <small>
            {item.actor} - {item.date}
          </small>
        </span>
      ))}
    </div>
  );
}
