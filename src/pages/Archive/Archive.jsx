import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Archive.css';
import IdentityGlyph from '../../components/IdentityGlyph';
import projectsData from '../../data/projects.json';

const CATEGORIES = [
  { id: 'featured', label: 'Featured Systems' },
  { id: 'core', label: 'Core Exploration' },
  { id: 'archived', label: 'Legacy Archives' },
  { id: 'experiment', label: 'Experiments & Labs' },
  { id: 'frontend', label: 'Frontend Engineering' },
];

function Archive() {
  const [previewProject, setPreviewProject] = useState(null);

  return (
    <div className="archive-page section-shell" id="archive">
      <div className="section-shell-inner archive-layout">
        <Link to="/" className="archive-back link-row-item">
          ← Home
        </Link>

        <h1 className="section-label archive-title">Full Archive</h1>

        <div className="archive-columns">
          <div className="archive-lists">
            {CATEGORIES.map((category) => {
              const categoryProjects = projectsData.projects.filter(
                (project) => project.category === category.id
              );
              if (categoryProjects.length === 0) return null;

              return (
                <div key={category.id} className="archive-category">
                  <h2 className="section-label archive-category-label">{category.label}</h2>
                  <div className="index-list">
                    {categoryProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="index-row"
                        onMouseEnter={() => setPreviewProject(project)}
                        onFocus={() => setPreviewProject(project)}
                        onMouseLeave={() => setPreviewProject(null)}
                        onBlur={() => setPreviewProject(null)}
                      >
                        <IdentityGlyph projectId={project.id} size={28} className="index-row-glyph" />
                        <span className="index-row-title">{project.title}</span>
                        <span className="index-row-desc">{project.shortDescription}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="archive-preview-rail" aria-hidden="true">
            {previewProject && (
              <>
                <IdentityGlyph projectId={previewProject.id} size={144} />
                <p className="archive-preview-title">{previewProject.title}</p>
                <p className="archive-preview-desc">{previewProject.shortDescription}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Archive);
