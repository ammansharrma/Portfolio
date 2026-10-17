import { useState, useEffect, useRef, memo } from 'react';
import './Contact.css';
import MainLogo from '../../components/MainLogo';
import TopRightArrow from '../../assets/Arrow-top-right.webp';
import { profile } from '../../data/profile';

function Contact() {
  const [currentTime, setCurrentTime] = useState('');
  const sectionRef = useRef(null);
  const [fitsViewport, setFitsViewport] = useState(false);
  useEffect(() => {
    // Tall screens reveal the footer; short screens retain access to all its content.
    const update = () => setFitsViewport(sectionRef.current.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(update);
    observer.observe(sectionRef.current);
    window.addEventListener('resize', update);
    update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => {
    const section = sectionRef.current;
    if (!fitsViewport) { section.style.setProperty('--contact-reveal-blur', '0px'); return; }
    let frame;
    const update = () => {
      const cover = section.previousElementSibling.getBoundingClientRect().bottom;
      const remaining = Math.max(0, Math.min(1, cover / window.innerHeight));
      section.style.setProperty('--contact-reveal-blur', `${(remaining * 12).toFixed(2)}px`);
      const hiddenHeight = Math.max(0, cover - section.getBoundingClientRect().top);
      section.style.setProperty('--contact-reveal-cover', `${hiddenHeight}px`);
      section.style.setProperty('--contact-reveal-feather', `${Math.min(96, hiddenHeight)}px`);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [fitsViewport]);
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    updateTime(); const interval = setInterval(updateTime, 1000);
    document.addEventListener('visibilitychange', updateTime);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', updateTime); };
  }, []);
  return <section ref={sectionRef} className={`contact-page page-container ${fitsViewport ? 'contact-reveal' : ''}`} id="contact" aria-labelledby="contact-heading">
    <div className="contact-content"><div className="logo-center"><MainLogo /></div>
      <h2 className="contact-title" id="contact-heading">CONCEPT TO <span className="bold-text">CREATION</span></h2>
      <a className="cta-button" href={`mailto:${profile.email}`}><span>Let's work together</span><span className="button-icon"><img src={TopRightArrow} alt="" width="20" height="20" /></span></a>
      <p className="contact-description">Let's talk about AI agents, reliable backend systems,<br />and the products they make possible.</p>
    </div>
    <div className="social-links">{[['LinkedIn', profile.linkedin], ['Résumé', profile.resume], ['GitHub', profile.github]].map(([label, href]) => <a href={href} className="social-link" target="_blank" rel="noopener noreferrer" key={label}>{label} <img src={TopRightArrow} alt="" className="arrow-icon" width="18" height="18" /></a>)}</div>
    <div className="divider" /><footer className="footer"><p className="copyright">© {new Date().getFullYear()} AAMAAN SHARRMA, ALL RIGHTS RESERVED.</p><div className="time-display"><span className="time-label">Your local time</span><p className="time">{currentTime}</p></div></footer>
  </section>;
}
export default memo(Contact);
