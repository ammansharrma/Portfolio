import { useEffect, useRef, memo } from 'react';
import './InteractiveBubble.css';

function InteractiveBubble() {
  const interRef1 = useRef(null);
  const interRef2 = useRef(null);
  const interRef3 = useRef(null);
  const rafRef = useRef(null);
  const tg = useRef({ x: 0, y: 0 });
  const cur1 = useRef({ x: 0, y: 0 });
  const cur2 = useRef({ x: 0, y: 0 });
  const cur3 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const inter1 = interRef1.current;
    const inter2 = interRef2.current;
    const inter3 = interRef3.current;
    if (!inter1 || !inter2 || !inter3) return;

    function move() {
      cur1.current.x += (tg.current.x - cur1.current.x) / 20;
      cur1.current.y += (tg.current.y - cur1.current.y) / 20;
      inter1.style.transform = `translate(${Math.round(cur1.current.x)}px, ${Math.round(cur1.current.y)}px)`;

      cur2.current.x += (tg.current.x - cur2.current.x) / 15;
      cur2.current.y += (tg.current.y - cur2.current.y) / 15;
      inter2.style.transform = `translate(${Math.round(cur2.current.x)}px, ${Math.round(cur2.current.y)}px)`;

      cur3.current.x += (tg.current.x - cur3.current.x) / 25;
      cur3.current.y += (tg.current.y - cur3.current.y) / 25;
      inter3.style.transform = `translate(${Math.round(cur3.current.x)}px, ${Math.round(cur3.current.y)}px)`;

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
      // Nudge the target slightly based on scroll to make it feel reactive
      // This is especially good for mobile momentum scrolling
      // We don't change the actual X/Y, but the inertia will feel better
      tg.current.y += 0.5; // Subtle nudge
      setTimeout(() => { tg.current.y -= 0.5; }, 50);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    
    rafRef.current = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="gradient-bg" aria-hidden="true">
      <div className="gradients-container">
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />
        <div className="g6" />
        <div className="g7" />
        <div ref={interRef1} className="interactive" />
        <div ref={interRef2} className="interactive" />
        <div ref={interRef3} className="interactive" />
      </div>
    </div>
  );
}

export default memo(InteractiveBubble)
