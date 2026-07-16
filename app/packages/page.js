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

const processSteps = [
  {
    title: "Upload the manuscript",
    text: "Start with the book file and the basic author details."
  },
  {
    title: "Choose the experience",
    text: "Select read, listen, or watch depending on how you want people to enjoy the book."
  },
  {
    title: "Prepare the digital formats",
    text: "Labari shapes the book into the selected formats and prepares it for the platform."
  },
  {
    title: "Launch and share",
    text: "Your book gets a clearer digital presence with direct ways for readers to engage."
  }
];

const questions = [
  {
    question: "Which package should an author start with?",
    answer:
      "Read is best for a simple digital book launch. Read + Listen adds audio access. Read + Listen + Watch gives the strongest multi-format presence."
  },
  {
    question: "Can a package be upgraded later?",
    answer:
      "Yes. The page is structured so the team can later connect upgrades, author onboarding, and package requests to the main Labari backend."
  },
  {
    question: "What does Labari need from the author?",
    answer:
      "The manuscript, author details, preferred package, and any approved media assets needed to prepare the book experience."
  }
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
            <nav className="mobile-package-jump" aria-label="Package page sections">
              <a href="#packages">Packages</a>
              <a href="#benefits">Benefits</a>
              <a href="#process">Process</a>
              <a href="#questions">Questions</a>
            </nav>
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

        <section className="packages-section package-benefits" id="benefits">
          <div className="container benefits-layout">
            <div>
              <p className="eyebrow">Why Labari</p>
              <h2>More formats, more reach, one clear publishing path.</h2>
            </div>
            <ul className="benefit-grid benefit-list">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="packages-section package-process" id="process">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">How it works</p>
              <h2>A simple path from manuscript to digital experience.</h2>
            </div>
            <ol className="process-list">
              {processSteps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="packages-section package-questions" id="questions">
          <div className="container questions-layout">
            <div>
              <p className="eyebrow">Questions</p>
              <h2>Clear answers before an author gets started.</h2>
            </div>
            <div className="question-list">
              {questions.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
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
