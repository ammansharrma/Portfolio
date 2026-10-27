/* Motion core for "The Handoff": one GSAP ticker, one Lenis, one traveling dot.
   Ported from design-v3/v3.js. Everything page-level lives in a gsap.context so a route change reverts it. */
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
export const root = document.documentElement;
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => t * t * (3 - 2 * t);

/* ---------- colour chapters ---------- */
const THEMES = {
  ink: { '--bg': '#0b0d12', '--fg': '#f0ede4', '--dotc': '#ffb020' },
  paper: { '--bg': '#ebe7dc', '--fg': '#0b0d12', '--dotc': '#b86b00' },
  amber: { '--bg': '#ffb020', '--fg': '#0b0d12', '--dotc': '#0b0d12' }
};
const themeColor = { ink: '#0b0d12', paper: '#ebe7dc', amber: '#ffb020' };
let theme = 'ink';
Object.entries(THEMES.ink).forEach(([k, v]) => root.style.setProperty(k, v));
export function setTheme(name, instant) {
  if (!THEMES[name] || (name === theme && !instant)) return;
  theme = name;
  const meta = $('meta[name="theme-color"]'); if (meta) meta.content = themeColor[name];
  if (instant || reduce) { Object.entries(THEMES[name]).forEach(([k, v]) => root.style.setProperty(k, v)); return; }
  gsap.to(root, { ...THEMES[name], duration: .7, ease: 'power2.out', overwrite: 'auto' });
}

/* ---------- smooth scroll ---------- */
let lenis = null;
export function initScroll() {
  if (lenis || reduce) return;
  lenis = new Lenis({ lerp: .1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
export const getLenis = () => lenis;
export function scrollToY(target, immediate) {
  if (lenis) lenis.scrollTo(target, { immediate: !!immediate, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4), force: true });
  else if (typeof target === 'number') window.scrollTo(0, target);
  else target.scrollIntoView();
}

/* ---------- the traveler dot: one driver, every position derived from scroll ---------- */
export const S = { intro: 1, anchor: null, stage: null, offY: 0 };
export function measureAnchor() {
  const a = $('#page [data-anchor]');
  if (!a) { S.anchor = null; return; }
  const r = a.getBoundingClientRect();
  const line = a.closest('.ln>i');
  const dy = line ? (gsap.getProperty(line, 'yPercent') || 0) / 100 * line.offsetHeight : 0;
  S.anchor = { x: r.left + scrollX + r.width / 2, y: r.top + scrollY - dy + r.height / 2, w: r.width };
}
ScrollTrigger.addEventListener('refresh', measureAnchor);
const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

function drive(dotEl) {
  if (!dotEl) return;
  if (reduce || !S.anchor) { dotEl.style.opacity = 0; return; }
  const sy = scrollY, vw = innerWidth, vh = innerHeight;
  let x = S.anchor.x, y = S.anchor.y - sy + S.offY, s = S.anchor.w, op = 1;
  if (S.intro < 1) {
    const e = S.intro;
    x = lerp(vw / 2, x, e); y = lerp(vh / 2, y, e) - Math.sin(Math.PI * e) * vh * .09; s = lerp(22, s, e);
  }
  const g = S.stage;
  if (g) {
    const { st, pts, n } = g;
    if (sy < st.start) {
      const e = smooth(clamp(sy / st.start)), c = center(pts[0]);
      x = lerp(x, c.x, e); y = lerp(y, c.y, e); s = lerp(s, 18, e);
    } else if (sy <= st.end) {
      const p = clamp((sy - st.start) / (st.end - st.start)), u = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(u)), f = u - i, fe = smooth(clamp((f - .3) / .4));
      const A = center(pts[i]), B = center(pts[i + 1]);
      x = lerp(A.x, B.x, fe); y = lerp(A.y, B.y, fe); s = 18;
      g.update(i + fe, p);
    } else {
      const c = center(pts[n - 1]); x = c.x; y = c.y; s = 18;
      op = 1 - clamp((sy - st.end) / (vh * .45)); g.update(n - 1, 1);
    }
  }
  dotEl.style.opacity = op;
  dotEl.style.transform = `translate3d(${x - s / 2}px,${y - s / 2}px,0) scale(${s / 24})`;
}
export function startDot(dotEl) {
  const fn = () => drive(dotEl);
  gsap.ticker.add(fn);
  return () => gsap.ticker.remove(fn);
}

/* ---------- entrance (first screen of any page) ---------- */
export function enter(first, delay = 0) {
  const page = $('#page'); if (!page || reduce) return;
  const top = page.firstElementChild;
  gsap.fromTo($$('.ln>i', page), { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: .12, delay });
  if (top) gsap.fromTo($$('.rise', top), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .09, delay: delay + .25 });
  const bar = $('#bar');
  if (first && bar) gsap.fromTo(bar, { yPercent: -100 }, { yPercent: 0, duration: 1, ease: 'expo.out', delay: delay + .4, clearProps: 'transform' });
}

export function hidePreview(instant) {
  const prev = $('#wprev'); if (!prev) return;
  gsap.to(prev, { clipPath: 'inset(50% 50% 50% 50% round 16px)', duration: instant ? .01 : .5, ease: 'expo.inOut', overwrite: 'auto' });
}

export function setMeta(title, description) {
  document.title = title;
  const set = (sel, v) => { const m = $(sel); if (m && v) m.setAttribute('content', v); };
  set('meta[name="description"]', description);
  set('meta[property="og:title"]', title); set('meta[property="og:description"]', description);
  set('meta[name="twitter:title"]', title); set('meta[name="twitter:description"]', description);
}

/* ---------- hooks ---------- */
export function useGsap(fn, deps = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => { const c = gsap.context(fn); return () => c.revert(); }, deps);
}

/* Page-level wiring every route shares: colour chapters, scroll reveals, a final refresh.
   Child effects run first, so every section and pin already exists when this runs. */
export function usePage() {
  useGsap(() => {
    const page = $('#page'), first = page.firstElementChild;
    const chapters = $$('[data-theme]', page);
    const pick = instant => {
      const y = innerHeight * .55;
      const hit = chapters.find(c => { const r = c.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
      if (hit) setTheme(hit.dataset.theme, instant === true);
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => pick(), onRefresh: () => pick() });
    setTheme((first && first.dataset.theme) || 'ink', true);
    if (!reduce) ScrollTrigger.batch($$('.rise', page).filter(el => !(first && first.contains(el))), {
      start: 'top 90%', once: true,
      onEnter: b => gsap.fromTo(b, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true })
    });
    measureAnchor();
    ScrollTrigger.refresh();
  });
}
