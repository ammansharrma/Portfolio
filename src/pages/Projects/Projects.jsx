import { memo } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import IdentityGlyph from '../../components/IdentityGlyph';
import projectsData from '../../data/projects.json';

function Projects() {
  // Show first 3 projects (VidhaanAI, Stock Predictor, Ideation)
  const displayedProjects = projectsData.projects.slice(0, 3);

  return (
    <section className="projects-page section-shell" id="projects">
        <div className="section-shell-inner">
          <h2 className="section-label">Case Studies</h2>

          <div className="index-list">
            {displayedProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="index-row">
                <IdentityGlyph
                  projectId={project.id}
                  layoutId={`glyph-${project.id}`}
                  size={28}
                  className="index-row-glyph"
                />
                <span className="index-row-title">{project.title}</span>
                <span className="index-row-desc">{project.shortDescription}</span>
                {project.isBuilding && (
                  <span className="index-row-status">
                    active development<span className="status-cursor">▮</span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          <Link to="/archive" className="link-row-item projects-archive-link">
            View full project archive
          </Link>
        </div>
      </section>
  );
}

export default memo(Projects);
