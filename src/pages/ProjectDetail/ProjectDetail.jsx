import { memo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './ProjectDetail.css';
import projectsData from '../../data/projects.json';
import IdentityGlyph from '../../components/IdentityGlyph';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%';

function useScrambleReveal(text) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const intervalId = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealCount) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      setDisplay(scrambled);
      if (frame >= totalFrames) window.clearInterval(intervalId);
    }, 40);

    return () => window.clearInterval(intervalId);
  }, [text]);

  return display;
}

function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function MediaFrame({ project, mockupIndex }) {
  if (project.isBuilding) {
    return (
      <div className="building-status-block">
        <IdentityGlyph projectId={project.id} size={56} />
        <p className="building-status-line font-mono">
          active development<span className="status-cursor">▮</span>
        </p>
      </div>
    );
  }

  const video = project.detailsVideo || project.heroVideo;
  if (video) {
    return (
      <video
        className="project-video-full"
        src={`${import.meta.env.BASE_URL}${video}`}
        controls
        loop
        autoPlay
        muted
        playsInline
      />
    );
  }

  if (project.mockups && project.mockups.length > 0) {
    const src = project.mockups[mockupIndex % project.mockups.length];
    return (
      <img
        className="mockup-image"
        src={`${import.meta.env.BASE_URL}${src}`}
        alt={project.title}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return null;
}

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.projects.find(p => p.id === id);
  const pageRef = useRef(null);
  const scrollSectionRef = useRef(null);
  const [sectionFloat, setSectionFloat] = useState(0);
  const reduceMotion = useReducedMotion();

  const displayTitle = useScrambleReveal(project ? project.title : '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const sections = project ? [
    { key: 'problem', label: 'Problem', type: 'text', text: project.problem },
    { key: 'solution', label: 'Solution', type: 'text', text: project.solution },
    project.architecture && project.architecture.length > 0 && { key: 'architecture', label: 'Architecture', type: 'list', list: project.architecture },
    project.highlights && project.highlights.length > 0 && { key: 'highlights', label: 'Key Highlights', type: 'list', list: project.highlights },
    project.learnings && project.learnings.length > 0 && { key: 'learnings', label: 'Learnings', type: 'list', list: project.learnings },
  ].filter(Boolean) : [];

  useEffect(() => {
    const page = pageRef.current;
    const section = scrollSectionRef.current;
    if (!page || !section || sections.length === 0) return undefined;

    const update = () => {
      const pageRect = page.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const containerTop = sectionRect.top - pageRect.top + page.scrollTop;
      const containerHeight = section.offsetHeight || 1;
      const raw = (page.scrollTop - containerTop) / containerHeight;
      const clamped = Math.min(1, Math.max(0, raw));
      setSectionFloat(clamped * sections.length);
    };

    update();
    page.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      page.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [id, sections.length]);

  if (!project) {
    return (
      <div className="project-detail-error">
        <h1>Project Not Found</h1>
        <p>The project you're looking for doesn't exist.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const activeIndex = sections.length ? Math.min(sections.length - 1, Math.floor(sectionFloat)) : 0;
  const localT = sections.length ? Math.min(1, Math.max(0, sectionFloat - activeIndex)) : 0;
  const activeSection = sections[activeIndex];
  const textTranslate = reduceMotion ? 0 : (0.5 - localT) * 200;
  const textOpacity = reduceMotion ? 1 : Math.max(0, 1 - Math.abs(0.5 - localT) * 2.2);

  const hasMedia = !!(
    project.isBuilding ||
    project.detailsVideo ||
    project.heroVideo ||
    (project.mockups && project.mockups.length > 0)
  );

  const projectIndex = projectsData.projects.findIndex(p => p.id === id);
  const prevProject = projectsData.projects[(projectIndex - 1 + projectsData.projects.length) % projectsData.projects.length];
  const nextProject = projectsData.projects[(projectIndex + 1) % projectsData.projects.length];

  const handleClose = () => {
    navigate('/', { replace: false });
    // Scroll to projects section after navigation
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="project-detail-page" ref={pageRef}>
      {/* Close Button */}
      <button
        className="project-detail-close"
        onClick={handleClose}
        aria-label="Close project details"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Hero: intro + full-bleed media */}
      <div className="detail-hero">
        <div className="detail-hero-left">
          <IdentityGlyph projectId={project.id} layoutId={`glyph-${project.id}`} size={36} />

          <h1 className="detail-hero-title" aria-label={project.title}>{displayTitle}</h1>

          <div className="detail-tag-row">
            {project.stack.map((tech, idx) => (
              <span key={idx} className="detail-tag-pill">
                <span className="detail-tag-dot" />
                {tech}
              </span>
            ))}
          </div>

          <p className="detail-hero-desc">{project.shortDescription}</p>

          <div className="detail-hero-divider" />

          <div className="detail-hero-meta">
            <div className="meta-cell">
              <span className="meta-label font-mono">Category</span>
              <span className="meta-value">{capitalize(project.category)}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-label font-mono">Status</span>
              <span className="meta-value">{project.isBuilding ? 'In Development' : 'Shipped'}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-label font-mono">Stack</span>
              <span className="meta-value">{project.stack.slice(0, 3).join(' / ')}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-label font-mono">Links</span>
              <span className="meta-value">
                {project.demo ? 'Live Demo' : project.github ? (project.githubDisabled ? 'Source — Locked' : 'Source Available') : '—'}
              </span>
            </div>
          </div>
        </div>

        {hasMedia && (
          <div className="detail-hero-media">
            <MediaFrame project={project} mockupIndex={0} />
          </div>
        )}
      </div>

      {/* Scroll-driven story: text travels bottom-to-top of the image card, image swaps between steps */}
      {sections.length > 0 && (
        <div className="detail-scroll-section" ref={scrollSectionRef} style={{ height: `${sections.length * 100}vh` }}>
          <div className="detail-scroll-stage">
            <div className="detail-text-viewport">
              <div
                className="detail-text-block"
                style={{ transform: `translateY(${textTranslate}%)`, opacity: textOpacity }}
              >
                <span className="detail-text-index font-mono">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                </span>
                <h3 className="detail-text-heading">{activeSection?.label}</h3>
                {activeSection?.type === 'text' ? (
                  <p className="detail-text-body">{activeSection.text}</p>
                ) : (
                  <ul className="detail-text-list">
                    {activeSection?.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {hasMedia && (
              <div className="detail-image-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    className="detail-image-frame"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MediaFrame project={project} mockupIndex={activeIndex} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer: links + next project navigation */}
      <div className="detail-footer">
        {(project.github || project.demo) && (
          <div className="detail-links">
            {project.github && (
              <a
                href={project.githubDisabled ? "#" : project.github}
                target={project.githubDisabled ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className={`detail-link-btn ${project.githubDisabled ? 'disabled' : ''}`}
                onClick={(e) => {
                  if (project.githubDisabled) {
                    e.preventDefault();
                  }
                }}
                style={project.githubDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {project.githubDisabled ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                {project.githubDisabled ? "Locked" : "View Code"}
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-link-btn primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        )}

        <div className="detail-project-nav">
          <Link to={`/projects/${prevProject.id}`} className="detail-nav-arrow" aria-label={`Previous project: ${prevProject.title}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <Link to={`/projects/${nextProject.id}`} className="detail-nav-label font-mono">
            Next Project — {nextProject.title}
          </Link>
          <Link to={`/projects/${nextProject.id}`} className="detail-nav-arrow" aria-label={`Next project: ${nextProject.title}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(ProjectDetail);
