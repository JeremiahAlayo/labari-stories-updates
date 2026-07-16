import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Author Publishing Packages",
  description:
    "Turn one manuscript into readable, listenable, and watchable digital experiences with Labari author publishing packages.",
  alternates: {
    canonical: "/packages"
  },
  openGraph: {
    title: "Labari Author Publishing Packages",
    description:
      "Read, listen, and watch publishing packages for authors who want more ways to reach readers.",
    url: "/packages",
    siteName: "Labari",
    type: "website"
  }
};

const packages = [
  {
    name: "Read",
    price: "\u20A699,000",
    summary: "Your audience can read your book on Labari.",
    label: "Digital reading",
    features: ["Labari reading access", "Clean book presentation", "Author visibility"],
    tone: "green"
  },
  {
    name: "Read + Listen",
    price: "\u20A6199,000",
    summary: "Your audience can read and listen to your book.",
    label: "Most popular",
    features: ["Everything in Read", "Audio-ready experience", "More flexible discovery"],
    tone: "blue",
    featured: true
  },
  {
    name: "Read + Listen + Watch",
    price: "\u20A6399,000",
    summary: "Your audience can read, listen to, and watch your book.",
    label: "Best value",
    features: ["Everything in Read + Listen", "Video storytelling format", "Full digital presence"],
    tone: "gold"
  }
];

const benefits = [
  "Reach more readers across different content habits",
  "Publish once and prepare multiple digital experiences",
  "Build a stronger author presence inside the Labari ecosystem",
  "Keep your book available anytime and anywhere",
  "Give readers more ways to discover and return to your story",
  "Create a practical path from manuscript to digital product"
];

export default function PackagesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="packages-hero">
          <div className="container packages-hero-inner">
            <p className="eyebrow">Labari for authors</p>
            <h1>
              Turn your book into <span className="gradient-text">more than a book.</span>
            </h1>
            <p className="hero-text">
              One manuscript can become a reading, listening, and watching experience
              built for how people discover stories today.
            </p>
            <div className="experience-steps" aria-label="Labari content formats">
              <span>Read it</span>
              <span>Listen to it</span>
              <span>Watch it</span>
            </div>
            <div className="package-hero-actions">
              <a className="primary-link" href="#packages">
                Choose package
              </a>
              <a className="secondary-link" href="mailto:labari@doubleyou.com.ng">
                Contact Labari
              </a>
            </div>
          </div>
          <div className="packages-stage" aria-hidden="true">
            <div className="stage-shelf shelf-one">
              <span>Manuscript</span>
              <strong>Upload once</strong>
            </div>
            <div className="stage-card stage-read">
              <span>READ</span>
              <strong>Chapter 01</strong>
            </div>
            <div className="stage-card stage-listen">
              <span>LISTEN</span>
              <strong>04:28</strong>
            </div>
            <div className="stage-card stage-watch">
              <span>WATCH</span>
              <strong>Scene preview</strong>
            </div>
            <div className="signal-line line-one" />
            <div className="signal-line line-two" />
          </div>
        </section>

        <section className="packages-section" id="packages">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Choose your package</p>
              <h2>Simple options for different publishing goals.</h2>
            </div>
            <div className="package-grid">
              {packages.map((item) => (
                <article
                  className={`package-card package-${item.tone}${item.featured ? " featured" : ""}`}
                  key={item.name}
                >
                  <span className="package-label">{item.label}</span>
                  <h3>{item.name}</h3>
                  <div className="price-wrap">
                    <strong>{item.price}</strong>
                  </div>
                  <p>{item.summary}</p>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a className="package-button" href="mailto:labari@doubleyou.com.ng">
                    Get started
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="packages-section package-benefits">
          <div className="container benefits-layout">
            <div>
              <p className="eyebrow">Why Labari</p>
              <h2>More formats, more reach, one clear publishing path.</h2>
            </div>
            <div className="benefit-grid">
              {benefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="package-cta">
          <div className="container cta-inner">
            <div>
              <p className="eyebrow">Ready?</p>
              <h2>Your story deserves more than paper.</h2>
              <p>
                Read. Listen. Watch. Give your book more ways to meet the people it
                was written for.
              </p>
            </div>
            <div className="cta-actions">
              <a className="primary-link" href="https://www.labaribooks.com/">
                Visit home
              </a>
              <a className="secondary-link" href="tel:+2347017537291">
                +234 701 753 7291
              </a>
              <a className="secondary-link" href="mailto:labari@doubleyou.com.ng">
                labari@doubleyou.com.ng
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
