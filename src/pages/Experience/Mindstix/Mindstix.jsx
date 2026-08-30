import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Mindstix.css';

const RESPONSIBILITIES = [
  'Backend systems architecture',
  'State-of-the-art frontend engineering',
  'Managed AI & LLM integration flows',
  'Collaborative CI/CD orchestration',
];

const PROJECTS = [
  {
    title: 'SKU Creation and Management',
    domain: 'Retail / FMCG',
    summary: 'Unified product data management system for high-scale retail operations.',
    challenge: 'Optimizing catalog synchronization across disparate data sources.',
    stack: ['React', 'Node.js', 'SQL'],
  },
  {
    title: 'Promotions Portal',
    domain: 'Enterprise Retail',
    summary: 'Professional dashboard for campaign management and offer distribution.',
    challenge: 'Building a fluid UI for complex multi-condition campaigning logic.',
    stack: ['TypeScript', 'React', 'Redux'],
  },
  {
    title: 'AI Copilot System',
    domain: 'Internal Tooling',
    summary: 'Next-gen developer productivity suite with agentic workflow capabilities.',
    challenge: 'Ensuring structured execution flows within non-deterministic AI outputs.',
    stack: ['OpenAI', 'Python', 'React'],
  },
];

const GROWTH = [
  'Respecting constraints leads to better technical precision.',
  'Full-stack is a shift from UI states to data lifecycle management.',
  'Engineering is as much about observability as it is about features.',
  'AI under strict constraints requires deterministic guardrails.',
];

function Mindstix() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="exp-detail-page section-shell">
      <div className="section-shell-inner exp-detail-layout">
        <Link to="/" className="link-row-item exp-back">
          ← Home
        </Link>

        <p className="exp-kicker font-mono">Aug 2024 — Present</p>
        <h1 className="exp-title">Mindstix Software Labs</h1>
        <p className="exp-role">Member of Technical Staff</p>
        <p className="exp-summary">
          Leading engineering efforts at the intersection of scalable web architecture and intelligent AI integrations.
        </p>
        <a href="https://mindstix.com" target="_blank" rel="noopener noreferrer" className="link-row-item">
          Visit Company
        </a>

        <div className="exp-section">
          <h2 className="section-label">Company Overview</h2>
          <p className="exp-body-text">
            Mindstix is a full-stack digital product engineering firm that helps startups and enterprises build high-performance digital solutions.
          </p>
          <div className="exp-chip-row">
            <span className="exp-chip">FMCG</span>
            <span className="exp-chip">Retail</span>
            <span className="exp-chip">Cloud Infra</span>
          </div>
        </div>

        <div className="exp-section">
          <h2 className="section-label">Role &amp; Scope</h2>
          <ul className="exp-bullet-list">
            {RESPONSIBILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="exp-section">
          <h2 className="section-label">Case Work</h2>
          {PROJECTS.map((project) => (
            <div key={project.title} className="exp-project-row">
              <div className="exp-project-header">
                <span className="index-row-title">{project.title}</span>
                <span className="index-row-meta">{project.domain}</span>
              </div>
              <p className="exp-body-text">{project.summary}</p>
              <p className="exp-challenge">
                <span className="exp-challenge-label">Key challenge — </span>
                {project.challenge}
              </p>
              <div className="exp-chip-row">
                {project.stack.map((tech) => (
                  <span key={tech} className="exp-chip">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="exp-section">
          <h2 className="section-label">Engineering Growth</h2>
          <ul className="exp-bullet-list">
            {GROWTH.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default memo(Mindstix);
