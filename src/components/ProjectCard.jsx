import { memo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';
import TopRightArrow from '../assets/Arrow-top-right.webp';

function ProjectCard({ project }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !videoLoaded) {
      // Lazy load video on first hover
      videoRef.current.load();
      setVideoLoaded(true);
    }
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link 
      to={`/projects/${project.id}`}
      className="project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`View ${project.title} project details`}
    >
      <div className="project-image-container">
        {/* Thumbnail (always visible) */}
        <div 
          className="project-thumbnail"
          style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}${project.thumbnail})`,
            opacity: isHovered && videoLoaded ? 0 : 1
          }}
        />
        
        {/* Video (visible on hover, desktop only) */}
        {project.heroVideo && (
          <video
            ref={videoRef}
            className="project-video"
            muted
            loop
            playsInline
            preload="none"
            style={{ opacity: isHovered && videoLoaded ? 1 : 0 }}
          >
            <source src={`${import.meta.env.BASE_URL}${project.heroVideo}`} type="video/mp4" />
          </video>
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
