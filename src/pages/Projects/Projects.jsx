import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import './ProjectStack.css';
import ProjectPreview from '../../components/ProjectPreview';
import DirectionArrow from '../../components/DirectionArrow';
import projectsData from '../../data/projects.json';

const projects = projectsData.projects;
const scrollPerSlide = 1.35;
function Projects() {
  const runway = useRef(null);
  const viewport = useRef(null);
  const slides = useRef([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame;
    let displayedProgress;
    let lastTime;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (time) => {
      frame = undefined;
      const height = viewport.current.offsetHeight;
      const travelled = -runway.current.getBoundingClientRect().top;
      const target = Math.max(0, Math.min(projects.length - 1, travelled / (height * scrollPerSlide)));
      const reduced = motion.matches;
      const elapsed = lastTime === undefined ? 16 : Math.min(time - lastTime, 64);
      lastTime = time;
      // Brief, frame-rate-independent smoothing absorbs wheel steps without hijacking scrolling.
      if (displayedProgress === undefined || reduced || travelled <= 0 || travelled >= (projects.length - 1) * height * scrollPerSlide) displayedProgress = target;
      else displayedProgress += (target - displayedProgress) * (1 - Math.exp(-elapsed / 110));
      if (Math.abs(target - displayedProgress) < .0005) displayedProgress = target;
      const progress = displayedProgress;
      const selected = Math.round(progress);
      setActive(selected);
      slides.current.forEach((slide, index) => {
        const entrance = Math.max(0, Math.min(1, progress - index + 1));
        const offset = index === 0 ? 0 : reduced ? (index <= selected ? 0 : 100) : (1 - entrance) * 100;
        slide.style.transform = `translate3d(0, ${offset}%, 0)`;
        const contentInView = index === 0 ? travelled >= -height * .4 : entrance >= .65;
        slide.classList.toggle('is-revealed', reduced || contentInView);
      });
      if (displayedProgress !== target) frame = requestAnimationFrame(update);
      else lastTime = undefined;
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); motion.removeEventListener('change', schedule); };
  }, []);
  return <section className="projects-page page-container editorial-projects" id="projects" aria-label="Selected projects">
    <div ref={runway} className="project-slider-runway" style={{ '--slide-count': 1 + (projects.length - 1) * scrollPerSlide }}>
      <div ref={viewport} className="project-slider-viewport" role="region" aria-roledescription="carousel" aria-label="Project showcase">
        <div className="project-slider-track">
          {projects.map((project, index) => <article data-project-id={project.id} key={project.id} ref={element => { slides.current[index] = element; }} style={{ zIndex: index + 1 }} className={`project-slide ${active === index ? 'is-active' : ''}`} aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.title}`} aria-hidden={active !== index} inert={active !== index ? '' : undefined}>
            <div className="project-panel-media"><ProjectPreview project={project} fill /></div>
            <div className="project-panel-caption">
              <span className="project-panel-number">{project.stack.slice(0, 2).join(' / ')}</span>
              <h2>{project.title}</h2>
              <Link to={`/projects/${project.id}`} className="project-slide-action" aria-label={`See project: ${project.title}`}>See project <DirectionArrow /></Link>
            </div>
          </article>)}
        </div>
        <div className="project-slider-counter" aria-live="polite" aria-atomic="true">
          <span>{active + 1}</span><span aria-hidden="true">/</span><span>{projects.length}</span>
        </div>
      </div>
    </div>

  </section>;
}
export default memo(Projects);
