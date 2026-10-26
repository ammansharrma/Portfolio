import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
const usePageEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const visited = new Set();
const previewed = new Set();
const preferenceKey = 'portfolio-read-instantly';
const readsInstantly = () => { try { return localStorage.getItem(preferenceKey) === 'true'; } catch { return false; } };

// Only the short introduction streams. The full case study is always readable.
export default function StreamedResponse({ intro, identity, children }) {
  const [text, setText] = useState(intro || '');
  const [phase, setPhase] = useState('complete');
  const [instant, setInstant] = useState(false);
  const finish = useRef(() => {});
  usePageEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const saved = readsInstantly(); setInstant(saved);
    let timeline;
    finish.current = () => { timeline?.kill(); setText(intro || ''); setPhase('complete'); };
    if (!intro || saved || media.matches || visited.has(identity)) return;
    visited.add(identity);
    setText(''); setPhase('thinking');
    const words = intro.match(/\S+\s*/g) || [intro];
    const cursor = { count: 0 };
    timeline = gsap.timeline({ delay: .35, onStart: () => setPhase('streaming'), onComplete: () => setPhase('complete') });
    timeline.to(cursor, {count: words.length, duration: Math.min(1.8, Math.max(.6, words.length / 22)), ease:'none', onUpdate: () => setText(words.slice(0, Math.ceil(cursor.count)).join(''))});
    const changed = () => { if (media.matches) finish.current(); };
    media.addEventListener('change', changed);
    return () => { timeline?.kill(); media.removeEventListener('change', changed); };
  }, [intro, identity]);
  function togglePreference() {
    const value = !instant; setInstant(value);
    try { localStorage.setItem(preferenceKey, String(value)); } catch {}
    if (value) finish.current();
    window.dispatchEvent(new CustomEvent('portfolio-reading-change', {detail:value}));
  }
  return <div className="stream-response" data-phase={phase}>
    {intro && <div className="generation-toolbar"><span className="generation-status" role="status" aria-live="polite">{phase === 'thinking' ? 'Thinking…' : phase === 'streaming' ? 'A quick introduction…' : 'Explore at your pace.'}</span><button className="show-response" aria-pressed={instant} onClick={togglePreference}>{instant ? 'Instant reading on' : 'Read instantly'}</button></div>}
    {intro && <p className="page-lead streamed-intro"><span className="intro-reserve" aria-hidden="true">{intro}</span><span className="intro-display" aria-hidden="true">{text}</span><span className="sr-only">{intro}</span></p>}
    <div className="stream-body">{children}</div>
  </div>;
}

export function ProjectPreview({ src, alt, natural = false }) {
  const [failed, setFailed] = useState(false);
  const frame = useRef(null), image = useRef(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let tween;
    const clear = () => { tween?.kill(); frame.current?.classList.remove('preview-pending'); if(image.current) gsap.set(image.current, {clearProps:'all'}); };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e=>e.isIntersecting) || !image.current) return;
      observer.disconnect();
      if(media.matches || readsInstantly() || previewed.has(src)) return;
      previewed.add(src); frame.current.classList.add('preview-pending');
      tween = gsap.fromTo(image.current, {filter:'blur(18px)',opacity:.3,scale:1.02}, {filter:'blur(0px)',opacity:1,scale:1,duration:1.4,ease:'power2.out',onComplete:clear});
    }, {threshold:.1});
    observer.observe(frame.current);
    const changed = e => { if(media.matches || e.detail === true) clear(); };
    media.addEventListener('change',changed); window.addEventListener('portfolio-reading-change',changed);
    return () => { observer.disconnect(); clear(); media.removeEventListener('change',changed); window.removeEventListener('portfolio-reading-change',changed); };
  }, [src]);
  return <div ref={frame} className={`image-reveal ${failed ? 'preview-failed' : ''} ${natural ? 'natural-preview' : ''}`}>
    {!failed && <img ref={image} src={src} alt={alt} width="1440" height="900" loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
    <div className="image-loading" aria-hidden="true"><span className="image-sweep"/><span className="image-loading-label">Preparing preview<span>•••</span></span></div>
    {failed && <p className="image-error" role="status">The preview could not load. The case study is available above.</p>}
  </div>;
}
