import DirectionArrow from './DirectionArrow';
import { Link } from 'react-router-dom';
import { getProjectNeighbors, projectPath } from '../data/projectNavigation';
import './ProjectNavPanel.css';

export default function ProjectNavPanel({ currentId, company, projects }) {
  const neighbors = getProjectNeighbors(projects, currentId);
  if (!neighbors) return null;
  return <nav className="project-nav-panel" aria-label="Project navigation">
    <div className="project-nav-heading"><span>Keep exploring</span><span>{String(neighbors.index + 1).padStart(2, '0')} / {String(neighbors.total).padStart(2, '0')}</span></div>
    <div className="project-nav-grid">
      <Link to={projectPath(neighbors.previous.id, company)} className="project-nav-link"><span><DirectionArrow direction="left" /> Previous project</span><strong>{neighbors.previous.title}</strong></Link>
      <Link to={projectPath(neighbors.next.id, company)} className="project-nav-link project-nav-next"><span>Next project <DirectionArrow direction="right" /></span><strong>{neighbors.next.title}</strong></Link>
    </div>
  </nav>;
}
