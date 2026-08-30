import { memo } from 'react';
import { motion } from 'motion/react';
import './IdentityGlyph.css';

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function IdentityGlyph({ projectId, layoutId, size = 28, className = '' }) {
  const hash = hashString(projectId);
  const cells = Array.from({ length: 25 }, (_, i) => (hash >> i) & 1);

  return (
    <motion.div
      layoutId={layoutId}
      className={`identity-glyph ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {cells.map((filled, i) => (
        <span key={i} className={filled ? 'is-filled' : 'is-empty'} />
      ))}
    </motion.div>
  );
}

export default memo(IdentityGlyph);
