import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="container header-inner">
        <Link className="brand" href="/blog" aria-label="Labari home">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>
            <strong>Labari</strong>
            <small>Stories & Updates</small>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/blog">Blog</Link>
          <a href="https://www.labaribooks.com/" target="_blank" rel="noreferrer">
            Visit Labari
          </a>
        </nav>
      </div>
    </header>
  );
}
