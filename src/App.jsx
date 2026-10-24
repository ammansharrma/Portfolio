import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Hero from './pages/Hero/Hero';
import CustomCursor from './components/CustomCursor';
import InteractiveBubble from './components/InteractiveBubble';
import ProjectTransition from './components/ProjectTransition';
import MainLogo from './components/MainLogo';
import './App.css';
import './pages/HomeSurface.css';

const About = lazy(() => import('./pages/About/About'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ExperienceSection = lazy(() => import('./pages/ExperienceSection/ExperienceSection'));
const SkillsMinimal = lazy(() => import('./pages/SkillsMinimal/SkillsMinimal'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const Mindstix = lazy(() => import('./pages/Experience/Mindstix/Mindstix'));
const OmneVu = lazy(() => import('./pages/Experience/OmneVu/OmneVu'));

function HomePage() {
  return <><Hero /><Suspense fallback={<div className="home-sections" style={{ minHeight: '200vh' }} />}><div className="home-sections"><div className="home-reveal"><div className="home-content-surface"><div className="experience-project-flow"><ExperienceSection /><Projects /></div><SkillsMinimal /><About /></div><Contact /></div></div></Suspense></>;
}

const routeScrollPositions = new Map();
function RoutePosition() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    // Keep old bookmarked anchors working, but use clean URLs for navigation.
    if (location.hash) {
      let section = location.hash.slice(1);
      try { section = decodeURIComponent(section); } catch { /* Invalid escape: keep literal ID. */ }
      if (section === 'project') section = 'projects';
      navigate(`${location.pathname}${location.search}`, { replace: true, state: { ...location.state, scrollTo: section } });
      return;
    }
    const saved = navigationType === 'POP' ? routeScrollPositions.get(location.key) : undefined;
    const section = location.state?.scrollTo;
    let frame;
    let finished = false;
    let lastY = saved ?? 0;
    const observer = new MutationObserver(schedule);
    const settle = () => {
      if (finished) return;
      let y = saved;
      if (y === undefined && section) {
        const target = document.getElementById(section);
        if (!target) return;
        y = target.getBoundingClientRect().top + window.scrollY;
        if (section === 'projects' && location.state?.projectId) {
          const slides = [...target.querySelectorAll('[data-project-id]')];
          const index = slides.findIndex(slide => slide.dataset.projectId === location.state.projectId);
          const runway = target.querySelector('.project-slider-runway');
          const viewport = target.querySelector('.project-slider-viewport');
          if (index >= 0 && runway && viewport) y = runway.getBoundingClientRect().top + window.scrollY + index * (runway.offsetHeight - viewport.offsetHeight) / Math.max(1, slides.length - 1);
        }
      }
      if (y !== undefined && document.documentElement.scrollHeight - window.innerHeight < y - 2) return;
      finished = true;
      observer.disconnect();
      window.scrollTo({ top: y ?? 0, left: 0, behavior: 'instant' });
      lastY = window.scrollY;
    };
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(settle); }
    const remember = () => { if (finished) lastY = window.scrollY; };
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', remember, { passive: true });
    schedule();
    return () => {
      routeScrollPositions.set(location.key, lastY);
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', remember);
    };
  }, [location, navigate, navigationType]);
  return null;
}

function HomeMetadata() {
  useEffect(() => { document.title = 'Aamaan Ssanjay Sharrma — Software Developer'; }, []);
  return <HomePage />;
}

function NotFound() {
  useEffect(() => { document.title = 'Page not found — Aamaan Sharrma'; }, []);
  return <main className="route-message"><h1>Page not found</h1><p>This page may have moved.</p><Link to="/">Back to home</Link></main>;
}

export default function App() {
  return <Router basename={import.meta.env.BASE_URL}>
    <div className="app">
      <ProjectTransition />
      <InteractiveBubble />
      <CustomCursor />
      <nav className="navbar" aria-label="Home"><div className="navbar-content">
        <Link to="/" className="logo-container" aria-label="Aamaan Sharrma — home">
          <div className="logo"><MainLogo /></div>
          <div className="logo-name" aria-hidden="true">{' Sharrma'.split('').map((letter, index) => <span key={index} className="logo-letter" style={{ '--letter-index': index }}>{letter}</span>)}</div>
        </Link>
      </div></nav>
      <div className="pages-container">
        <Suspense fallback={<div className="route-message" role="status">Loading…</div>}>
          <RoutePosition />
          <Routes>
            <Route path="/" element={<HomeMetadata />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/experience/:company/projects/:id" element={<ProjectDetail />} />
            <Route path="/experience/mindstix" element={<Mindstix />} />
            <Route path="/experience/omnevu" element={<OmneVu />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  </Router>;
}
