import { useEffect, useRef, useState, memo } from 'react';
import { createPortal } from 'react-dom';
import './CustomCursor.css';

function CustomCursor() {
  const cursorRef = useRef(null);
  const position = useRef({ x: -100, y: -100 });
  const [host, setHost] = useState(document.body);

  useEffect(() => {
    // Modal dialogs and fullscreen elements sit above every normal z-index.
    const syncHost = () => {
      const dialogs = [...document.querySelectorAll('dialog[open]')];
      setHost(dialogs.at(-1) || document.fullscreenElement || document.body);
    };
    const observer = new MutationObserver(syncHost);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
    document.addEventListener('fullscreenchange', syncHost);
    syncHost();
    return () => {
      observer.disconnect();
      document.removeEventListener('fullscreenchange', syncHost);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
    let frame;
    function updateColor() {
      frame = undefined;
      let element = document.elementFromPoint(position.current.x, position.current.y);
      let lightSurface = false;
      // Experience rows paint their beige hover surface with a pseudo-element.
      if (element?.closest('.experience-row:hover')) lightSurface = true;
      else {
        while (element) {
          const channels = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
          if (channels?.length >= 3 && (channels[3] ?? 1) > .5) {
            lightSurface = (.2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]) > 160;
            break;
          }
          element = element.parentElement;
        }
      }
      cursor.style.backgroundColor = lightSurface ? 'var(--theme-surface)' : 'var(--theme-accent)';
    }
    function scheduleColor() {
      if (frame === undefined) frame = requestAnimationFrame(updateColor);
    }
    scheduleColor();

    function onMouseMove(e) {
      position.current = { x: e.clientX, y: e.clientY };
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      scheduleColor();
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', scheduleColor, { passive: true, capture: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', scheduleColor, true);
      cancelAnimationFrame(frame);
    };
  }, [host]);

  return createPortal(<div ref={cursorRef} className="custom-cursor" aria-hidden="true" />, host);
}

export default memo(CustomCursor)
