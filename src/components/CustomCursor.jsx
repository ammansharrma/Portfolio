import { useEffect, useRef, memo } from 'react';
import './CustomCursor.css';

function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    function onMouseMove(e) {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}

export default memo(CustomCursor)
