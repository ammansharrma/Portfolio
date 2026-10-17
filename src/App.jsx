import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  return <><Hero /><div className="home-sections"><div className="home-reveal"><div className="home-content-surface"><div className="experience-project-flow"><ExperienceSection /><Projects /></div><SkillsMinimal /><About /></div><Contact /></div></div></>;
}

function RoutePosition() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let frame;
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep malformed hashes harmless. */ }
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'instant' });
        else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    } else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
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
