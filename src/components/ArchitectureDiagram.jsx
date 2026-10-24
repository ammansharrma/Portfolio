import DirectionArrow from './DirectionArrow';
import { useEffect, useId, useRef, useState } from 'react';
import diagrams from '../data/architecture.json';
import './ArchitectureDiagram.css';

const CARD_WIDTH = 220;
const CARD_HEIGHT = 130;
export const iconPath = icon => `${import.meta.env.BASE_URL}architecture/icons/${icon}.${icon === 'firebase' ? 'png' : 'svg'}`;

// Explicit project graphs, routed between component boundaries.
function connection(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dy === 0) {
    const start = from.x + (dx > 0 ? CARD_WIDTH : 0);
    const end = to.x + (dx > 0 ? 0 : CARD_WIDTH);
    const y = from.y + CARD_HEIGHT / 2;
    return { d: `M${start},${y} H${end}`, x: (start + end) / 2, y: y - 16 };
  }
  const startX = from.x + CARD_WIDTH / 2;
  const endX = to.x + CARD_WIDTH / 2;
  const startY = from.y + (dy > 0 ? CARD_HEIGHT : 0);
  const endY = to.y + (dy > 0 ? 0 : CARD_HEIGHT);
  const middle = (startY + endY) / 2;
  return { d: `M${startX},${startY} V${middle} H${endX} V${endY}`, x: (startX + endX) / 2, y: middle - 13 };
}

function DiagramCanvas({ diagram }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg className="architecture-canvas" viewBox={`0 0 890 ${diagram.height}`} role="img" aria-label={diagram.title}>
      <defs>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#f4ebdc" opacity=".14" /></pattern>
        <linearGradient id={`${uid}-surface`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1759b5" /><stop offset="1" stopColor="#064092" /></linearGradient>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="#f4ebdc" strokeWidth="1.5" /></marker>
      </defs>
      <rect width="890" height={diagram.height} fill={`url(#${uid}-grid)`} />
      <text x="45" y="42" className="architecture-map-label">SYSTEM OVERVIEW</text>
      <text x="845" y="42" textAnchor="end" className="architecture-map-label">{String(diagram.nodes.length).padStart(2, '0')} COMPONENTS</text>
      {diagram.edges.map((edge, index) => {
        const from = diagram.nodes.find(node => node.id === edge.from);
        const to = diagram.nodes.find(node => node.id === edge.to);
        const path = connection(from, to);
        return <g key={index} className="architecture-edge">
          <path d={path.d} fill="none" stroke="#d9c9ab" strokeWidth="1.8" strokeDasharray={edge.dependency ? '6 5' : undefined} markerEnd={`url(#${uid}-arrow)`} />
          <text x={path.x} y={path.y} textAnchor="middle" className="architecture-edge-label">
            {(from.y === to.y && edge.label.length > 12 ? edge.label.split(' ') : [edge.label]).map((line, lineIndex, lines) => <tspan key={lineIndex} x={path.x} dy={lineIndex === 0 ? -(lines.length - 1) * 13 : 13}>{line}</tspan>)}
          </text>
        </g>;
      })}
      {diagram.nodes.map(node => (
        <g key={node.id} transform={`translate(${node.x},${node.y})`} className="architecture-node">
          <title>{`${node.title}: ${node.subtitle}`}</title>
          <rect className="architecture-node-surface" width={CARD_WIDTH} height={CARD_HEIGHT} rx="13" fill={`url(#${uid}-surface)`} stroke="#a8bbd9" />
          <text x="18" y="25" className="architecture-node-role">{node.role.toUpperCase()}</text>
          {node.icon && <image href={iconPath(node.icon)} x="174" y="14" width="30" height="30" className={['github', 'express'].includes(node.icon) ? 'architecture-monochrome' : undefined} />}
          <text x="18" y="74" className="architecture-node-title">{node.title}</text>
          <text x="18" y="102" className="architecture-node-subtitle">{node.subtitle}</text>
        </g>
      ))}
    </svg>
  );
}

export default function ArchitectureDiagram({ projectId }) {
  const diagram = diagrams[projectId];
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null);
  const opener = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!expanded) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  }, [expanded]);
  if (!diagram) return null;
  const contents = <>
    <div className="architecture-viewport" tabIndex="0" role="region" aria-label="Architecture diagram. Scroll horizontally to explore.">
      <DiagramCanvas diagram={diagram} />
    </div>
  </>;
  return <figure className="architecture-diagram" aria-labelledby={titleId}>
    <figcaption className="architecture-heading"><div><span className="architecture-eyebrow">ARCHITECTURE</span><h2 id={titleId}>{diagram.title}</h2><p>{diagram.summary}</p></div></figcaption>
    <div className="architecture-toolbar"><button ref={opener} type="button" onClick={() => { dialog.current.showModal(); setExpanded(true); }}>Expand diagram <DirectionArrow /></button></div>
    {contents}
    <dialog ref={dialog} className="architecture-dialog" aria-label={`${diagram.title} — expanded diagram`} onClose={() => { setExpanded(false); opener.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="architecture-dialog-body"><header><h2>{diagram.title}</h2><button type="button" autoFocus onClick={() => dialog.current.close()}>Close ✕</button></header>{expanded && contents}</div>
    </dialog>
  </figure>;
}
