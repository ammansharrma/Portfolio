import { memo, useEffect } from 'react';
import './OmneVu.css';
import omnevuData from '../../../data/experience/omnevu.json';
import TopRightArrow from '../../../assets/Arrow-top-right.webp';

// Icons consistent with the system
const Icons = {
  Overview: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Project: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Growth: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
    </svg>
  ),
  External: (props) => (
    <img src={TopRightArrow} alt="" className="external-link-arrow" width="18" height="18" {...props} />
  )
};

function OmneVu() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { company, role, duration, summary, overview, projects, growth, website } = omnevuData;

  return (
    <div className="omnevu-page nebula-theme">
      {/* Background Texture Layer */}
      <div className="nebula-texture"></div>
      
      <div className="omnevu-container">
        {/* Header Section */}
        <header className="omnevu-header">
          <div className="header-meta">
            <span className="duration">{duration}</span>
          </div>
          <h1 className="company-name">{company}</h1>
          <h2 className="role-title">{role}</h2>
          <p className="brief-summary">{summary}</p>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="company-link">
              Visit Company<Icons.External />
            </a>
          )}
          <div className="header-underline"></div>
        </header>

        {/* Bento Grid */}
        <main className="bento-grid">
          {/* Company Overview */}
          <section className="bento-card overview">
            <h3 className="card-label">Company Overview</h3>
            <div className="card-content">
              {overview.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
              <div className="domain-tags">
                <span className="tag">Inventory</span>
                <span className="tag">Warranty</span>
                <span className="tag">B2B</span>
                <span className="tag">SaaS</span>
              </div>
            </div>
          </section>

          {/* Project Details */}
          {projects.map((project, idx) => (
            <section key={idx} className="bento-card project-card">
              <div className="project-header">
                <h3 className="project-title">
                  {project.title}
                </h3>
                <span className="project-domain">{project.domain} — {project.focus}</span>
              </div>
              <div className="project-body">
                <div className="project-list-section">
                  <span className="section-label">Key Contributions</span>
                  <ul className="project-bullet-list">
                    {project.contributions.map((item, i) => (
                      <li key={i}>
                                                  <Icons.External width="18" height="18" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {project.impact && project.impact.length > 0 && (
                  <div className="project-list-section">
                    <span className="section-label">Impact</span>
                    <ul className="project-bullet-list impact-list">
                      {project.impact.map((item, i) => (
                        <li key={i}>
                                                    <Icons.External width="18" height="18" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          ))}

          {/* Growth Block */}
          <section className="bento-card growth">
            <h3 className="card-label">What This Phase Taught Me</h3>
            <div className="card-content">
              <ul className="growth-points">
                {growth.map((point, idx) => (
                  <li key={idx}>
                    <Icons.External />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Decorative Radials (Slightly lighter/different position) */}
      <div className="nebula-glow glow-primary"></div>
      <div className="nebula-glow glow-secondary"></div>
    </div>
  );
}

export default memo(OmneVu);
