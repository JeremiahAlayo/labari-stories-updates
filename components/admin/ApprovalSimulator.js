"use client";

import { useMemo, useState } from "react";

import { getPostStatus } from "@/components/admin/AdminSections";

const approvalRoles = [
  {
    id: "author",
    name: "Author",
    note: "Can draft content and submit posts for review."
  },
  {
    id: "reviewer",
    name: "Head of Social",
    note: "Can approve, reject, or request changes."
  },
  {
    id: "final-approver",
    name: "Final Approver",
    note: "Can publish content after review approval."
  },
  {
    id: "super-admin",
    name: "Super Admin",
    note: "Can test every publishing action."
  }
];

const statusNotes = {
  draft: "The author is still preparing this post.",
  "submitted for review": "Waiting for the Head of Social to review.",
  "changes requested": "Returned to the author with feedback.",
  "approved by reviewer": "Passed first review and is ready for final approval.",
  published: "Visible on the public blog.",
  rejected: "Stopped by the review team."
};

function canReview(roleId) {
  return ["reviewer", "super-admin"].includes(roleId);
}

function canPublish(roleId) {
  return ["final-approver", "super-admin"].includes(roleId);
}

function canSubmit(roleId) {
  return ["author", "super-admin"].includes(roleId);
}

function getSeedPost(post) {
  return {
    slug: post.slug,
    title: post.title,
    authorName: post.authorName,
    category: post.category,
    status: getPostStatus(post),
    comments: []
  };
}

export default function ApprovalSimulator({ posts }) {
  const seedPosts = useMemo(() => posts.slice(0, 4).map(getSeedPost), [posts]);
  const [roleId, setRoleId] = useState("reviewer");
  const [demoPosts, setDemoPosts] = useState(seedPosts);
  const [selectedSlug, setSelectedSlug] = useState(seedPosts[0]?.slug || "");
  const [comment, setComment] = useState("");

  const selectedPost =
    demoPosts.find((post) => post.slug === selectedSlug) || demoPosts[0];
  const selectedRole = approvalRoles.find((role) => role.id === roleId);

  function updateSelected(status, fallbackComment) {
    const nextComment = comment.trim() || fallbackComment;

    setDemoPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.slug === selectedPost.slug
          ? {
              ...post,
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
          <h3>Approval test workspace</h3>
          <p className="muted-copy">
            Use sample roles to test how approval, rejection, requested changes,
            and publishing should behave.
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
              {approvalRoles.map((role) => (
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
                <em>{post.status}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="cms-stack">
          <div>
            <span className={`status-badge status-${selectedPost.status.replaceAll(" ", "-")}`}>
              {selectedPost.status}
            </span>
            <h3>{selectedPost.title}</h3>
            <p className="muted-copy">
              {statusNotes[selectedPost.status] || "Current workflow status."}
            </p>
          </div>

          <label>
            Approval comment
            <textarea
              placeholder="Add feedback for the author or publishing team..."
              rows="4"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>

          <div className="approval-actions">
            <button
              disabled={!canSubmit(roleId)}
              type="button"
              onClick={() => updateSelected("submitted for review", "Submitted for review.")}
            >
              Submit review
            </button>
            <button
              disabled={!canReview(roleId)}
              type="button"
              onClick={() => updateSelected("approved by reviewer", "Approved for final review.")}
            >
              Approve
            </button>
            <button
              disabled={!canReview(roleId)}
              type="button"
              onClick={() => updateSelected("changes requested", "Changes requested.")}
            >
              Request changes
            </button>
            <button
              disabled={!canReview(roleId)}
              type="button"
              onClick={() => updateSelected("rejected", "Rejected after review.")}
            >
              Reject
            </button>
            <button
              disabled={!canPublish(roleId)}
              type="button"
              onClick={() => updateSelected("published", "Published by final approver.")}
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
                <strong>No approval notes yet</strong>
                <small>Run an action above to test the workflow.</small>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
