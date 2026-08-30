import { memo, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import './NavRail.css';

const SECTIONS = [
  { id: 'hero', code: '00', label: 'Home' },
  { id: 'about', code: '01', label: 'About' },
  { id: 'experience', code: '02', label: 'Experience' },
  { id: 'projects', code: '03', label: 'Work' },
  { id: 'skills-minimal', code: '04', label: 'Skills' },
  { id: 'contact', code: '05', label: 'Contact' },
];

const springHover = { type: 'spring', stiffness: 420, damping: 24 };

function useMagnetic(strength, reduceMotion) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  if (reduceMotion) {
    return { ref, style: {}, onMouseMove: undefined, onMouseLeave: undefined };
  }

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
}

function RailDot({ section, isActive, onNavigate, reduceMotion }) {
  const magnetic = useMagnetic(0.3, reduceMotion);

  return (
    <motion.button
      ref={magnetic.ref}
      type="button"
      className={`rail-dot-btn ${isActive ? 'is-active' : ''}`}
      aria-label={`${section.code}, ${section.label}`}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onNavigate(section.id)}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      style={magnetic.style}
    >
      <motion.span
        className={`rail-mark ${isActive ? 'is-filled' : 'is-hollow'}`}
        whileHover={reduceMotion ? undefined : { scale: 1.4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.85 }}
        transition={springHover}
      />
      <span className="rail-label font-mono">{section.code}</span>
      <span className="rail-tooltip font-mono">{section.label}</span>
    </motion.button>
  );
}

function NavRail() {
  const [activeId, setActiveId] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const observerRef = useRef(null);

  const onHomeRoute = location.pathname === '/';

  useEffect(() => {
    if (!onHomeRoute) return undefined;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-15% 0px -55% 0px' }
    );

    // Sections below the fold are lazy-loaded, so they may not exist in the
    // DOM yet at mount time. Poll briefly and observe each as it appears.
    const observedIds = new Set();
    const observeAvailable = () => {
      SECTIONS.forEach((section) => {
        if (observedIds.has(section.id)) return;
        const el = document.getElementById(section.id);
        if (el) {
          observerRef.current.observe(el);
          observedIds.add(section.id);
        }
      });
      return observedIds.size === SECTIONS.length;
    };

    if (!observeAvailable()) {
      const pollId = window.setInterval(() => {
        if (observeAvailable()) window.clearInterval(pollId);
      }, 200);
      return () => {
        window.clearInterval(pollId);
        observerRef.current?.disconnect();
      };
    }

    return () => observerRef.current?.disconnect();
  }, [onHomeRoute]);

  const handleNavigate = (id) => {
    setMobileOpen(false);
    if (!onHomeRoute) {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className="nav-rail" aria-label="Section navigation">
        <Link to="/" className="rail-mark-brand font-display" aria-label="Aamaan Ssanjay Sharrma, home">
          A
        </Link>
        <div className="rail-list">
          {SECTIONS.map((section) => (
            <RailDot
              key={section.id}
              section={section}
              isActive={onHomeRoute && activeId === section.id}
              onNavigate={handleNavigate}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </nav>

      <div className="rail-mobile">
        <button
          type="button"
          className="rail-mobile-glyph"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {SECTIONS.slice(0, 4).map((section) => (
            <span
              key={section.id}
              className={`glyph-mark ${onHomeRoute && activeId === section.id ? 'is-filled' : 'is-hollow'}`}
            />
          ))}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="rail-mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.ul
                className="rail-mobile-sheet"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={`rail-mobile-item ${onHomeRoute && activeId === section.id ? 'is-active' : ''}`}
                      onClick={() => handleNavigate(section.id)}
                    >
                      <span
                        className={`rail-mark ${onHomeRoute && activeId === section.id ? 'is-filled' : 'is-hollow'}`}
                      />
                      <span className="rail-mobile-code font-mono">{section.code}</span>
                      <span className="rail-mobile-label">{section.label}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default memo(NavRail);
