import DirectionArrow from '../../components/DirectionArrow';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import companies from '../../data/experience/projects.json';
import diagrams from '../../data/architecture.json';
import { projectPath } from '../../data/projectNavigation';
import './CompanyExperience.css';

export default function CompanyExperience({ company }) {
  const experience = companies[company];
  useEffect(() => { document.title = `${experience.name} experience — Aamaan Sharrma`; }, [experience]);
  return <main className="company-experience">
    <div className="company-experience-container">
      <header className="company-experience-header">
        <Link to="/#experience" className="company-back"><DirectionArrow direction="left" /> Back to experience</Link>
        <p className="company-duration">{experience.duration}</p>
        <h1>{experience.name}</h1><h2>{experience.role}</h2>
        <p className="company-summary">{experience.summary}</p>
        <a href={experience.website} target="_blank" rel="noopener noreferrer" className="company-website">Visit company <DirectionArrow /></a>
      </header>
      <div className="company-work-heading"><h2>Selected work</h2><span>{String(experience.projects.length).padStart(2, '0')} projects</span></div>
      <div className="company-work-grid">
        {experience.projects.map((project, index) => (
          <Link className="company-work-card" to={projectPath(project.id, company)} key={project.id}>
            <div className="company-work-meta"><span>{project.status}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="company-work-preview" aria-hidden="true">
              {diagrams[project.diagram].nodes.slice(0, 3).map(node => <div key={node.id}>
                {node.icon ? <img src={`${import.meta.env.BASE_URL}architecture/icons/${node.icon}.${node.icon === 'firebase' ? 'png' : 'svg'}`} className={['github', 'express'].includes(node.icon) ? 'company-monochrome' : undefined} alt="" loading="lazy" /> : <span className="company-preview-role">{node.role}</span>}
                <span>{node.title}</span>
              </div>)}
            </div>
            <h3>{project.title}</h3><p>{project.shortDescription}</p>
            <div className="company-work-tags">{project.stack.slice(0, 4).map(tech => <span key={tech}>{tech}</span>)}</div>
            <span className="company-work-link">View project <DirectionArrow /></span>
          </Link>
        ))}
      </div>
    </div>
  </main>;
}
