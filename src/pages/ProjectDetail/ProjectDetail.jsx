import DirectionArrow from '../../components/DirectionArrow';
import ProjectVideo from '../../components/ProjectVideo';
import { memo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';
import './ProjectCaseStudy.css';
import companies from '../../data/experience/projects.json';
import { getProjectCollection } from '../../data/projectNavigation';
import ArchitectureDiagram from '../../components/ArchitectureDiagram';
import ProjectNavPanel from '../../components/ProjectNavPanel';
import projectsData from '../../data/projects.json';

function ProjectDetail() {
  const { id, company } = useParams();
  const collection = getProjectCollection(projectsData.projects, companies, company);
  const project = collection.find(p => p.id === id);
  const backPath = company && companies[company] ? `/experience/${company}` : "/";
  useEffect(() => {
    document.title = `${project?.title || 'Project not found'} â€” Aamaan Sharrma`;
  }, [project]);

  if (!project) {
    return (
      <div className="project-detail-error">
        <h1>Project Not Found</h1>
        <p>The project you're looking for doesn't exist.</p>
        <Link to="/" className="back-link"><DirectionArrow direction="left" /> Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page project-case-study">
      <div className="project-detail-container">
        <div className="project-detail-left">
          <div className="project-media-toolbar">
            <Link className="project-back" to={backPath} state={company ? undefined : { scrollTo: 'projects', projectId: id }}
              aria-label={company && companies[company] ? `Back to ${companies[company].name}` : 'Back to projects'}>
              <DirectionArrow direction="left" />
            </Link>
          </div>
          {(project.detailsVideo || project.heroVideo) ? <figure className="case-opening-media">
            <ProjectVideo key={id} title={project.title} src={`${import.meta.env.BASE_URL}${project.detailsVideo || project.heroVideo}`} />
          </figure> : project.mockups?.[0] ? <figure className="case-opening-media">
            <img src={`${import.meta.env.BASE_URL}${project.mockups[0]}`} alt={`${project.title} overview`} loading="eager" decoding="async" />
          </figure> : project.thumbnail ? <figure className="case-opening-media">
            <img src={`${import.meta.env.BASE_URL}${project.thumbnail}`} alt={`${project.title} overview`} loading="eager" />
          </figure> : null}
        </div>

        {/* Right Panel: Info (Scrollable) */}
        <div className="project-detail-right">
          <div className="project-detail-content">
            {/* Header */}
            <div className="detail-header">
              {project.status && <p className="detail-project-status">{project.status}</p>}
              <h1 className="detail-title">{project.title}</h1>
              <p className="detail-subtitle">{project.shortDescription}</p>
            </div>
            <dl className="case-facts">
              {company && companies[company] && <div><dt>My role</dt><dd>{companies[company].role}</dd></div>}
              {company && companies[company] && <div><dt>Company</dt><dd>{companies[company].name}</dd></div>}
              {project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}
              <div><dt>Focus</dt><dd>{project.stack.slice(0, 3).join(' · ')}</dd></div>
            </dl>
            {/* Stack Tags */}
            <div className="detail-section">
              <h2 className="section-label">Built with</h2>
              <div className="detail-stack">
                {project.stack.map((tech, idx) => (
                  <span key={idx} className="detail-stack-tag">{tech}</span>
                ))}
              </div>
            </div>

            {/* Problem */}
            <div className="detail-section">
              <h2 className="section-label">The challenge</h2>
              <p className="section-text">{project.problem}</p>
            </div>

            {/* Solution */}
            <div className="detail-section">
              <h2 className="section-label">What I built</h2>
              <p className="section-text">{project.solution}</p>
            </div>

            {project.mockups?.[0] && (project.detailsVideo || project.heroVideo) && <figure className="case-inline-media">
              <img src={`${import.meta.env.BASE_URL}${project.mockups[0]}`} alt={`${project.title} interface overview`} loading="lazy" decoding="async" />
              <figcaption>{project.title} / Overview</figcaption>
            </figure>}
            {project.mockups?.[1] && <figure className="case-inline-media">
              <img src={`${import.meta.env.BASE_URL}${project.mockups[1]}`} alt={`${project.title} interface — screenshot 2`} loading="lazy" decoding="async" />
              <figcaption>{project.title} · Product interface</figcaption>
            </figure>}
            {/* Architecture */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="detail-section">
                <h2 className="section-label">How it works</h2>
                <ul className="section-list">
                  {project.architecture.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="case-architecture">
              <ArchitectureDiagram key={`case-${company || 'personal'}-${id}`} projectId={project.diagram || project.id} />
            </div>
            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="detail-section">
                <h2 className="section-label">Results & highlights</h2>
                <ul className="section-list highlights-list">
                  {project.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.mockups?.length > 2 && <div className="case-gallery">
              {project.mockups.slice(2).map((src, index) => <figure key={src}>
                <img src={`${import.meta.env.BASE_URL}${src}`} alt={`${project.title} interface — screenshot ${index + 3}`} loading="lazy" decoding="async" />
                <figcaption>{project.title} · View {index + 3}</figcaption>
              </figure>)}
            </div>}
            {/* Learnings */}
            {project.learnings && project.learnings.length > 0 && (
              <div className="detail-section">
                <h2 className="section-label">What I learned</h2>
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
                    href={project.githubDisabled ? undefined : project.github}
                    aria-disabled={project.githubDisabled || undefined}
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
                    {project.githubDisabled ? "Source not public" : "View Code"}
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
      <ProjectNavPanel currentId={id} company={company} projects={collection} />
    </div>
  );
}

export default memo(ProjectDetail);
