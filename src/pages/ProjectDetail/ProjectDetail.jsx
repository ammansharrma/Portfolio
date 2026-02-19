import { memo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProjectDetail.css';
import projectsData from '../../data/projects.json';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.projects.find(p => p.id === id);
  const [activeView, setActiveView] = useState(project?.heroVideo ? 'video' : 'mockup'); // 'video' or 'mockup'
  const [activeMockupIndex, setActiveMockupIndex] = useState(0);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Lock scroll on both html and body
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Redirect wheel events to right panel
    const handleWheel = (e) => {
      if (rightPanelRef.current) {
        // Prevent default page scroll
        e.preventDefault();
        
        // Scroll the right panel instead
        rightPanelRef.current.scrollTop += e.deltaY;
      }
    };
    
    // Add wheel event listener to the entire page
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Cleanup function to restore scroll and remove event listener
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener('wheel', handleWheel);
    };
  }, [id]);

  if (!project) {
    return (
      <div className="project-detail-error">
        <h1>Project Not Found</h1>
        <p>The project you're looking for doesn't exist.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

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
    <div className="project-detail-page">
      {/* Close Button */}
      <button 
        className="project-detail-close" 
        onClick={handleClose}
        aria-label="Close project details"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="project-detail-container">
        {/* Left Panel: Media */}
        <div className="project-detail-left">
          {/* Toggle Buttons */}
          <div className="media-toggle">
            {project.heroVideo && (
              <button
                className={`toggle-btn ${activeView === 'video' ? 'active' : ''}`}
                onClick={() => setActiveView('video')}
              >
                Video
              </button>
            )}
            {project.mockups && project.mockups.length > 0 && (
              <button
                className={`toggle-btn ${activeView === 'mockup' ? 'active' : ''}`}
                onClick={() => setActiveView('mockup')}
              >
                Mockups
              </button>
            )}
          </div>

          {/* Media Display */}
          <div className="media-container">
            {project.heroVideo && (
              <div className={`media-view video-view ${activeView === 'video' ? 'active' : ''}`}>
                <video
                  className="project-video-full"
                  controls
                  loop
                  autoPlay
                  muted
                  playsInline
                >
                  <source src={project.heroVideo} type="video/mp4" />
                </video>
              </div>
            )}

            {project.mockups && project.mockups.length > 0 && (
              <div className={`media-view mockup-view ${activeView === 'mockup' ? 'active' : ''}`}>
                <div className="mockup-viewer">
                  <img 
                    key={activeMockupIndex}
                    src={project.mockups[activeMockupIndex]} 
                    alt={`${project.title} mockup ${activeMockupIndex + 1}`}
                    className="mockup-image"
                  />
                  {project.mockups.length > 1 && (
                    <div className="mockup-nav">
                      {project.mockups.map((_, idx) => (
                        <button
                          key={idx}
                          className={`mockup-dot ${idx === activeMockupIndex ? 'active' : ''}`}
                          onClick={() => setActiveMockupIndex(idx)}
                          aria-label={`View mockup ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Info (Scrollable) */}
        <div className="project-detail-right" ref={rightPanelRef}>
          <div className="project-detail-content">
            {/* Header */}
            <div className="detail-header">
              <h1 className="detail-title">{project.title}</h1>
              <p className="detail-subtitle">{project.shortDescription}</p>
            </div>

            {/* Stack Tags */}
            <div className="detail-section">
              <h3 className="section-label">Tech Stack</h3>
              <div className="detail-stack">
                {project.stack.map((tech, idx) => (
                  <span key={idx} className="detail-stack-tag">{tech}</span>
                ))}
              </div>
            </div>

            {/* Problem */}
            <div className="detail-section">
              <h3 className="section-label">Problem</h3>
              <p className="section-text">{project.problem}</p>
            </div>

            {/* Solution */}
            <div className="detail-section">
              <h3 className="section-label">Solution</h3>
              <p className="section-text">{project.solution}</p>
            </div>

            {/* Architecture */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="detail-section">
                <h3 className="section-label">Architecture</h3>
                <ul className="section-list">
                  {project.architecture.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="detail-section">
                <h3 className="section-label">Key Highlights</h3>
                <ul className="section-list highlights-list">
                  {project.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learnings */}
            {project.learnings && project.learnings.length > 0 && (
              <div className="detail-section">
                <h3 className="section-label">Learnings</h3>
                <ul className="section-list">
                  {project.learnings.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            {(project.github || project.demo) && (
              <div className="detail-section detail-links">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="detail-link-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProjectDetail);
