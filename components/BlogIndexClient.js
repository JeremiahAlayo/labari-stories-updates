"use client";

import { useMemo, useState } from "react";
import BlogCard from "@/components/BlogCard";

export default function BlogIndexClient({ posts, categories }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const searchableText = `${post.title} ${post.description} ${post.category} ${post.platformArea || ""} ${post.audience || ""}`
        .toLowerCase()
        .trim();
      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, posts, query]);

  return (
    <section className="container blog-index" aria-label="Blog posts">
      <div className="toolbar">
        <div className="search-field">
          <label htmlFor="post-search">Search articles</label>
          <input
            id="post-search"
            type="search"
            placeholder="Search updates, guides, tutorials..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="category-pills" aria-label="Filter by category">
          <button
            aria-pressed={activeCategory === "All"}
            className={activeCategory === "All" ? "active" : ""}
            type="button"
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              aria-pressed={activeCategory === category.name}
              className={activeCategory === category.name ? "active" : ""}
              key={category.name}
              type="button"
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
              <span>{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>Try another search term or category.</p>
        </div>
      )}
    </section>
  );
}
