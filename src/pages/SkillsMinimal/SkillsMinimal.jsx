import { memo, useEffect, useRef, useState } from 'react';
import './SkillsMinimal.css';

// Import logos
import reactLogo from '../../assets/ReactJS.webp'
import jsLogo from '../../assets/javascript-1.webp'
import cssLogo from '../../assets/CSS.webp'
import nodeLogo from '../../assets/NodeJS.webp'
import mongoLogo from '../../assets/MongoDB.webp'
import figmaLogo from '../../assets/Figma.webp'
import gitLogo from '../../assets/git.webp'
import firebaseLogo from '../../assets/Firebase.webp'
import cplusplusLogo from '../../assets/C++.webp'
import davinciLogo from '../../assets/davinci Resolve.webp'
import gitlabLogo from '../../assets/gitlab-svgrepo-com.webp'
import matplotlibLogo from '../../assets/matplotlib.webp'
import seabornLogo from '../../assets/seaborn.webp'
import pythonLogo from '../../assets/Python.webp'


const skills = [
  { title: 'AI & Agent Engineering', description: 'Agents, retrieval, memory, and evaluation.', tools: ['Amazon Bedrock', 'AgentCore', 'LangChain', 'RAG', 'MCP'] },
  { title: 'Frontend & Product Interfaces', description: 'Interfaces connected to working systems.', tools: ['React 18', 'JavaScript', 'Material-UI', 'Vite'] },
  { title: 'Backend & Real-Time Systems', description: 'APIs, authentication, and streamed responses.', tools: ['Node.js', 'TypeScript', 'NestJS', 'SSE', 'WebSockets'] },
  { title: 'Cloud & Delivery', description: 'Deployment, observability, and reliability.', tools: ['AWS', 'CloudWatch', 'S3', 'SQL', 'Git'] },
];

// Global tech stack for bottom animation
const globalTechBadges = [
  { logo: reactLogo, text: 'React' },
  { logo: jsLogo, text: 'JavaScript' },
  { logo: nodeLogo, text: 'Node.js' },
  { logo: mongoLogo, text: 'MongoDB' },
  { logo: gitLogo, text: 'Git' },
  { logo: figmaLogo, text: 'Figma' },
  { logo: cssLogo, text: 'CSS' },
  { logo: firebaseLogo, text: 'Firebase' },
  { logo: cplusplusLogo, text: 'C++' },
  { logo: davinciLogo, text: 'DaVinci' },
  { logo: gitlabLogo, text: 'GitLab' },
  { logo: matplotlibLogo, text: 'Matplotlib' },
  { logo: seabornLogo, text: 'Seaborn' },
  { logo: pythonLogo, text: 'Python' },
  { logo: reactLogo, text: 'React' },
  { logo: jsLogo, text: 'JavaScript' },
  { logo: nodeLogo, text: 'Node.js' },
  { logo: mongoLogo, text: 'MongoDB' },
  { logo: gitLogo, text: 'Git' },
  { logo: figmaLogo, text: 'Figma' },
  { logo: cssLogo, text: 'CSS' },
  { logo: firebaseLogo, text: 'Firebase' },
  { logo: cplusplusLogo, text: 'C++' },
  { logo: davinciLogo, text: 'DaVinci' },
  { logo: gitlabLogo, text: 'GitLab' },
  { logo: matplotlibLogo, text: 'Matplotlib' },
  { logo: seabornLogo, text: 'Seaborn' },
  { logo: pythonLogo, text: 'Python' }
]


const toolLogos = { 'React 18': reactLogo, JavaScript: jsLogo, 'Node.js': nodeLogo, Git: gitLogo };
const cloudIcon = name => `${import.meta.env.BASE_URL}architecture/icons/${name}.svg`;
Object.assign(toolLogos, { 'Amazon Bedrock': cloudIcon('bedrock'), AgentCore: cloudIcon('agentcore'), CloudWatch: cloudIcon('cloudwatch'), S3: cloudIcon('s3'), 'Material-UI': cloudIcon('materialui'), Vite: cloudIcon('vitejs'), NestJS: cloudIcon('nestjs') });
const skillLogo = name => `${import.meta.env.BASE_URL}images/skills/${name}`;
Object.assign(toolLogos, { LangChain: skillLogo('langchain.svg'), MCP: skillLogo('mcp.png'), TypeScript: skillLogo('typescript.png'), AWS: skillLogo('aws.svg') });

function SkillsMinimal() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className={`skills-minimal-page page-container ${isVisible ? 'is-visible' : ''}`} id="skills-minimal" aria-labelledby="skills-heading">
    <div className="skills-minimal-container"><div className="skills-minimal-header"><h2 className="skills-minimal-title" id="skills-heading">SKILLS</h2><p className="skills-minimal-subtitle">What goes into the work.</p></div>
      <div className="skills-editorial-list">{skills.map(category => <article className="skill-editorial-row" key={category.title} tabIndex="0" aria-label={`${category.title}: ${category.tools.join(', ')}`}
        onPointerEnter={event => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--reveal-from', event.clientY < bounds.top + bounds.height / 2 ? '-110%' : '110%');
        }}>
        <div className="skill-heading-window">
          <h3 className="skill-category-title">{category.title.startsWith('AI &') ? <><span className="skill-ai-accent">AI<svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true"><path d="M91 20C76 2 19 5 7 28C-4 52 35 65 73 56C105 49 105 20 81 12C56 2 15 12 9 31" /></svg></span>{category.title.slice(2)}</> : category.title}</h3>
          <div className="skill-reveal-ribbon" aria-hidden="true"><div className="skill-reveal-track">
            {[0, 1].map(copy => <div className="skill-reveal-group" key={copy}>
              {category.tools.map(tool => <span className="skill-reveal-tool" key={tool}>
                {toolLogos[tool] && <img src={toolLogos[tool]} className={tool === 'LangChain' ? 'skill-logo-wordmark' : undefined} alt={tool === 'LangChain' ? tool : ''} width={tool === 'LangChain' ? '142' : '30'} height="30" loading="lazy" />}
                {tool !== 'LangChain' && tool}
              </span>)}
            </div>)}
          </div></div>
        </div>
        <p className="skill-description">{category.description}</p>
      </article>)}</div>
      <div className="skills-stack-summary"><div className="global-tech-track">
        {globalTechBadges.map((badge, index) => <span className="global-tech-badge" key={index} aria-hidden={index >= globalTechBadges.length / 2 || undefined}>
          <img src={badge.logo} alt="" className="global-tech-badge-logo" width="20" height="20" loading="lazy" decoding="async" />
          <span className="global-tech-badge-text">{badge.text}</span>
        </span>)}
      </div></div>
    </div>
  </section>;
}
export default memo(SkillsMinimal);
