import { memo } from 'react'
import './SkillsMinimal.css'

// Import logos
import reactLogo from '../../assets/ReactJS.webp'
import jsLogo from '../../assets/javascript-1.webp'
import cssLogo from '../../assets/CSS.webp'
import tailwindLogo from '../../assets/TailwindCSS.webp'
import sassLogo from '../../assets/Sass.webp'
import nodeLogo from '../../assets/NodeJS.webp'
import expressLogo from '../../assets/ExpressJS.webp'
import mongoLogo from '../../assets/MongoDB.webp'
import mysqlLogo from '../../assets/MySQL.webp'
import figmaLogo from '../../assets/Figma.webp'
import gitLogo from '../../assets/git.webp'
import githubLogo from '../../assets/GitHub.webp'
import firebaseLogo from '../../assets/Firebase.webp'
import cplusplusLogo from '../../assets/C++.webp'
import davinciLogo from '../../assets/davinci Resolve.webp'
import gitlabLogo from '../../assets/gitlab-svgrepo-com.webp'
import matplotlibLogo from '../../assets/matplotlib.webp'
import seabornLogo from '../../assets/seaborn.webp'
import pythonLogo from '../../assets/Python.webp'

const skillsData = [
  {
    key: 'frontend',
    title: 'Frontend',
    capabilities: [
      'Designing scalable UI systems',
      'Writing type-safe React components',
      'Optimizing rendering and performance',
      'Building maintainable component architectures'
    ],
    tools: 'React · TypeScript · JavaScript · CSS · Vite',
    badges: [
      { logo: reactLogo, text: 'React' },
      { logo: jsLogo, text: 'JavaScript' },
      { logo: cssLogo, text: 'CSS' },
      { logo: tailwindLogo, text: 'Tailwind' },
      { logo: sassLogo, text: 'Sass' },
      { logo: reactLogo, text: 'React' },
      { logo: jsLogo, text: 'JavaScript' },
      { logo: cssLogo, text: 'CSS' },
      { logo: tailwindLogo, text: 'Tailwind' },
      { logo: sassLogo, text: 'Sass' }
    ]
  },
  {
    key: 'backend',
    title: 'Backend',
    capabilities: [
      'Architecting RESTful APIs',
      'Designing database schemas and relationships',
      'Building scalable server infrastructure',
      'Implementing authentication and security'
    ],
    tools: 'Node.js · Express · MongoDB · MySQL',
    badges: [
      { logo: nodeLogo, text: 'Node.js' },
      { logo: expressLogo, text: 'Express' },
      { logo: mongoLogo, text: 'MongoDB' },
      { logo: mysqlLogo, text: 'MySQL' },
      { logo: firebaseLogo, text: 'Firebase' },
      { logo: nodeLogo, text: 'Node.js' },
      { logo: expressLogo, text: 'Express' },
      { logo: mongoLogo, text: 'MongoDB' },
      { logo: mysqlLogo, text: 'MySQL' },
      { logo: firebaseLogo, text: 'Firebase' }
    ]
  },
  {
    key: 'uiux',
    title: 'UI / UX',
    capabilities: [
      'Crafting intuitive user interfaces',
      'Creating responsive, accessible layouts',
      'Designing fluid animations and interactions',
      'Building cohesive design systems'
    ],
    tools: 'Figma · Design Systems · WCAG · Framer Motion',
    badges: [
      { logo: figmaLogo, text: 'Figma' },
      { logo: reactLogo, text: 'React' },
      { logo: cssLogo, text: 'CSS' },
      { logo: tailwindLogo, text: 'Tailwind' },
      { logo: sassLogo, text: 'Sass' },
      { logo: figmaLogo, text: 'Figma' },
      { logo: reactLogo, text: 'React' },
      { logo: cssLogo, text: 'CSS' },
      { logo: tailwindLogo, text: 'Tailwind' },
      { logo: sassLogo, text: 'Sass' }
    ]
  },
  {
    key: 'tools',
    title: 'Tools & Workflow',
    capabilities: [
      'Managing version control and collaboration',
      'Deploying and monitoring applications',
      'Configuring build and development tools',
      'Integrating cloud services and APIs'
    ],
    tools: 'Git · GitHub · Vercel · Firebase',
    badges: [
      { logo: gitLogo, text: 'Git' },
      { logo: githubLogo, text: 'GitHub' },
      { logo: firebaseLogo, text: 'Firebase' },
      { logo: nodeLogo, text: 'Node.js' },
      { logo: figmaLogo, text: 'Figma' },
      { logo: gitLogo, text: 'Git' },
      { logo: githubLogo, text: 'GitHub' },
      { logo: firebaseLogo, text: 'Firebase' },
      { logo: nodeLogo, text: 'Node.js' },
      { logo: figmaLogo, text: 'Figma' }
    ]
  }
]

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

function SkillsMinimal() {
  return (
    <div 
      className="skills-minimal-page page-container" 
      id="skills-minimal" 
    >
      <div className="skills-minimal-container">
        <div className="skills-minimal-header">
          <h1 className="skills-minimal-title">SKILLS</h1>
          <p className="skills-minimal-subtitle">What I can do</p>
        </div>

        <div className="skills-minimal-grid">
          {skillsData.map((category, cardIndex) => (
            <div 
              key={category.key} 
              className="skill-card-minimal" 
              tabIndex="0"
              style={{ '--card-index': cardIndex }}
            >
              <h3 className="skill-category-title">{category.title}</h3>
              <ul className="skill-list">
                {category.capabilities.map((capability, index) => (
                  <li key={index} className="skill-item" style={{ '--item-index': index }}>
                    {capability}
                  </li>
                ))}
              </ul>
              
              {/* Horizontal motion strip */}
              <div className="skill-motion-strip">
                <div className="skill-motion-track">
                  {category.badges.map((badge, idx) => (
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
          ))}
        </div>

        <div className="skills-stack-summary">
          <div className="global-tech-track">
            {globalTechBadges.map((badge, idx) => (
              <div key={idx} className="global-tech-badge">
                <img 
                  src={badge.logo} 
                  alt={badge.text}
                  className="global-tech-badge-logo"
                  loading="lazy"
                  decoding="async"
                />
                <span className="global-tech-badge-text">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="decorative-gradient"></div>
    </div>
  )
}

export default memo(SkillsMinimal)
