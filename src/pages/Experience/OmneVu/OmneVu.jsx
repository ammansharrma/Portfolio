import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OmneVu.css';
import omnevuData from '../../../data/experience/omnevu.json';

function OmneVu() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { company, role, duration, summary, overview, projects, growth, website } = omnevuData;

  return (
    <section className="exp-detail-page section-shell">
      <div className="section-shell-inner exp-detail-layout">
        <Link to="/" className="link-row-item exp-back">
          ← Home
        </Link>

        <p className="exp-kicker font-mono">{duration}</p>
        <h1 className="exp-title">{company}</h1>
        <p className="exp-role">{role}</p>
        <p className="exp-summary">{summary}</p>
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="link-row-item">
            Visit Company
          </a>
        )}

        <div className="exp-section">
          <h2 className="section-label">Company Overview</h2>
          {overview.map((para) => (
            <p key={para} className="exp-body-text">{para}</p>
          ))}
          <div className="exp-chip-row">
            <span className="exp-chip">Inventory</span>
            <span className="exp-chip">Warranty</span>
            <span className="exp-chip">B2B</span>
            <span className="exp-chip">SaaS</span>
          </div>
        </div>

        <div className="exp-section">
          <h2 className="section-label">Case Work</h2>
          {projects.map((project) => (
            <div key={project.title} className="exp-project-row">
              <div className="exp-project-header">
                <span className="index-row-title">{project.title}</span>
                <span className="index-row-meta">{project.domain} — {project.focus}</span>
              </div>

              <div className="exp-project-block">
                <h3 className="exp-project-block-label font-mono">Key Contributions</h3>
                <ul className="exp-bullet-list">
                  {project.contributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {project.impact && project.impact.length > 0 && (
                <div className="exp-project-block">
                  <h3 className="exp-project-block-label font-mono">Impact</h3>
                  <ul className="exp-bullet-list">
                    {project.impact.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="exp-section">
          <h2 className="section-label">What This Phase Taught Me</h2>
          <ul className="exp-bullet-list">
            {growth.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default memo(OmneVu);
