"use client";

import { useMemo, useState } from "react";

import { getPostStatus } from "@/components/admin/AdminSections";

const publishingRoles = [
  {
    id: "author",
    name: "Author",
    note: "Can create and save drafts until publishing access is assigned."
  },
  {
    id: "assigned-author",
    name: "Assigned Author",
    note: "Can publish posts assigned to them without seeking approval."
  },
  {
    id: "super-admin",
    name: "Super Admin",
    note: "Can publish directly and assign publishing access to authors."
  }
];

const statusNotes = {
  draft: "The author is still preparing this post.",
  assigned: "This post has direct publishing access assigned.",
  published: "Visible on the public blog.",
  archived: "Hidden from the public blog."
};

function canAssign(roleId) {
  return roleId === "super-admin";
}

function canPublish(roleId, post) {
  return roleId === "super-admin" || (roleId === "assigned-author" && post.assigned);
}

function canDraft(roleId) {
  return ["author", "super-admin"].includes(roleId);
}

function getSeedPost(post) {
  return {
    slug: post.slug,
    title: post.title,
    authorName: post.authorName,
    category: post.category,
    assigned: Boolean(post.canPublishDirectly),
    status: getPostStatus(post),
    comments: []
  };
}

export default function ApprovalSimulator({ posts }) {
  const seedPosts = useMemo(() => posts.slice(0, 4).map(getSeedPost), [posts]);
  const [roleId, setRoleId] = useState("super-admin");
  const [demoPosts, setDemoPosts] = useState(seedPosts);
  const [selectedSlug, setSelectedSlug] = useState(seedPosts[0]?.slug || "");
  const [comment, setComment] = useState("");

  const selectedPost =
    demoPosts.find((post) => post.slug === selectedSlug) || demoPosts[0];
  const selectedRole = publishingRoles.find((role) => role.id === roleId);

  function updateSelected(status, fallbackComment, assigned = selectedPost.assigned) {
    const nextComment = comment.trim() || fallbackComment;

    setDemoPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.slug === selectedPost.slug
          ? {
              ...post,
              assigned,
              status,
              comments: [
                {
                  body: nextComment,
                  role: selectedRole.name,
                  status
                },
                ...post.comments
              ]
            }
          : post
      )
    );
    setComment("");
  }

  if (!selectedPost) {
    return null;
  }

  return (
    <section className="cms-panel approval-simulator">
      <div className="cms-panel-header">
        <div>
          <h3>Publishing access test</h3>
          <p className="muted-copy">
            Test the simple access model: Super Admin publishes directly and can
            assign an author to publish without approval.
          </p>
        </div>
        <button type="button" onClick={() => setDemoPosts(seedPosts)}>
          Reset demo
        </button>
      </div>

      <div className="approval-demo-grid">
        <div className="cms-stack">
          <label>
            Test as
            <select value={roleId} onChange={(event) => setRoleId(event.target.value)}>
              {publishingRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <p className="muted-copy">{selectedRole.note}</p>

          <div className="approval-post-list">
            {demoPosts.map((post) => (
              <button
                className={post.slug === selectedPost.slug ? "active" : ""}
                key={post.slug}
                type="button"
                onClick={() => setSelectedSlug(post.slug)}
              >
                <strong>{post.title}</strong>
                <span>{post.authorName}</span>
                <em>{post.assigned ? "assigned author access" : post.status}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="cms-stack">
          <div>
            <span className={`status-badge status-${selectedPost.status.replaceAll(" ", "-")}`}>
              {selectedPost.assigned ? "assigned access" : selectedPost.status}
            </span>
            <h3>{selectedPost.title}</h3>
            <p className="muted-copy">
              {statusNotes[selectedPost.status] || "Current workflow status."}
            </p>
          </div>

          <label>
            Publishing note
            <textarea
              placeholder="Add an internal note for this post..."
              rows="4"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>

          <div className="approval-actions">
            <button
              disabled={!canDraft(roleId)}
              type="button"
              onClick={() => updateSelected("draft", "Saved as draft.", false)}
            >
              Save draft
            </button>
            <button
              disabled={!canAssign(roleId)}
              type="button"
              onClick={() => updateSelected("assigned", "Publishing access assigned.", true)}
            >
              Assign access
            </button>
            <button
              disabled={!canAssign(roleId)}
              type="button"
              onClick={() => updateSelected("draft", "Publishing access removed.", false)}
            >
              Remove access
            </button>
            <button
              disabled={!canPublish(roleId, selectedPost)}
              type="button"
              onClick={() => updateSelected("published", "Published directly.")}
            >
              Publish
            </button>
          </div>

          <div className="activity-list">
            {selectedPost.comments.length ? (
              selectedPost.comments.map((entry, index) => (
                <span key={`${entry.status}-${index}`}>
                  <strong>{entry.status}</strong>
                  <small>{entry.body}</small>
                  <small>{entry.role}</small>
                </span>
              ))
            ) : (
              <span>
                <strong>No publishing notes yet</strong>
                <small>Run an action above to test publishing access.</small>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
