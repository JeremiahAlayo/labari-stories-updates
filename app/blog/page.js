import BlogIndexClient from "@/components/BlogIndexClient";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { posts } from "@/data/posts";
import { getCategoriesWithCounts, getPublishedPosts } from "@/utils/posts";

export const metadata = {
  title: "Labari Blog",
  description:
    "Explore Labari product updates, reading guides, book discovery articles, feature guides, and platform education.",
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
              <p className="eyebrow">Labari Blog</p>
              <h1>
                Guides, news, and platform updates from{" "}
                <span className="gradient-text">Labari.</span>
              </h1>
              <p className="hero-text">
                Explore product news, reading guides, book discovery articles,
                feature explainers, and practical tips for getting more from
                Labari.
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
                <strong>Discovery, library, dashboard, and reading tools</strong>
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
