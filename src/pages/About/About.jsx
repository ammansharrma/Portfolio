import { memo } from 'react';
import './About.css';

function About() {
  return (
    <section className="about-page section-shell" id="about">
      <div className="section-shell-inner about-layout">
        <h2 className="section-label">About</h2>

        <div className="about-content">
          <p className="about-text">
            I'm interested in building complete systems where backend architecture, AI intelligence, and interface design operate as one cohesive experience.
          </p>

          <p className="about-text">
            I'm drawn to problems that require both precision and intuition. The kind where scalable APIs, structured data models, and intelligent AI pipelines need to work quietly behind a clean, fast interface.
          </p>

          <h3 className="about-section-title font-mono">How I build</h3>
          <ul className="about-principles">
            <li>I think in systems, not isolated features.</li>
            <li>I care about performance as much as polish.</li>
            <li>I design AI integrations with safety, structure, and cost-awareness in mind.</li>
          </ul>

          <p className="about-text">
            Currently, I contribute to end-to-end product systems from API design to production-ready UI engineering while independently building AI-driven projects that explore retrieval pipelines, structured prompting, and controlled execution flows.
          </p>

          <p className="about-text">
            Previously, I worked on applied AI tooling and automation systems, where I learned that <span className="highlight">clarity often matters more than complexity.</span>
          </p>

          <p className="about-text">
            Outside of engineering, I study financial systems and product strategy because <span className="highlight">great software isn't just built, it's positioned.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
