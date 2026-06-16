import BlogIndexClient from "@/components/BlogIndexClient";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";
import { getCategoriesWithCounts, getPublishedPosts } from "@/utils/posts";

export const metadata = {
  title: "Blog",
  description:
    "Explore Labari updates, educational posts, platform announcements, tutorials, and guides.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  const publishedPosts = getPublishedPosts(posts);
  const categories = getCategoriesWithCounts(publishedPosts);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="blog-hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Stories & Updates</p>
              <h1>Read the latest from Labari.</h1>
              <p className="hero-text">
                Explore platform news, reading guides, tutorials, and useful
                articles about experiencing books through text, audio, and
                visual storytelling.
              </p>
            </div>
            <aside className="hero-panel" aria-label="Blog summary">
              <div>
                <span className="panel-kicker">Articles</span>
                <strong>{publishedPosts.length}</strong>
              </div>
              <div>
                <span className="panel-kicker">Categories</span>
                <strong>{categories.length}</strong>
              </div>
              <div>
                <span className="panel-kicker">Focus</span>
                <strong>Books, learning, and product news</strong>
              </div>
            </aside>
          </div>
        </section>

        <BlogIndexClient posts={publishedPosts} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
