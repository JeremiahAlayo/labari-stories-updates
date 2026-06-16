"use client";

import { useEffect, useMemo, useState } from "react";
import { createSlug } from "@/utils/slug";

const storageKey = "labari-blog-admin-posts";

const emptyPost = {
  title: "",
  slug: "",
  description: "",
  category: "General Articles",
  status: "draft",
  date: "",
  readTime: "3 min read"
};

export default function AdminDashboard({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState(initialPosts[0]?.slug || "");
  const [draft, setDraft] = useState(initialPosts[0] || emptyPost);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(storageKey);

    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
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

  const categoryOptions = useMemo(
    () => [
      "Platform Updates",
      "User Guides",
      "Tutorials",
      "Announcements",
      "General Articles"
    ],
    []
  );

  function selectPost(post) {
    setSelectedSlug(post.slug);
    setDraft(post);
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

  function saveDraft(event) {
    event.preventDefault();

    const nextPost = {
      ...draft,
      slug: draft.slug || createSlug(draft.title),
      date: draft.date || new Date().toISOString().slice(0, 10),
      content: draft.content || [
        {
          heading: "Draft section",
          paragraphs: [
            "Replace this placeholder content with the final article body."
          ]
        }
      ],
      imageTone: draft.imageTone || "green"
    };

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
          <h2>Posts</h2>
          <button type="button" onClick={startNewPost}>
            New post
          </button>
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
              <span>{post.status}</span>
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
            onChange={(event) => updateDraft("slug", createSlug(event.target.value))}
            required
          />
        </label>

        <label>
          Short description
          <textarea
            rows="4"
            value={draft.description}
            onChange={(event) => updateDraft("description", event.target.value)}
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

        <button className="primary-button" type="submit">
          Save post
        </button>
      </form>
    </section>
  );
}
