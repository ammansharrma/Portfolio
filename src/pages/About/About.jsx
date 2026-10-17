import MotionVideo from '../../components/MotionVideo';
import { memo } from 'react';
import './About.css';
import HelloGif from '../../assets/GIFs/Hello.webm';

function About() {
  return <section className="about-page page-container" id="about" aria-labelledby="about-heading">
    <div className="about-layout"><div className="about-left"><h2 className="about-title" id="about-heading">ABOUT ME</h2></div>
      <div className="about-right"><div className="about-greeting">Hello <MotionVideo src={HelloGif} className="hello-gif" autoPlay loop muted playsInline width="48" height="48" aria-hidden="true" /></div>
        <div className="about-content">
          <p className="about-text">I'm Aamaan, a software developer based in Pune. At Mindstix, I work across AI agents, backend systems, and product interfaces, translating business requirements into software and supporting it in production.</p>
          <p className="about-text">I enjoy the work between a promising idea and a dependable product: understanding the workflow, connecting the systems, and debugging the details. Outside work, I build VidhaanAI to explore retrieval, conversation memory, and multi-agent coordination.</p>
          <div className="about-section"><h3 className="about-section-title">How I build</h3><ul className="about-principles"><li>Start with the business problem and the people using the system.</li><li>Make failures visible and investigate them with evidence.</li><li>Measure improvements against a clear baseline.</li></ul></div>
          <p className="about-text">Outside engineering, I explore financial systems and product strategy.</p>
        </div>
      </div>
    </div>
  </section>;
}
export default memo(About);
