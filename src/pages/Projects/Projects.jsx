import { memo, useState } from 'react';
import './Projects.css';
import ProjectCard from '../../components/ProjectCard';
import ArchiveOverlay from '../../components/ArchiveOverlay';
import projectsData from '../../data/projects.json';
import NavArrow from '../../assets/Nav-Arrow.webp';

function Projects() {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Show first 3 projects (VidhaanAI, Stock Predictor, Ideation)
  const displayedProjects = projectsData.projects.slice(0, 3);

  return (
    <>
      <div className="projects-page page-container" id="projects">
        <div className="projects-header">
          <h1 className="projects-title">PROJECTS</h1>
          <p className="projects-subtitle">Things I build to learn, experiment, and ship</p>
        </div>

        <div className="projects-grid">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="projects-cta">
          <button 
            onClick={() => setIsArchiveOpen(true)} 
            className="projects-link"
          >
            View Full Project Archive
            <img src={NavArrow} alt="" className="archive-button-arrow" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      <ArchiveOverlay 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
      />
    </>
  );
}

export default memo(Projects);
