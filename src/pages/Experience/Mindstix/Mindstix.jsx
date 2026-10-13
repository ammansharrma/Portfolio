import { memo, useEffect } from 'react';
import './Mindstix.css';

const Icons = {
  Backend: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  Frontend: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  AI: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.5 4.5" /><path d="M12 12V2" /><path d="M16 8l5 5" /></svg>,
  Deployment: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="7.5 4.21 12 6.81 16.5 4.21" /><polyline points="7.5 19.79 7.5 14.63 12 12 16.5 14.63 16.5 19.79" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  External: () => <span aria-hidden="true">↗</span>
};

const projects = [
  ['AI Order Notes Summarization Agent', 'Production AI Agent', 'Architected and operated a production AI agent using AWS Bedrock AgentCore across 2 production regions behind shared Keycloak/OAuth authentication.', 'Re-engineered the request lifecycle with Server-Sent Events, reducing average end-to-end generation time from 35s to ~20s (~43%) while resolving 15+ production and QA defects.', ['AWS Bedrock', 'AgentCore', 'SSE', 'Keycloak', 'OAuth']],
  ['Agent Evaluation and Observability', 'Evaluation & Reliability', 'Implemented production evaluations, tracing, and monitoring with AgentCore to make agent behavior measurable in production.', 'Built offline evaluation workflows using Langfuse and golden datasets to validate behavior and identify regressions.', ['AgentCore', 'Langfuse', 'Golden Datasets', 'Tracing']],
  ['CSR Rep Copilot & Claims Analysis', 'Customer Service AI', 'Built an AI application on AWS Connect combining real-time WebSockets, RAG, and AI Claims Analysis.', 'Surface contextual suggestions and claim summaries in a live customer service workflow.', ['AWS Connect', 'WebSockets', 'RAG', 'AI Claims Analysis']],
  ['Root Cause Analysis Agent', 'Multi-Agent Systems', 'Developed a multi-agent RCA system using AWS Bedrock AgentCore to investigate production failures.', 'Integrated CloudWatch, GitHub MCP, web search, and specialized agents to generate RCA documents.', ['AgentCore', 'CloudWatch', 'GitHub MCP', 'Web Search']],
  ['Full-Stack & Backend Delivery', 'Product Engineering', 'Built production REST APIs using Node.js, TypeScript, Express.js, and NestJS, integrated with React frontends.', 'Implemented a supporting GraphQL API and configured Jenkins CI/CD pipelines for multi-region deployments.', ['TypeScript', 'NestJS', 'React', 'GraphQL', 'Jenkins']]
];

function Mindstix() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="mindstix-page nebula-theme">
      <div className="nebula-texture" />
      <div className="mindstix-container">
        <header className="mindstix-header">
          <div className="header-meta"><span className="duration">Jun 2025 — Present</span></div>
          <h1 className="company-name">Mindstix Software Labs</h1>
          <h2 className="role-title">Software Developer</h2>
          <p className="brief-summary">Building and operating production AI agents and backend systems, taking AI features from POC through reliable production rollout.</p>
          <a href="https://mindstix.com" target="_blank" rel="noopener noreferrer" className="company-link">Visit Company <Icons.External /></a>
          <div className="header-underline" />
        </header>

        <main className="bento-grid">
          <section className="bento-card overview"><h3 className="card-label">Company Overview</h3><div className="card-content"><p>Mindstix is a full-stack digital product engineering firm where I deliver production AI agents, backend systems, and enterprise workflows.</p><div className="domain-tags"><span className="tag">AI Agents</span><span className="tag">Backend Systems</span><span className="tag">Cloud Delivery</span></div></div></section>
          <section className="bento-card roles"><h3 className="card-label">Role &amp; Scope</h3><div className="card-content"><ul className="responsibility-list"><li><Icons.AI /> <span>Production AI agents with Bedrock AgentCore</span></li><li><Icons.Backend /> <span>Node.js, TypeScript, NestJS, REST &amp; GraphQL</span></li><li><Icons.Frontend /> <span>React, WebSockets, and SSE delivery</span></li><li><Icons.Deployment /> <span>Observability and Jenkins multi-region CI/CD</span></li></ul></div></section>

          {projects.map(([title, domain, summary, challenge, badges]) => <section key={title} className="bento-card project-card"><div className="project-header"><h3 className="project-title">{title}</h3><span className="project-domain">{domain}</span></div><div className="project-body"><p className="project-summary">{summary}</p><div className="project-challenge"><span className="challenge-label">Key Work:</span><p>{challenge}</p></div></div><div className="project-footer"><div className="skill-motion-strip"><div className="skill-motion-track">{badges.concat(badges).map((badge, index) => <div key={`${badge}-${index}`} className="skill-badge"><span className="skill-badge-text">{badge}</span></div>)}</div></div></div></section>)}

          <section className="bento-card growth"><h3 className="card-label">Engineering Growth</h3><div className="card-content"><h4 className="growth-title">“What I’ve Learned in Production”</h4><ul className="growth-points"><li><Icons.External /> Reliability comes from evaluation and observability.</li><li><Icons.External /> AI systems need structured workflows and traceable behavior.</li><li><Icons.External /> Backend performance is part of the product experience.</li><li><Icons.External /> Production ownership extends from QA through rollout.</li></ul></div></section>
        </main>
      </div>
      <div className="nebula-glow glow-1" /><div className="nebula-glow glow-2" />
    </div>
  );
}

export default memo(Mindstix);
