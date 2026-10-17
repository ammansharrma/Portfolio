import { useEffect, useRef, useState, memo } from 'react';
import './WhiteBubble.css';

function WhiteBubble() {
  const bubbleRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const tg = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function move() {
      if (motion.matches || document.hidden) { rafRef.current = null; return; }
      cur.current.x += (tg.current.x - cur.current.x) / 20;
      cur.current.y += (tg.current.y - cur.current.y) / 20;
      bubble.style.transform = `translate3d(${Math.round(cur.current.x)}px, ${Math.round(cur.current.y)}px, 0)`;
      rafRef.current = requestAnimationFrame(move);
    }

    function onMouseMove(e) {
      tg.current.x = e.clientX;
      tg.current.y = e.clientY;
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        tg.current.x = e.touches[0].clientX;
        tg.current.y = e.touches[0].clientY;
      }
    }

    function onScroll() {
      // Subtle nudge for scroll momentum
      tg.current.y += 0.4;
      setTimeout(() => { tg.current.y -= 0.4; }, 40);
    }

    function resume() { if (!rafRef.current) rafRef.current = requestAnimationFrame(move); }
    motion.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    
    rafRef.current = requestAnimationFrame(move);

    return () => {
      motion.removeEventListener('change', resume);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`white-bubble-container ${isVisible ? 'visible' : ''}`} 
      aria-hidden="true"
    >
      <div ref={bubbleRef} className="white-bubble" />
    </div>
  );
}

export default memo(WhiteBubble)
