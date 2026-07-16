import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-redirect">
      <div className="container">
        <p className="eyebrow">Labari</p>
        <h1>
          Stories & <span className="gradient-text">Updates</span>
        </h1>
        <p className="hero-text">
          Product news, reading guides, feature updates, and platform education.
        </p>
        <div className="package-hero-actions">
          <Link className="primary-link" href="/blog">
            Open blog
          </Link>
          <Link className="secondary-link" href="/packages">
            View packages
          </Link>
        </div>
      </div>
    </main>
  );
}
