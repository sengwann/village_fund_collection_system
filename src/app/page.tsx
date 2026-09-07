import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Start with clarity",
    description:
      "A focused foundation with the essentials in place, so you can spend time on what makes your product different.",
  },
  {
    number: "02",
    title: "Build confidently",
    description:
      "TypeScript, sensible defaults, and the App Router give you a strong base for pages, layouts, and data.",
  },
  {
    number: "03",
    title: "Ship what matters",
    description:
      "Keep the surface simple now, then grow it into a complete experience as your idea takes shape.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="Northstar home">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>northstar</span>
        </Link>
        <div className="nav-links">
          <a href="#principles">Principles</a>
          <a href="#about">About</a>
          <a className="nav-cta" href="#get-started">
            Get started <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className="hero" id="get-started">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Next.js App Router template
          </p>
          <h1>
            Make something
            <span className="headline-accent"> worth finding.</span>
          </h1>
          <p className="hero-description">
            A thoughtful starting point for your next idea. Clean structure,
            considered details, and room to grow.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#principles">
              Explore the template <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#about">
              Learn more <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="sun">
            <span>NS</span>
          </div>
          <div className="art-label art-label-top">CREATE / 01</div>
          <div className="art-label art-label-bottom">KEEP MOVING →</div>
        </div>
      </section>

      <section className="principles-section" id="principles">
        <div className="section-heading">
          <p className="eyebrow">A better beginning</p>
          <h2>Everything you need to find your direction.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="eyebrow">Built to be changed</p>
        <p className="about-copy">
          This is your blank canvas. Replace this content, add routes in the
          <code> app</code> directory, and make it unmistakably yours.
        </p>
      </section>

      <footer className="site-footer">
        <span>© 2025 Northstar</span>
        <span>Built with Next.js</span>
      </footer>
    </main>
  );
}