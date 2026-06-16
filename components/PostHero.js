import { formatDate } from "@/utils/format";

export default function PostHero({ post }) {
  return (
    <section className="post-hero">
      <div className="container post-hero-grid">
        <div>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="hero-text">{post.description}</p>
          <div className="post-meta large">
            <span>{formatDate(post.date)}</span>
            <span>{post.readTime}</span>
            {post.platformArea ? <span>{post.platformArea}</span> : null}
            {post.authorName ? <span>{post.authorName}</span> : null}
          </div>
        </div>
        <div
          className={`image-placeholder post-hero-image tone-${post.imageTone}`}
          aria-hidden="true"
        >
          <span>{post.category}</span>
        </div>
      </div>
    </section>
  );
}
