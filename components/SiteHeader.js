import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="container header-inner">
        <Link className="brand" href="/blog" aria-label="Labari home">
          <Image
            className="brand-logo"
            src="/labari-logo-main.png"
            alt=""
            width="80"
            height="80"
            aria-hidden="true"
            priority
          />
          <span className="brand-context">Stories & Updates</span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/blog">Blog</Link>
          <a href="https://www.labaribooks.com/" target="_blank" rel="noreferrer">
            Home
          </a>
        </nav>
      </div>
    </header>
  );
}
