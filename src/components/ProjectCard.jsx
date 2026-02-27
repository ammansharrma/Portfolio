import { memo } from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';
import TopRightArrow from '../assets/Arrow-top-right.webp';
import MonitorsTyping from '../assets/GIFs/monitors-typing.webm';

function ProjectCard({ project }) {

  return (
    <Link 
      to={`/projects/${project.id}`}
      className="project-card"
      aria-label={`View ${project.title} project details`}
    >
      <div className="project-image-container">
        {project.isBuilding ? (
          <div className="building-animation-container">
            <div className="building-icon-wrapper">
              <video 
                src={MonitorsTyping} 
                className="building-icon-video"
                autoPlay 
                loop 
                muted 
                playsInline
                width="48"
                height="48"
                style={{ opacity: 0.8 }}
              />
            </div>
            <div className="building-content">
              <div className="building-text">
                System in Development<span className="pulsing-cursor"></span>
              </div>
              <div className="building-subtext">Currently arguing with the compiler...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Thumbnail (fallback or while loading) */}
            <div 
              className="project-thumbnail"
              style={{ 
                backgroundImage: `url(${import.meta.env.BASE_URL}${project.thumbnail})`
              }}
            />
            
            {/* Video (plays automatically and continuously loops) */}
            {project.heroVideo && (
              <video
                className="project-video"
                muted
                loop
                autoPlay
                playsInline
              >
                <source src={`${import.meta.env.BASE_URL}${project.heroVideo}`} type="video/mp4" />
              </video>
            )}
          </>
        )}
      </div>

      <div className="project-footer">
        <p className="project-name">
          {project.title}
          <img 
            src={TopRightArrow} 
            alt="" 
            className="arrow-icon" 
            loading="lazy" 
            decoding="async" 
            width="18"
            height="18"
          />
        </p>
        <p className="project-description">{project.shortDescription}</p>
        
        {/* Stack Tags */}
        <div className="project-stack">
          {project.stack.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="stack-tag">{tech}</span>
          ))}
          {project.stack.length > 3 && (
            <span className="stack-tag stack-more">+{project.stack.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ProjectCard);
