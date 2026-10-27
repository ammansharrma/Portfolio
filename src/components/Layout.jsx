import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  gsap, ScrollTrigger, S, root, reduce, fine, $$, initScroll, getLenis, scrollToY, startDot,
  enter, measureAnchor, hidePreview, useGsap
} from '../motion/engine';

const NavCtx = createContext(null);
export const useNav = () => useContext(NavCtx);

const SEEN = 'v3-seen';
let booted = false;

const wantsLoader = path => {
  if (reduce || !root.classList.contains('js') || path !== '/') return false;
  try { return sessionStorage.getItem(SEEN) !== '1'; } catch { return true; }
};

/* Button label that rolls up on hover (text is duplicated by CSS from data-t). */
export function Roll({ children }) {
  return <span className="t"><span data-t={children}>{children}</span></span>;
}

/* Internal link: the click point floods the screen, the route swaps underneath, the flood shrinks into the next dot. */
export function TLink({ to, go, label, children, ...rest }) {
  const nav = useNav();
  const onClick = e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    nav.go(to, { x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2, label, scrollTo: go });
  };
  return <Link to={to} onClick={onClick} {...rest}>{children}</Link>;
}

export function Footer({ right, showName = true }) {
  const clock = useRef(null);
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { if (clock.current) clock.current.textContent = f.format(new Date()) + ' IST'; };
    tick(); const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  useGsap(() => {
    const name = document.querySelector('.foot-name');
    if (name && !reduce) gsap.fromTo(name, { yPercent: 28 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  });
  return (
    <footer className="foot" data-theme="ink">
      <div className="foot-row"><span>© 2026 Aamaan Sharrma · Pune, India · <span ref={clock} className="num">--:--</span> local</span><span>{right}</span></div>
      {showName && <p className="foot-name" aria-hidden="true">Aamaan Sharrma</p>}
    </footer>
  );
}

function ScrollReset() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const l = getLenis(); if (l) l.scrollTo(0, { immediate: true, force: true });
  }, []);
  return null;
}

function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!fine || reduce) return undefined;
    const cur = ref.current;
    const qx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3.out' }), qy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3.out' });
    const move = e => { cur.style.opacity = 1; qx(e.clientX); qy(e.clientY); };
    const over = e => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      cur.classList.toggle('big', !!t); cur.firstChild.textContent = t ? t.dataset.cursor : '';
    };
    const leave = () => { cur.style.opacity = 0; };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); document.removeEventListener('pointerleave', leave); };
  }, []);
  return <div className="cur" ref={ref} aria-hidden="true"><span /></div>;
}

const NAV = [['work', 'Work'], ['method', 'Method'], ['experience', 'Experience'], ['about', 'About']];

export default function Layout() {
  const loc = useLocation(), navigate = useNavigate();
  const path = loc.pathname;
  const kind = path === '/' ? 'home' : path.startsWith('/work/') ? 'case' : '404';
  const [loader, setLoader] = useState(() => wantsLoader(path));
  const hadLoader = useRef(loader);
  const veilRef = useRef(null), labelRef = useRef(null), dotRef = useRef(null), menuRef = useRef(null);
  const menuBtn = useRef(null), barRef = useRef(null), ldRef = useRef(null), ldN = useRef(null);
  const busy = useRef(false), pending = useRef(null), pathRef = useRef(path), firstRun = useRef(true);
  pathRef.current = path;

  /* ----- menu (phone) ----- */
  const openMenu = () => {
    const menu = menuRef.current, btn = menuBtn.current; if (!menu) return;
    menu.style.display = 'flex'; btn.setAttribute('aria-expanded', 'true'); const l = getLenis(); l && l.stop();
    const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    gsap.fromTo(menu, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${cx}px ${cy}px)`, duration: .8, ease: 'expo.out' });
    gsap.fromTo(menu.querySelectorAll('a'), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, ease: 'expo.out', stagger: .06, delay: .15 });
    const a = menu.querySelector('a'); a && a.focus();
  };
  const closeMenu = useCallback(() => {
    const menu = menuRef.current; if (!menu || menu.style.display !== 'flex') return;
    menuBtn.current.setAttribute('aria-expanded', 'false'); const l = getLenis(); l && l.start();
    gsap.to(menu, { clipPath: 'circle(0px at calc(100% - 52px) 36px)', duration: .55, ease: 'expo.inOut', onComplete: () => { menu.style.display = ''; } });
    menuBtn.current.focus();
  }, []);

  /* ----- route transition ----- */
  const go = useCallback(async (to, o = {}) => {
    const cur = pathRef.current;
    if (to === cur) {
      closeMenu();
      const el = o.scrollTo && document.getElementById(o.scrollTo);
      scrollToY(el || 0);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    closeMenu(); hidePreview(true);
    if (reduce) { navigate(to); busy.current = false; return; }
    const veil = veilRef.current, label = labelRef.current, dotEl = dotRef.current;
    const cx = o.x ?? innerWidth / 2, cy = o.y ?? innerHeight / 2;
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 60;
    label.textContent = o.label || '';
    gsap.set(veil, { visibility: 'visible', clipPath: `circle(0px at ${cx}px ${cy}px)` });
    gsap.set(label, { opacity: 0, y: 24 });
    await gsap.timeline()
      .to(veil, { clipPath: `circle(${R}px at ${cx}px ${cy}px)`, duration: .9, ease: 'expo.inOut' })
      .to(label, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.4')
      .then();
    await new Promise(res => { pending.current = res; navigate(to); setTimeout(res, 2000); });
    pending.current = null;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    measureAnchor();
    const tgt = o.scrollTo || !S.anchor ? { x: innerWidth / 2, y: innerHeight / 2, r: 0 } : { x: S.anchor.x, y: S.anchor.y - scrollY + S.offY, r: S.anchor.w / 2 };
    S.intro = 1; dotEl.style.opacity = 0;
    await gsap.timeline()
      .to(label, { opacity: 0, y: -18, duration: .3, ease: 'power2.in' })
      .add(() => enter(), '<+.15')
      .to(veil, { clipPath: `circle(${tgt.r}px at ${tgt.x}px ${tgt.y}px)`, duration: 1, ease: 'expo.inOut' }, '<+.05')
      .then();
    gsap.set(veil, { visibility: 'hidden' });
    busy.current = false;
    if (o.scrollTo) { const el = document.getElementById(o.scrollTo); el && scrollToY(el); }
  }, [navigate, closeMenu]);

  /* The new route has mounted (children's layout effects already ran). */
  useLayoutEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (pending.current) { pending.current(); return; }
    // back and forward, or reduced motion: no veil, just settle
    requestAnimationFrame(() => { measureAnchor(); enter(); });
  }, [path]);

  /* ----- boot: smooth scroll, the dot, the header, and the loader on a first visit ----- */
  useEffect(() => {
    initScroll();
    const stopDot = startDot(dotRef.current);
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => barRef.current && barRef.current.classList.toggle('hide', s.direction === 1 && s.scroll() > 240) });
    const onKey = e => { if (e.key === 'Tab' && barRef.current) barRef.current.classList.remove('hide'); if (e.key === 'Escape') closeMenu(); };
    addEventListener('keydown', onKey);
    if (!booted) {
      booted = true;
      root.dataset.ready = 1;
      if (!reduce && root.classList.contains('js')) {
        if (!hadLoader.current) { S.intro = 1; enter(true); }
        else {
          try { sessionStorage.setItem(SEEN, '1'); } catch { /* storage blocked: the loader plays each visit */ }
          if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
          window.scrollTo(0, 0);
          S.intro = 0; gsap.set(barRef.current, { yPercent: -100 });
          const o = { v: 0 };
          const fonts = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 900))]);
          const counted = gsap.to(o, { v: 100, duration: .8, ease: 'power2.inOut', onUpdate: () => { if (ldN.current) ldN.current.textContent = Math.round(o.v); } });
          Promise.all([counted.then(), fonts]).then(() => {
            measureAnchor();
            gsap.timeline()
              .to($$('.ld-name,.ld-count,.ld-note'), { opacity: 0, duration: .35, ease: 'power2.in' })
              .add(() => { if (ldRef.current) ldRef.current.style.background = 'transparent'; }, '<')
              .to(S, { intro: 1, duration: .95, ease: 'expo.inOut' }, '<+.1')
              .add(() => enter(true), '<+.35')
              .add(() => setLoader(false), '>');
          });
        }
      }
    }
    return () => { stopDot(); st.kill(); removeEventListener('keydown', onKey); };
  }, [closeMenu]);

  const api = { go };
  return (
    <NavCtx.Provider value={api}>
      <a className="skip" href="#main">Skip to content</a>
      {loader && (
        <div className="ld" ref={ldRef} aria-hidden="true">
          <span className="ld-name">Aamaan Sharrma</span><span className="ld-count num" ref={ldN}>0</span>
          <p className="ld-note">Loading context for the first hand-off.</p>
        </div>
      )}
      <header className="bar" id="bar" ref={barRef}>
        <TLink className="mark" to="/" label="Home"><i aria-hidden="true" />Aamaan Sharrma</TLink>
        <nav className="nav" aria-label="Primary">
          {NAV.map(([id, t]) => (
            <TLink key={id} to="/" go={id} label={t} aria-current={kind === 'case' && id === 'work' ? 'page' : undefined}>{t}</TLink>
          ))}
        </nav>
        <TLink className="btn" to="/" go="contact" label="Contact"><Roll>Let’s talk</Roll></TLink>
        <button className="menu-btn" type="button" ref={menuBtn} aria-expanded="false" aria-controls="menu" onClick={openMenu}>Menu</button>
      </header>
      <div className="menu" id="menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu">
        <button className="close" type="button" onClick={closeMenu}>Close</button>
        <TLink to="/" go="work" label="Work">Work</TLink>
        <TLink to="/" go="method" label="Method">Method</TLink>
        <TLink to="/" go="experience" label="Experience">Experience</TLink>
        <TLink to="/" go="contact" label="Contact">Contact</TLink>
      </div>
      <div className="veil" ref={veilRef} aria-hidden="true"><p ref={labelRef} /></div>
      <div className="dot" id="dot" ref={dotRef} aria-hidden="true"><i /></div>
      <Cursor />
      <main id="main" tabIndex={-1}>
        <div id="page" data-page={kind} key={path}>
          <ScrollReset />
          <Outlet />
        </div>
      </main>
    </NavCtx.Provider>
  );
}
