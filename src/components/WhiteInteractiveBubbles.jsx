import { useEffect, useRef } from 'react';
import './WhiteInteractiveBubbles.css';

export default function WhiteInteractiveBubbles() {
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

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="white-bubbles-bg" aria-hidden="true">
      <div className="white-bubbles-container">
        <div ref={interRef1} className="white-interactive-bubble" />
        <div ref={interRef2} className="white-interactive-bubble" />
        <div ref={interRef3} className="white-interactive-bubble" />
      </div>
    </div>
  );
}
