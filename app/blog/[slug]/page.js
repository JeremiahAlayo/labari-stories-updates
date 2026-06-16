import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ArticleAudioPlayer from "@/components/ArticleAudioPlayer";
import PostHero from "@/components/PostHero";
import SiteHeader from "@/components/SiteHeader";
import { authors } from "@/data/authors";
import { posts } from "@/data/posts";
import { getPostBySlug, getPublishedPosts } from "@/utils/posts";

export function generateStaticParams() {
  return getPublishedPosts(posts).map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(posts, slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(posts, slug);
  const author = authors.find((item) => item.id === post?.authorId);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <PostHero post={post} />
        <article className="container article-layout">
          <div className="article-body">
            <ArticleAudioPlayer post={post} />
            {post.content.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <aside className="article-aside" aria-label="Post details">
            <div className="aside-card">
              <span>Category</span>
              <strong>{post.category}</strong>
            </div>
            <div className="aside-card">
              <span>Reading time</span>
              <strong>{post.readTime}</strong>
            </div>
            {post.platformArea ? (
              <div className="aside-card">
                <span>Platform area</span>
                <strong>{post.platformArea}</strong>
              </div>
            ) : null}
            {post.audience ? (
              <div className="aside-card">
                <span>Audience</span>
                <strong>{post.audience}</strong>
              </div>
            ) : null}
            {author ? (
              <div className="aside-card">
                <span>Author</span>
                <strong>{author.name}</strong>
              </div>
            ) : null}
            <Link className="secondary-link" href="/blog">
              Back to all posts
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
