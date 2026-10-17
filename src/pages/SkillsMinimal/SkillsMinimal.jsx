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
  { title: 'AI / Agent Engineering', capabilities: ['Building agents with AWS Bedrock AgentCore', 'Coordinating multi-agent workflows', 'Connecting retrieval, memory, and tools', 'Evaluating answers against a benchmark'], tools: ['Amazon Bedrock', 'AgentCore', 'LangChain', 'RAG', 'MCP'] },
  { title: 'Backend & Real-Time Systems', capabilities: ['Building Node.js and NestJS services', 'Streaming responses with SSE and WebSockets', 'Integrating OAuth and JWT authentication', 'Debugging asynchronous request lifecycles'], tools: ['Node.js', 'TypeScript', 'NestJS', 'SSE', 'WebSockets'] },
  { title: 'Frontend & Product Interfaces', capabilities: ['Building React interfaces from requirements', 'Connecting interfaces to backend workflows', 'Improving inventory and warranty experiences', 'Delivering features across frontend and backend'], tools: ['React 18', 'JavaScript', 'Material-UI', 'Vite'] },
  { title: 'Cloud & Engineering Delivery', capabilities: ['Operating AI workflows across two regions', 'Investigating production issues with logs', 'Working through planning, estimation, and delivery', 'Connecting cloud services and data stores'], tools: ['AWS', 'CloudWatch', 'S3', 'SQL', 'Git'] },
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

function SkillsMinimal() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className={`skills-minimal-page page-container ${isVisible ? 'is-visible' : ''}`} id="skills-minimal" aria-labelledby="skills-heading">
    <div className="skills-minimal-container"><div className="skills-minimal-header"><h2 className="skills-minimal-title" id="skills-heading">SKILLS</h2><p className="skills-minimal-subtitle">What I build and how I deliver it</p></div>
      <div className="skills-minimal-grid">{skills.map(category => <article className="skill-card-minimal" key={category.title} tabIndex="0" aria-label={category.title}>
        <h3 className="skill-category-title">{category.title}</h3><ul className="skill-list">{category.capabilities.map(capability => <li className="skill-item" key={capability}>{capability}</li>)}</ul>
        <div className="skill-motion-strip"><div className="skill-motion-track">
          {[...category.tools, ...category.tools].map((tool, index) => <span className="skill-badge" key={index} aria-hidden={index >= category.tools.length || undefined}>
            {toolLogos[tool] && <img src={toolLogos[tool]} alt="" className="skill-badge-logo" width="18" height="18" loading="lazy" />}
            <span className="skill-badge-text">{tool}</span>
          </span>)}
        </div></div>
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
