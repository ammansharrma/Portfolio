import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Hero from './pages/Hero/Hero';
import Loader from './components/Loader';
import NavRail from './components/NavRail';
import './App.css';

// Lazy load below-the-fold components
const About = lazy(() => import('./pages/About/About'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ExperienceSection = lazy(() => import('./pages/ExperienceSection/ExperienceSection'));
const SkillsMinimal = lazy(() => import('./pages/SkillsMinimal/SkillsMinimal'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const Archive = lazy(() => import('./pages/Archive/Archive'));
const Mindstix = lazy(() => import('./pages/Experience/Mindstix/Mindstix'));
const OmneVu = lazy(() => import('./pages/Experience/OmneVu/OmneVu'));

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <About />
        <ExperienceSection />
        <Projects />
        <SkillsMinimal />
        <Contact />
      </Suspense>
    </>
  );
}

function TransitionFlicker() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      key={location.pathname}
      className="transition-flicker"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0] }}
      transition={{ duration: 0.3, times: [0, 0.4, 1], ease: 'linear' }}
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} />
      ))}
    </motion.div>
  );
}

function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <div className="app">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="app-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="app-grain-overlay" />
      <TransitionFlicker />
      <Loader />
      <NavRail />

      <div className="pages-container">
        <AnimatePresence initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route
              path="/archive"
              element={
                <PageTransition>
                  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }} />}>
                    <Archive />
                  </Suspense>
                </PageTransition>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <PageTransition>
                  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }} />}>
                    <ProjectDetail />
                  </Suspense>
                </PageTransition>
              }
            />
            <Route
              path="/experience/mindstix"
              element={
                <PageTransition>
                  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }} />}>
                    <Mindstix />
                  </Suspense>
                </PageTransition>
              }
            />
            <Route
              path="/experience/omnevu"
              element={
                <PageTransition>
                  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }} />}>
                    <OmneVu />
                  </Suspense>
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppShell />
    </Router>
  );
}

export default App;
