import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Mindstix.css';

// Asset imports
import reactLogo from '../../../assets/ReactJS.webp'
import nodeLogo from '../../../assets/NodeJS.webp'
import mysqlLogo from '../../../assets/MySQL.webp'
import pythonLogo from '../../../assets/Python.webp'
import jsLogo from '../../../assets/javascript-1.webp'
import aiLogo from '../../../assets/huggingface.webp'
import TopRightArrow from '../../../assets/Arrow-top-right.webp'
import NavArrow from '../../../assets/Nav-Arrow.webp'

// Minimal stroke icons as SVGs
const Icons = {
  Backend: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  Frontend: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  AI: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
      <path d="M12 12L2.5 4.5" />
      <path d="M12 12V2" />
      <path d="M16 8l5 5" />
    </svg>
  ),
  Deployment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
      <polyline points="7.5 19.79 7.5 14.63 12 12 16.5 14.63 16.5 19.79" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  External: () => (
    <img src={TopRightArrow} alt="" className="external-link-arrow" />
  )
};

const Projects = [
  {
    title: "SKU Creation and Management",
    domain: "Retail / FMCG",
    role: "Full Stack Development",
    summary: "Unified product data management system for high-scale retail operations.",
    challenge: "Optimizing catalog synchronization across disparate data sources.",
    badges: [
      { logo: reactLogo, text: 'React' }, { logo: nodeLogo, text: 'Node.js' }, { logo: mysqlLogo, text: 'SQL' },
      { logo: reactLogo, text: 'React' }, { logo: nodeLogo, text: 'Node.js' }, { logo: mysqlLogo, text: 'SQL' },
      { logo: reactLogo, text: 'React' }, { logo: nodeLogo, text: 'Node.js' }, { logo: mysqlLogo, text: 'SQL' },
      { logo: reactLogo, text: 'React' }, { logo: nodeLogo, text: 'Node.js' }, { logo: mysqlLogo, text: 'SQL' }
    ]
  },
  {
    title: "Promotions Portal",
    domain: "Enterprise Retail",
    role: "Frontend Architecture",
    summary: "Professional dashboard for campaign management and offer distribution.",
    challenge: "Building a fluid UI for complex multi-condition campaigning logic.",
    badges: [
      { logo: jsLogo, text: 'TypeScript' }, { logo: reactLogo, text: 'React' }, { logo: jsLogo, text: 'Redux' },
      { logo: jsLogo, text: 'TypeScript' }, { logo: reactLogo, text: 'React' }, { logo: jsLogo, text: 'Redux' },
      { logo: jsLogo, text: 'TypeScript' }, { logo: reactLogo, text: 'React' }, { logo: jsLogo, text: 'Redux' },
      { logo: jsLogo, text: 'TypeScript' }, { logo: reactLogo, text: 'React' }, { logo: jsLogo, text: 'Redux' }
    ]
  },
  {
    title: "AI Copilot System",
    domain: "Internal Tooling",
    role: "AI Integration Lead",
    summary: "Next-gen developer productivity suite with agentic workflow capabilities.",
    challenge: "Ensuring structured execution flows within non-deterministic AI outputs.",
    badges: [
      { logo: aiLogo, text: 'OpenAI' }, { logo: pythonLogo, text: 'Python' }, { logo: reactLogo, text: 'React' },
      { logo: aiLogo, text: 'OpenAI' }, { logo: pythonLogo, text: 'Python' }, { logo: reactLogo, text: 'React' },
      { logo: aiLogo, text: 'OpenAI' }, { logo: pythonLogo, text: 'Python' }, { logo: reactLogo, text: 'React' },
      { logo: aiLogo, text: 'OpenAI' }, { logo: pythonLogo, text: 'Python' }, { logo: reactLogo, text: 'React' }
    ]
  }
];

function Mindstix() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mindstix-page nebula-theme">
      {/* Background Texture Layer */}
      <div className="nebula-texture"></div>
      
      <div className="mindstix-container">
        {/* Header Section */}
        <header className="mindstix-header">
          <div className="header-meta">
            <span className="duration">Aug 2024 — Present</span>
            {/* <Link to="/" className="back-link">
              <span>Back home</span>
            </Link> */}
          </div>
          <h1 className="company-name">Mindstix Software Labs</h1>
          <h2 className="role-title">Member of Technical Staff</h2>
          <p className="brief-summary">
            Leading engineering efforts at the intersection of scalable web architecture and intelligent AI integrations.
          </p>
          <a href="https://mindstix.com" target="_blank" rel="noopener noreferrer" className="company-link">
            Visit Company<Icons.External />
          </a>
          <div className="header-underline"></div>
        </header>

        {/* Bento Grid */}
        <main className="bento-grid">
          {/* Company Overview */}
          <section className="bento-card overview">
            <h3 className="card-label">Company Overview</h3>
            <div className="card-content">
              <p>Mindstix is a full-stack digital product engineering firm that helps startups and enterprises build high-performance digital solutions.</p>
              <div className="domain-tags">
                <span className="tag">FMCG</span>
                <span className="tag">Retail</span>
                <span className="tag">Cloud Infra</span>
              </div>
            </div>
          </section>

          {/* Role & Responsibilities */}
          <section className="bento-card roles">
            <h3 className="card-label">Role & Scope</h3>
            <div className="card-content">
              <ul className="responsibility-list">
                <li><Icons.Backend /> <span>Backend systems architecture</span></li>
                <li><Icons.Frontend /> <span>State-of-the-art frontend engineering</span></li>
                <li><Icons.AI /> <span>Managed AI & LLM integration flows</span></li>
                <li><Icons.Deployment /> <span>Collaborative CI/CD orchestration</span></li>
              </ul>
            </div>
          </section>

          {/* Projects */}
          {Projects.map((project, idx) => (
            <section key={idx} className="bento-card project-card">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className="project-domain">{project.domain}</span>
              </div>
              <div className="project-body">
                <p className="project-summary">{project.summary}</p>
                <div className="project-challenge">
                  <span className="challenge-label">Key Challenge:</span>
                  <p>{project.challenge}</p>
                </div>
              </div>
              <div className="project-footer">
                <div className="skill-motion-strip">
                  <div className="skill-motion-track">
                    {project.badges.map((badge, idx) => (
                      <div key={idx} className="skill-badge">
                        <img 
                          src={badge.logo} 
                          alt={badge.text}
                          className="skill-badge-logo"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="skill-badge-text">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Engineering Philosophy */}
          <section className="bento-card growth">
            <h3 className="card-label">Engineering Growth</h3>
            <div className="card-content">
              <h4 className="growth-title">“What I’ve Learned in Production”</h4>
              <ul className="growth-points">
                <li><Icons.External /> Respecting constraints leads to better technical precision.</li>
                <li><Icons.External /> Full-stack is a shift from UI states to data lifecycle management.</li>
                <li><Icons.External /> Engineering is as much about observability as it is about features.</li>
                <li><Icons.External /> AI under strict constraints requires deterministic guardrails.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Decorative Radials */}
      <div className="nebula-glow glow-1"></div>
      <div className="nebula-glow glow-2"></div>
    </div>
  );
}

export default memo(Mindstix);
