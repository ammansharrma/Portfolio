import { memo } from 'react';
import './CloudShapes.css';

function InteractiveBubble() {
  return <div className="gradient-bg" aria-hidden="true">
    {Array.from({ length: 7 }, (_, index) => <div className={`cloud cloud-${index + 1}`} key={index} />)}
  </div>;
}

export default memo(InteractiveBubble);
