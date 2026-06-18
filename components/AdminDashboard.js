"use client";

import { useEffect, useMemo, useState } from "react";
import { createSlug } from "@/utils/slug";

const postsStorageKey = "labari-blog-admin-posts-v4";
const authorsStorageKey = "labari-blog-authors-v1";

const categoryOptions = [
  "Announcements",
  "Platform Updates",
  "Reading Guides",
  "Feature Guides",
  "Book Discovery",
  "Author Spotlights",
  "User Support"
];

const platformAreaOptions = [
  "Home",
  "Browse",
  "Dashboard",
  "Library",
  "Book Pages",
  "Authors",
  "Account & Billing",
  "Recommendations"
];

const audienceOptions = [
  "All readers",
  "New readers",
  "Returning readers",
  "Parents and families",
  "Authors",
  "Editorial team"
];

const approvalOptions = ["draft", "submitted", "needs changes", "approved"];
const toneOptions = ["green", "blue", "amber", "violet", "slate"];
const panels = ["Content", "Workflow", "Analytics", "Body", "Authors"];

const emptyAuthor = {
  name: "",
  role: "Contributor",
  bio: ""
};

const emptyPost = {
  title: "",
  slug: "",
  description: "",
  category: "Reading Guides",
  platformArea: "Library",
  audience: "All readers",
  authorId: "labari-editorial",
  authorName: "Labari Editorial",
  submittedBy: "Social Media Team",
  approvalStatus: "draft",
  finalApprover: "Head of Social Media",
  reviewerNotes: "",
  socialChannel: "Website",
  socialCopy: "",
  status: "draft",
  date: "",
  readTime: "3 min read",
  imageTone: "green",
  content: [
    {
      heading: "",
      paragraphs: [""]
    }
  ]
};

function normalizePost(post) {
  return {
    ...emptyPost,
    ...post,
    content:
      post.content?.length > 0
        ? post.content.map((section) => ({
            heading: section.heading || "",
            paragraphs:
              section.paragraphs?.length > 0 ? section.paragraphs : [""]
          }))
        : emptyPost.content
  };
}

function normalizeAuthor(author) {
  return {
    id: author.id || createSlug(author.name),
    name: author.name,
    role: author.role || "Contributor",
    bio: author.bio || ""
  };
}

export default function AdminDashboard({ initialPosts, initialAuthors }) {
  const normalizedInitialPosts = useMemo(
    () => initialPosts.map((post) => normalizePost(post)),
    [initialPosts]
  );
  const normalizedInitialAuthors = useMemo(
    () => initialAuthors.map((author) => normalizeAuthor(author)),
    [initialAuthors]
  );

  const [posts, setPosts] = useState(normalizedInitialPosts);
  const [authors, setAuthors] = useState(normalizedInitialAuthors);
  const [authorDraft, setAuthorDraft] = useState(emptyAuthor);
  const [activePanel, setActivePanel] = useState("Content");
  const [selectedSlug, setSelectedSlug] = useState(
    normalizedInitialPosts[0]?.slug || ""
  );
  const [draft, setDraft] = useState(normalizedInitialPosts[0] || emptyPost);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(postsStorageKey);
    const savedAuthors = window.localStorage.getItem(authorsStorageKey);

    window.requestAnimationFrame(() => {
      if (savedAuthors) {
        setAuthors(
          JSON.parse(savedAuthors).map((author) => normalizeAuthor(author))
        );
      }

      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts).map((post) =>
          normalizePost(post)
        );
        setPosts(parsedPosts);
        setSelectedSlug(parsedPosts[0]?.slug || "");
        setDraft(parsedPosts[0] || emptyPost);
      }
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(postsStorageKey, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.localStorage.setItem(authorsStorageKey, JSON.stringify(authors));
  }, [authors]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      awaitingApproval: posts.filter(
        (post) => post.approvalStatus === "submitted"
      ).length,
      needsChanges: posts.filter((post) => post.approvalStatus === "needs changes")
        .length
    }),
    [posts]
  );

  const analyticsStatus = process.env.NEXT_PUBLIC_GA_ID
    ? "GA4 connected"
    : "GA4 ID not configured";

  const analyticsCards = useMemo(
    () => [
      {
        label: "Published posts",
        value: stats.published,
        hint: "Visible public articles"
      },
      {
        label: "Pending review",
        value: stats.awaitingApproval,
        hint: "Waiting for final approval"
      },
      {
        label: "SEO-ready",
        value: posts.filter(
          (post) => post.title && post.slug && post.description
        ).length,
        hint: "Title, slug, and meta description set"
      },
      {
        label: "Social-ready",
        value: posts.filter((post) => post.socialCopy && post.socialChannel)
          .length,
        hint: "Caption and channel prepared"
      }
    ],
    [posts, stats]
  );

  const publishedPosts = posts.filter((post) => post.status === "published");

  const reviewQueue = posts.filter(
    (post) =>
      post.approvalStatus === "submitted" ||
      post.approvalStatus === "needs changes"
  );

  function selectPost(post) {
    setSelectedSlug(post.slug);
    setDraft(normalizePost(post));
    setActivePanel("Content");
  }

  function updateDraft(field, value) {
    const nextDraft = {
      ...draft,
      [field]: value
    };

    if (field === "title" && !selectedSlug) {
      nextDraft.slug = createSlug(value);
    }

    if (field === "authorId") {
      const author = authors.find((item) => item.id === value);
      nextDraft.authorName = author?.name || "";
    }

    if (field === "approvalStatus" && value !== "approved") {
      nextDraft.status = "draft";
    }

    setDraft(nextDraft);
  }

  function updateAuthorDraft(field, value) {
    setAuthorDraft((currentAuthor) => ({
      ...currentAuthor,
      [field]: value
    }));
  }

  function addAuthor(event) {
    event.preventDefault();

    const nextAuthor = normalizeAuthor({
      ...authorDraft,
      id: createSlug(authorDraft.name)
    });

    if (!nextAuthor.name) return;

    setAuthors((currentAuthors) => {
      const exists = currentAuthors.some((author) => author.id === nextAuthor.id);
      if (exists) {
        return currentAuthors.map((author) =>
          author.id === nextAuthor.id ? nextAuthor : author
        );
      }
      return [...currentAuthors, nextAuthor];
    });
    setAuthorDraft(emptyAuthor);
  }

  function updateSection(sectionIndex, field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content: currentDraft.content.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    }));
  }

  function updateParagraph(sectionIndex, paragraphIndex, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content: currentDraft.content.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              paragraphs: section.paragraphs.map((paragraph, innerIndex) =>
                innerIndex === paragraphIndex ? value : paragraph
              )
            }
          : section
      )
    }));
  }

  function addSection() {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content: [
        ...currentDraft.content,
        {
          heading: "",
          paragraphs: [""]
        }
      ]
    }));
  }

  function removeSection(sectionIndex) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content:
        currentDraft.content.length > 1
          ? currentDraft.content.filter((section, index) => index !== sectionIndex)
          : currentDraft.content
    }));
  }

  function addParagraph(sectionIndex) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content: currentDraft.content.map((section, index) =>
        index === sectionIndex
          ? { ...section, paragraphs: [...section.paragraphs, ""] }
          : section
      )
    }));
  }

  function removeParagraph(sectionIndex, paragraphIndex) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      content: currentDraft.content.map((section, index) =>
        index === sectionIndex && section.paragraphs.length > 1
          ? {
              ...section,
              paragraphs: section.paragraphs.filter(
                (paragraph, innerIndex) => innerIndex !== paragraphIndex
              )
            }
          : section
      )
    }));
  }

  function saveDraft(event) {
    event.preventDefault();

    const selectedAuthor = authors.find((author) => author.id === draft.authorId);
    const nextPost = normalizePost({
      ...draft,
      authorName: selectedAuthor?.name || draft.authorName,
      slug: draft.slug || createSlug(draft.title),
      date: draft.date || new Date().toISOString().slice(0, 10),
      content: draft.content.map((section) => ({
        heading: section.heading || "Article section",
        paragraphs: section.paragraphs
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
      }))
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
  }

  function startNewPost() {
    setSelectedSlug("");
    setDraft(emptyPost);
    setActivePanel("Content");
  }

  function deletePost() {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.slug !== selectedSlug)
    );
    setSelectedSlug("");
    setDraft(emptyPost);
  }

  return (
    <section className="container admin-grid">
      <aside className="admin-list" aria-label="Blog post list">
        <div className="admin-list-header">
          <div>
            <h2>Blog Control</h2>
            <p>Draft, review, approve, and publish Labari articles.</p>
          </div>
          <button type="button" onClick={startNewPost}>
            New post
          </button>
        </div>

        <div className="admin-stats" aria-label="Editorial summary">
          <span>
            <strong>{stats.total}</strong>
            Total
          </span>
          <span>
            <strong>{stats.published}</strong>
            Live
          </span>
          <span>
            <strong>{stats.awaitingApproval}</strong>
            Review
          </span>
        </div>

        <div className="admin-guide">
          <strong>Simple workflow</strong>
          <ol>
            <li>Social team writes the draft.</li>
            <li>Submit for review.</li>
            <li>Head of Social approves.</li>
            <li>Publish after approval.</li>
          </ol>
        </div>

        {reviewQueue.length > 0 ? (
          <div className="review-queue">
            <h3>Needs Attention</h3>
            {reviewQueue.map((post) => (
              <button key={post.slug} type="button" onClick={() => selectPost(post)}>
                <strong>{post.title}</strong>
                <span>{post.approvalStatus}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="admin-post-list">
          {posts.map((post) => (
            <button
              className={selectedSlug === post.slug ? "selected" : ""}
              key={post.slug}
              type="button"
              onClick={() => selectPost(post)}
            >
              <strong>{post.title}</strong>
              <span>
                {post.status} - {post.approvalStatus} - {post.authorName}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <form className="admin-editor" onSubmit={saveDraft}>
        <div className="editor-header">
          <div>
            <p className="eyebrow">Selected Post</p>
            <h2>{draft.title || "Create post"}</h2>
          </div>
          {selectedSlug ? (
            <button className="danger-button" type="button" onClick={deletePost}>
              Delete
            </button>
          ) : null}
        </div>

        <div className="workflow-strip" aria-label="Editorial workflow">
          <span className={draft.approvalStatus === "draft" ? "active" : ""}>
            Draft
          </span>
          <span className={draft.approvalStatus === "submitted" ? "active" : ""}>
            Social submit
          </span>
          <span className={draft.approvalStatus === "needs changes" ? "active" : ""}>
            Changes
          </span>
          <span className={draft.approvalStatus === "approved" ? "active" : ""}>
            Final approval
          </span>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Editor sections">
          {panels.map((panel) => (
            <button
              aria-selected={activePanel === panel}
              className={activePanel === panel ? "active" : ""}
              key={panel}
              onClick={() => setActivePanel(panel)}
              role="tab"
              type="button"
            >
              {panel}
            </button>
          ))}
        </div>

        {activePanel === "Content" ? (
          <div className="admin-panel" role="tabpanel">
            <div className="form-row">
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
            </div>

            <label>
              SEO description
              <textarea
                rows="3"
                value={draft.description}
                onChange={(event) =>
                  updateDraft("description", event.target.value)
                }
                maxLength="180"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={draft.category}
                  onChange={(event) => updateDraft("category", event.target.value)}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Platform area
                <select
                  value={draft.platformArea}
                  onChange={(event) =>
                    updateDraft("platformArea", event.target.value)
                  }
                >
                  {platformAreaOptions.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Audience
                <select
                  value={draft.audience}
                  onChange={(event) => updateDraft("audience", event.target.value)}
                >
                  {audienceOptions.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Visual tone
                <select
                  value={draft.imageTone}
                  onChange={(event) => updateDraft("imageTone", event.target.value)}
                >
                  {toneOptions.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : null}

        {activePanel === "Workflow" ? (
          <div className="admin-panel" role="tabpanel">
            <div className="form-row">
              <label>
                Author
                <select
                  value={draft.authorId}
                  onChange={(event) => updateDraft("authorId", event.target.value)}
                >
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Submitted by
                <input
                  type="text"
                  value={draft.submittedBy}
                  onChange={(event) =>
                    updateDraft("submittedBy", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Approval status
                <select
                  value={draft.approvalStatus}
                  onChange={(event) =>
                    updateDraft("approvalStatus", event.target.value)
                  }
                >
                  {approvalOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Final approver
                <input
                  type="text"
                  value={draft.finalApprover}
                  onChange={(event) =>
                    updateDraft("finalApprover", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Public status
                <select
                  value={draft.status}
                  onChange={(event) => updateDraft("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label>
                Publish date
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => updateDraft("date", event.target.value)}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Read time
                <input
                  type="text"
                  value={draft.readTime}
                  onChange={(event) => updateDraft("readTime", event.target.value)}
                />
              </label>

              <label>
                Social channels
                <input
                  type="text"
                  value={draft.socialChannel}
                  onChange={(event) =>
                    updateDraft("socialChannel", event.target.value)
                  }
                />
              </label>
            </div>

            <label>
              Social caption
              <textarea
                rows="3"
                value={draft.socialCopy}
                onChange={(event) => updateDraft("socialCopy", event.target.value)}
              />
            </label>

            <label>
              Reviewer notes
              <textarea
                rows="3"
                value={draft.reviewerNotes}
                onChange={(event) =>
                  updateDraft("reviewerNotes", event.target.value)
                }
              />
            </label>
          </div>
        ) : null}

        {activePanel === "Analytics" ? (
          <div className="admin-panel" role="tabpanel">
            <div className="analytics-header">
              <div>
                <p className="eyebrow">Analytics</p>
                <h3>Publishing and traffic snapshot</h3>
                <p>
                  Track article readiness here. Live page views, top sources,
                  and engagement can appear after the GA4 measurement ID is set.
                </p>
              </div>
              <span>{analyticsStatus}</span>
            </div>

            <div className="analytics-grid">
              {analyticsCards.map((card) => (
                <span key={card.label}>
                  <strong>{card.value}</strong>
                  {card.label}
                  <small>{card.hint}</small>
                </span>
              ))}
            </div>

            <div className="analytics-table">
              <h4>Article tracking</h4>
              {publishedPosts.map((post) => (
                <div key={post.slug}>
                  <span>
                    <strong>{post.title}</strong>
                    {post.category} - {post.platformArea}
                  </span>
                  <code>/blog/{post.slug}</code>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === "Body" ? (
          <div className="admin-panel" role="tabpanel">
            <div className="content-builder">
              <div className="content-builder-header">
                <div>
                  <p className="eyebrow">Article Body</p>
                  <h3>Sections and paragraphs</h3>
                </div>
                <button type="button" onClick={addSection}>
                  Add section
                </button>
              </div>

              {draft.content.map((section, sectionIndex) => (
                <div className="content-section" key={`section-${sectionIndex}`}>
                  <div className="section-header">
                    <label>
                      Section heading
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(event) =>
                          updateSection(
                            sectionIndex,
                            "heading",
                            event.target.value
                          )
                        }
                      />
                    </label>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="paragraph-list">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <label key={`paragraph-${sectionIndex}-${paragraphIndex}`}>
                        Paragraph {paragraphIndex + 1}
                        <textarea
                          rows="4"
                          value={paragraph}
                          onChange={(event) =>
                            updateParagraph(
                              sectionIndex,
                              paragraphIndex,
                              event.target.value
                            )
                          }
                        />
                        <button
                          className="small-button"
                          type="button"
                          onClick={() =>
                            removeParagraph(sectionIndex, paragraphIndex)
                          }
                        >
                          Remove paragraph
                        </button>
                      </label>
                    ))}
                  </div>

                  <button
                    className="small-button"
                    type="button"
                    onClick={() => addParagraph(sectionIndex)}
                  >
                    Add paragraph
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === "Authors" ? (
          <div className="admin-panel" role="tabpanel">
            <div className="author-manager inline">
              <h3>Authors</h3>
              <div className="author-list">
                {authors.map((author) => (
                  <span key={author.id}>
                    <strong>{author.name}</strong>
                    {author.role}
                  </span>
                ))}
              </div>
              <label>
                Author name
                <input
                  type="text"
                  value={authorDraft.name}
                  onChange={(event) =>
                    updateAuthorDraft("name", event.target.value)
                  }
                />
              </label>
              <label>
                Role
                <input
                  type="text"
                  value={authorDraft.role}
                  onChange={(event) =>
                    updateAuthorDraft("role", event.target.value)
                  }
                />
              </label>
              <label>
                Bio
                <textarea
                  rows="3"
                  value={authorDraft.bio}
                  onChange={(event) =>
                    updateAuthorDraft("bio", event.target.value)
                  }
                />
              </label>
              <button type="button" onClick={addAuthor}>
                Add author
              </button>
            </div>
          </div>
        ) : null}

        <div className="seo-preview" aria-label="Search preview">
          <span>Search preview</span>
          <strong>{draft.title || "Article title"}</strong>
          <p>{draft.description || "Article description will appear here."}</p>
          <code>/blog/{draft.slug || "article-slug"}</code>
        </div>

        <button className="primary-button" type="submit">
          Save post
        </button>
      </form>
    </section>
  );
}
