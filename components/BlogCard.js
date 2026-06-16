import Link from "next/link";
import { formatDate } from "@/utils/format";

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link
        className={`image-placeholder tone-${post.imageTone}`}
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
      >
        <span>{post.category}</span>
      </Link>
      <div className="card-content">
        <div className="post-meta">
          <span>{post.category}</span>
          {post.platformArea ? <span>{post.platformArea}</span> : null}
          <span>{formatDate(post.date)}</span>
        </div>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.description}</p>
        <div className="card-footer">
          <span>{post.readTime}</span>
          <Link href={`/blog/${post.slug}`}>Read article</Link>
        </div>
      </div>
    </article>
  );
}
