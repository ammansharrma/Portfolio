import { memo, useState, useEffect, useRef } from 'react';
import './SkillsMinimal.css';
import reactLogo from '../../assets/ReactJS.webp';
import jsLogo from '../../assets/javascript-1.webp';
import cssLogo from '../../assets/CSS.webp';
import tailwindLogo from '../../assets/TailwindCSS.webp';
import sassLogo from '../../assets/Sass.webp';
import nodeLogo from '../../assets/NodeJS.webp';
import expressLogo from '../../assets/ExpressJS.webp';
import mongoLogo from '../../assets/MongoDB.webp';
import mysqlLogo from '../../assets/MySQL.webp';
import gitLogo from '../../assets/git.webp';
import githubLogo from '../../assets/GitHub.webp';
import firebaseLogo from '../../assets/Firebase.webp';
import pythonLogo from '../../assets/Python.webp';

const repeat = (badges) => badges.concat(badges);
const textBadges = (items) => items.map((text) => ({ text }));

const skillsData = [
  {
    key: 'ai-agent-engineering', title: 'AI / Agent Engineering',
    capabilities: ['Building production AI agents', 'Designing agentic and multi-agent workflows', 'Implementing RAG and tool calling', 'Evaluating behavior with golden datasets'],
    tools: 'Bedrock AgentCore · Langfuse · RAG · Trace Debugging',
    badges: textBadges(['Bedrock AgentCore', 'Agentic Workflows', 'Multi-Agent Systems', 'RAG', 'Tool Calling', 'Golden Datasets', 'Langfuse', 'Trace Debugging'])
  },
  {
    key: 'backend', title: 'Backend',
    capabilities: ['Architecting RESTful and GraphQL APIs', 'Building asynchronous systems with WebSockets and SSE', 'Designing database schemas and relationships', 'Implementing OAuth and JWT authentication'],
    tools: 'Python · Node.js · TypeScript · Express.js · NestJS',
    badges: repeat([{ logo: nodeLogo, text: 'Node.js' }, { logo: expressLogo, text: 'Express.js' }, { logo: mongoLogo, text: 'MongoDB' }, { logo: mysqlLogo, text: 'SQL' }, { text: 'TypeScript' }, { text: 'NestJS' }, { text: 'GraphQL' }, { text: 'WebSockets / SSE' }, { text: 'OAuth / JWT' }])
  },
  {
    key: 'frontend', title: 'Frontend',
    capabilities: ['Designing scalable UI systems', 'Writing maintainable React components', 'Building responsive interfaces', 'Connecting interfaces to real-time systems'],
    tools: 'React 18 · JavaScript · SCSS · Material-UI · Vite',
    badges: repeat([{ logo: reactLogo, text: 'React 18' }, { logo: jsLogo, text: 'JavaScript' }, { logo: cssLogo, text: 'SCSS' }, { logo: tailwindLogo, text: 'Material-UI' }, { logo: sassLogo, text: 'Vite' }])
  },
  {
    key: 'cloud-devops', title: 'Cloud / DevOps',
    capabilities: ['Deploying and monitoring applications', 'Configuring multi-region CI/CD pipelines', 'Debugging production systems with traces and logs', 'Integrating cloud services and APIs'],
    tools: 'AWS · CloudWatch · Jenkins · Splunk · SonarQube · Keycloak',
    badges: textBadges(['AWS', 'CloudWatch', 'Jenkins', 'Splunk', 'SonarQube', 'Keycloak']).concat([{ logo: gitLogo, text: 'Git' }, { logo: githubLogo, text: 'GitHub' }, { logo: firebaseLogo, text: 'Firebase' }, { logo: pythonLogo, text: 'Python' }]).concat(textBadges(['AWS', 'CloudWatch', 'Jenkins', 'Splunk', 'SonarQube', 'Keycloak']))
  }
];

const globalTechBadges = textBadges(['AWS', 'Bedrock AgentCore', 'Langfuse', 'Python', 'Node.js', 'TypeScript', 'React', 'NestJS', 'RAG', 'GraphQL', 'CloudWatch', 'Jenkins', 'Git', 'GitHub', 'MongoDB', 'Firebase', 'AWS', 'Bedrock AgentCore', 'Langfuse', 'Python', 'Node.js', 'TypeScript', 'React', 'NestJS', 'RAG', 'GraphQL', 'CloudWatch', 'Jenkins', 'Git', 'GitHub', 'MongoDB', 'Firebase']);

function SkillBadge({ badge }) {
  return <div className="skill-badge">{badge.logo && <img src={badge.logo} alt={badge.text} className="skill-badge-logo" loading="lazy" decoding="async" width="24" height="24" />}<span className="skill-badge-text">{badge.text}</span></div>;
}

function SkillsMinimal() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={sectionRef} className={`skills-minimal-page page-container ${isVisible ? 'is-visible' : ''}`} id="skills-minimal">
    <div className="skills-minimal-container">
      <div className="skills-minimal-header"><h1 className="skills-minimal-title">SKILLS</h1><p className="skills-minimal-subtitle">What I can do</p></div>
      <div className="skills-minimal-grid">{skillsData.map((category, cardIndex) => <div key={category.key} className="skill-card-minimal" tabIndex="0" style={{ '--card-index': cardIndex }}><h3 className="skill-category-title">{category.title}</h3><ul className="skill-list">{category.capabilities.map((capability, index) => <li key={index} className="skill-item" style={{ '--item-index': index }}>{capability}</li>)}</ul><div className="skill-motion-strip"><div className="skill-motion-track">{category.badges.map((badge, idx) => <SkillBadge key={idx} badge={badge} />)}</div></div></div>)}</div>
      <div className="skills-stack-summary"><div className="global-tech-track">{globalTechBadges.map((badge, idx) => <SkillBadge key={idx} badge={badge} />)}</div></div>
    </div>
    <div className="decorative-gradient" />
  </div>;
}

export default memo(SkillsMinimal);
