import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArchiveOverlay.css';
import projectsData from '../data/projects.json';
import NavArrow from '../assets/Nav-Arrow.webp';

function ArchiveOverlay({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'featured', label: 'Featured Systems' },
    { id: 'core', label: 'Core Exploration' },
    { id: 'archived', label: 'Legacy Archives' },
    { id: 'experiment', label: 'Experiments & Labs' },
    { id: 'frontend', label: 'Frontend Engineering' }
  ];

  return (
    <div className="archive-overlay" onClick={onClose}>
      <div className="archive-content" onClick={(e) => e.stopPropagation()}>
        {/* Animated Background Elements */}
        <div className="archive-nebula-bg">
          <div className="nebula-glow n1"></div>
          <div className="nebula-glow n2"></div>
        </div>

        {/* Header */}
        <div className="archive-header">
          <div className="archive-header-left">
            <h2 className="archive-title">Full Project Archive</h2>
            <p className="archive-subtitle">A deep dive into everything I've built and engineered.</p>
          </div>
          <button 
            className="archive-close" 
            onClick={onClose}
            aria-label="Close archive"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Categories & Grid */}
        <div className="archive-body">
          {categories.map((cat) => {
            const catProjects = projectsData.projects.filter(p => p.category === cat.id);
            if (catProjects.length === 0) return null;

            return (
              <div key={cat.id} className="archive-section">
                <h3 className="archive-section-title">{cat.label}</h3>
                <div className="archive-grid">
                  {catProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="archive-card"
                      onClick={onClose}
                    >
                      <div className="archive-card-header">
                        <h4 className="archive-card-title">{project.title}</h4>
                                                <img src={NavArrow} alt="" className="archive-card-arrow" loading="lazy" decoding="async" width="14" height="22" />
                      </div>
                      <p className="archive-card-description">{project.shortDescription}</p>
                      <div className="archive-card-stack">
                        {project.stack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="archive-stack-tag">{tech}</span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="archive-stack-more">+{project.stack.length - 3}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(ArchiveOverlay);
