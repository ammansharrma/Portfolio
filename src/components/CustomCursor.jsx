import { useEffect, useRef, memo } from 'react';
import './CustomCursor.css';

function CustomCursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    function animate() {
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.15;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.15;

      cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}

export default memo(CustomCursor)
