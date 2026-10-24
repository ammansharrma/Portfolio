import MotionVideo from '../../components/MotionVideo';
import { memo, useEffect, useRef } from 'react';
import './About.css';
import HelloGif from '../../assets/GIFs/Hello.webm';

const annotations = {
  'AI agents': 'circle',
  'dependable product': 'highlight',
  VidhaanAI: 'double',
  evidence: 'wave',
  'product strategy': 'highlight',
};
const annotationPattern = /(AI agents|dependable product|VidhaanAI|evidence|product strategy|\s+)/;

function RevealText({ children }) {
  return children.split(annotationPattern).filter(Boolean).map((word, index) => {
    if (/^\s+$/.test(word)) return word;
    const effect = annotations[word];
    return <span className={`about-reveal-word${effect ? ` about-marked-phrase about-mark-${effect}` : ''}`} key={index}>{word}
      {effect && effect !== 'highlight' && <svg className="about-annotation" viewBox={effect === 'circle' ? '0 0 240 90' : '0 0 240 24'} preserveAspectRatio="none" aria-hidden="true">
        {effect === 'circle' && <path pathLength="1" d="M213 19C181 3 88 2 39 17C-1 29 2 60 42 72C85 85 175 82 211 66C246 50 240 26 203 16C164 5 85 8 45 22" />}
        {effect === 'double' && <><path pathLength="1" d="M4 10 Q80 3 150 8 T235 6" /><path pathLength="1" d="M10 19 Q90 13 160 18 T229 16" /></>}
        {effect === 'wave' && <path pathLength="1" d="M3 13 Q13 2 23 13 T43 13 T63 13 T83 13 T103 13 T123 13 T143 13 T163 13 T183 13 T203 13 T223 13 T237 13" />}
      </svg>}
    </span>;
  });
}

function About() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    const blocks = [...section.querySelectorAll('[data-about-reveal]')].map(element => ({
      element, words: [...element.querySelectorAll('.about-reveal-word')],
    }));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    let disposed = false;
    let lines = [];
    const measure = () => {
      lines = [];
      for (const { words } of blocks) {
        let line;
        for (const word of words) {
          const top = word.offsetTop;
          if (!line || Math.abs(line.top - top) > 3) {
            line = { top, words: [] };
            lines.push(line);
          }
          line.words.push(word);
        }
      }
    };
    const update = () => {
      // Read all line geometry before writing styles to avoid layout thrashing.
      const progress = lines.map(line => {
        const rect = line.words[0].getBoundingClientRect();
        return reducedMotion.matches ? 1 : Math.max(0, Math.min(1,
          (window.innerHeight * .72 - rect.top) / Math.max(rect.height * 1.6, 48)));
      });
      lines.forEach((line, index) => line.words.forEach(word => {
        word.style.setProperty('--word-opacity', .3 + progress[index] * .7);
        word.classList.toggle('is-annotated', progress[index] >= .9);
      }));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const resize = () => { measure(); schedule(); };
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    reducedMotion.addEventListener('change', schedule);
    document.fonts.ready.then(() => { if (!disposed) resize(); });
    measure();
    update();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);
  return <section ref={sectionRef} className="about-page page-container" id="about" aria-labelledby="about-heading">
    <div className="about-layout"><div className="about-left"><h2 className="about-title" id="about-heading">ABOUT ME</h2></div>
      <div className="about-right"><div className="about-greeting">Hello <MotionVideo src={HelloGif} className="hello-gif" autoPlay loop muted playsInline width="48" height="48" aria-hidden="true" /></div>
        <div className="about-content">
          <p className="about-text" data-about-reveal><RevealText>I'm Aamaan, a software developer based in Pune. At Mindstix, I work across AI agents, backend systems, and product interfaces, translating business requirements into software and supporting it in production.</RevealText></p>
          <p className="about-text" data-about-reveal><RevealText>I enjoy the work between a promising idea and a dependable product: understanding the workflow, connecting the systems, and debugging the details. Outside work, I build VidhaanAI to explore retrieval, conversation memory, and multi-agent coordination.</RevealText></p>
          <div className="about-section"><h3 className="about-section-title">How I build</h3><ul className="about-principles"><li data-about-reveal><RevealText>Start with the business problem and the people using the system.</RevealText></li><li data-about-reveal><RevealText>Make failures visible and investigate them with evidence.</RevealText></li><li data-about-reveal><RevealText>Measure improvements against a clear baseline.</RevealText></li></ul></div>
          <p className="about-text" data-about-reveal><RevealText>Outside engineering, I explore financial systems and product strategy.</RevealText></p>
        </div>
      </div>
    </div>
  </section>;
}
export default memo(About);
