import { memo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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

const skillsData = [
  {
    key: 'frontend',
    title: 'Frontend',
    tools: 'React · TypeScript · JavaScript · CSS · Vite',
    capabilities: [
      'Designing scalable UI systems',
      'Writing type-safe React components',
      'Optimizing rendering and performance',
      'Building maintainable component architectures'
    ],
    badges: [
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
    tools: 'Node.js · Express · MongoDB · MySQL',
    capabilities: [
      'Architecting RESTful APIs',
      'Designing database schemas and relationships',
      'Building scalable server infrastructure',
      'Implementing authentication and security'
    ],
    badges: [
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
    tools: 'Figma · Design Systems · WCAG · Framer Motion',
    capabilities: [
      'Crafting intuitive user interfaces',
      'Creating responsive, accessible layouts',
      'Designing fluid animations and interactions',
      'Building cohesive design systems'
    ],
    badges: [
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
    tools: 'Git · GitHub · Vercel · Firebase',
    capabilities: [
      'Managing version control and collaboration',
      'Deploying and monitoring applications',
      'Configuring build and development tools',
      'Integrating cloud services and APIs'
    ],
    badges: [
      { logo: gitLogo, text: 'Git' },
      { logo: githubLogo, text: 'GitHub' },
      { logo: firebaseLogo, text: 'Firebase' },
      { logo: nodeLogo, text: 'Node.js' },
      { logo: figmaLogo, text: 'Figma' }
    ]
  }
]

function SkillsMinimal() {
  const [activeKey, setActiveKey] = useState(skillsData[0].key)
  const reduceMotion = useReducedMotion()
  const activeCategory = skillsData.find((category) => category.key === activeKey)

  return (
    <section className="skills-minimal-page section-shell" id="skills-minimal">
      <div className="section-shell-inner">
        <h2 className="section-label">Skills</h2>

        <div className="index-list">
          {skillsData.map((category) => (
            <button
              key={category.key}
              type="button"
              className="index-row"
              onClick={() => setActiveKey(category.key)}
              aria-expanded={activeKey === category.key}
            >
              <span className="index-row-title">{category.title}</span>
              <span className="index-row-desc">{category.tools}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory.key}
              className="skills-detail"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <ul className="skills-capabilities">
                {activeCategory.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>

              <div className="skills-badge-grid">
                {activeCategory.badges.map((badge, i) => (
                  <motion.div
                    key={badge.text}
                    className="skill-badge"
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <img
                      src={badge.logo}
                      alt={badge.text}
                      className="skill-badge-logo"
                      loading="lazy"
                      decoding="async"
                      width="24"
                      height="24"
                    />
                    <span className="skill-badge-text">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default memo(SkillsMinimal)
