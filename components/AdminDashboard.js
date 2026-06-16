"use client";

import { useEffect, useMemo, useState } from "react";
import { createSlug } from "@/utils/slug";

const storageKey = "labari-blog-admin-posts-v2";

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

const toneOptions = ["green", "blue", "amber", "violet", "slate"];

const emptyPost = {
  title: "",
  slug: "",
  description: "",
  category: "Reading Guides",
  platformArea: "Library",
  audience: "All readers",
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

export default function AdminDashboard({ initialPosts }) {
  const normalizedInitialPosts = useMemo(
    () => initialPosts.map((post) => normalizePost(post)),
    [initialPosts]
  );
  const [posts, setPosts] = useState(normalizedInitialPosts);
  const [selectedSlug, setSelectedSlug] = useState(
    normalizedInitialPosts[0]?.slug || ""
  );
  const [draft, setDraft] = useState(normalizedInitialPosts[0] || emptyPost);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(storageKey);

    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((post) =>
        normalizePost(post)
      );
      window.requestAnimationFrame(() => {
        setPosts(parsedPosts);
        setSelectedSlug(parsedPosts[0]?.slug || "");
        setDraft(parsedPosts[0] || emptyPost);
      });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(posts));
  }, [posts]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      drafts: posts.filter((post) => post.status === "draft").length
    }),
    [posts]
  );

  function selectPost(post) {
    setSelectedSlug(post.slug);
    setDraft(normalizePost(post));
  }

  function updateDraft(field, value) {
    const nextDraft = {
      ...draft,
      [field]: value
    };

    if (field === "title" && !selectedSlug) {
      nextDraft.slug = createSlug(value);
    }

    setDraft(nextDraft);
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

    const nextPost = normalizePost({
      ...draft,
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
            <h2>Posts</h2>
            <p>
              {stats.published} published, {stats.drafts} draft
            </p>
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
            <strong>{stats.drafts}</strong>
            Drafts
          </span>
        </div>
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
                {post.status} · {post.platformArea}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <form className="admin-editor" onSubmit={saveDraft}>
        <div className="editor-header">
          <div>
            <p className="eyebrow">Post Editor</p>
            <h2>{selectedSlug ? "Edit post" : "Create post"}</h2>
          </div>
          {selectedSlug ? (
            <button className="danger-button" type="button" onClick={deletePost}>
              Delete
            </button>
          ) : null}
        </div>

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
            onChange={(event) => updateDraft("description", event.target.value)}
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
            Status
            <select
              value={draft.status}
              onChange={(event) => updateDraft("status", event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Publish date
            <input
              type="date"
              value={draft.date}
              onChange={(event) => updateDraft("date", event.target.value)}
            />
          </label>

          <label>
            Read time
            <input
              type="text"
              value={draft.readTime}
              onChange={(event) => updateDraft("readTime", event.target.value)}
            />
          </label>
        </div>

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
                      updateSection(sectionIndex, "heading", event.target.value)
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
