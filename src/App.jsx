import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './pages/Hero/Hero';
import CustomCursor from './components/CustomCursor';
import WhiteBubble from './components/WhiteBubble';
import LoadingScreen from './components/LoadingScreen';
import MainLogo from './components/MainLogo';
import './App.css';

// Lazy load below-the-fold components
const About = lazy(() => import('./pages/About/About'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const SkillsMinimal = lazy(() => import('./pages/SkillsMinimal/SkillsMinimal'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const Mindstix = lazy(() => import('./pages/Experience/Mindstix/Mindstix'));
const OmneVu = lazy(() => import('./pages/Experience/OmneVu/OmneVu'));

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <About />
        <Projects />
        <SkillsMinimal />
        <Contact />
      </Suspense>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Scroll to top after loading completes
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  };

  useEffect(() => {
    // Ensure page starts at top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      <div className="app">
        <CustomCursor />
        <WhiteBubble />
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/" className="logo-container">
              <div className="logo">
                <MainLogo />
              </div>
              <div className="logo-name">
                {'amaan Ssanjay Sharrma'.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className="logo-letter"
                    style={{ '--letter-index': index }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        </nav>
        
        <div className="pages-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/projects/:id" 
              element={
                <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000316' }} />}>
                  <ProjectDetail />
                </Suspense>
              } 
            />
            <Route 
              path="/experience/mindstix" 
              element={
                <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000316' }} />}>
                  <Mindstix />
                </Suspense>
              } 
            />
            <Route 
              path="/experience/omnevu" 
              element={
                <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000316' }} />}>
                  <OmneVu />
                </Suspense>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
