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
  ink: { '--bg': '#0b0d12', '--fg': '#f0ede4', '--dotc': '#ffb020', '--icon-invert': 1 },
  paper: { '--bg': '#ebe7dc', '--fg': '#0b0d12', '--dotc': '#b86b00', '--icon-invert': 0 },
  amber: { '--bg': '#ffb020', '--fg': '#0b0d12', '--dotc': '#0b0d12', '--icon-invert': 0 }
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
  if (target instanceof Element) {
    const details = target.closest('details');
    if (details) details.open = true;
  }
  if (lenis) lenis.scrollTo(target, { immediate: !!immediate, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4), force: true });
  else if (typeof target === 'number') window.scrollTo(0, target);
  else target.scrollIntoView();
}

/* ---------- the traveler dot: one driver, every position derived from scroll ---------- */
export const S = { intro: 1, anchor: null, offY: 0, stops: [], focusTarget: null };
export function measureAnchor() {
  const a = $('#page [data-anchor]');
  if (!a) { S.anchor = null; S.stops = []; return; }
  const r = a.getBoundingClientRect();
  const line = a.closest('.ln>i');
  const dy = line ? (gsap.getProperty(line, 'yPercent') || 0) / 100 * line.offsetHeight : 0;
  S.anchor = { x: r.left + scrollX + r.width / 2, y: r.top + scrollY - dy + r.height / 2, w: r.width };
  S.stops = $$('#page [data-travel]').map(el => {
    const rect = el.getBoundingClientRect();
    return { el, owner: el.closest('[data-journey]'), group: el.closest('[data-journey-group]'), chapter: el.closest('[data-chapter]')?.dataset.chapter, dock: el.hasAttribute('data-travel-dock'), size: clamp(Number(el.dataset.travelSize) || 16, 8, 36), x: rect.left + rect.width / 2, y: rect.top + scrollY + rect.height / 2,
      at: Math.max(1, Math.min(document.documentElement.scrollHeight - innerHeight, rect.top + scrollY + rect.height / 2 - innerHeight * +(el.dataset.travelAt || .52))) };
  }).sort((a, b) => a.at - b.at);
}
ScrollTrigger.addEventListener('refresh', measureAnchor);
const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

function drive(dotEl) {
  if (!dotEl) return;
  if (reduce || !S.anchor) { dotEl.style.opacity = 0; return; }
  const sy = scrollY, vw = innerWidth, vh = innerHeight, mobile = vw <= 820;
  const first = { ...S.anchor, at: 0 };
  const stops = [first, ...S.stops];
  let a = first, b = first;
  for (let i = 1; i < stops.length; i++) {
    b = stops[i];
    if (sy <= b.at) break;
    a = b;
  }
  const gap = b.at - a.at;
  // A reading stop belongs to its content for the first part of the interval.
  // It then hands off before the next thought arrives. Reverse scroll is symmetric.
  const departure = a.at + (a.dock ? Math.min(gap * .55, vh * .28) : 0);
  const progress = a === b ? 1 : smooth(clamp((sy - departure) / Math.max(1, b.at - departure)));
  const active = progress < .5 ? a : b;
  const chapters = new Map();
  for (const stop of S.stops) {
    if (!stop.owner) continue;
    stop.owner.classList.toggle('is-current', stop === active);
    stop.owner.classList.toggle('is-passed', sy > stop.at && stop !== active);
    if (stop.group && (stop === active || sy >= stop.at || (stop.chapter === '0' && sy < stop.at))) {
      chapters.set(stop.group, stop.chapter);
    }
  }
  for (const [group, chapter] of chapters) {
    if (group.dataset.active !== chapter) group.dataset.active = chapter;
  }
  // Authored mobile sockets preserve the story; earlier sections use the safe outer gutter.
  const position = point => ({ x: mobile && point !== first && point.el?.dataset.travelMobile !== 'dock' ? 8 : point.x, y: point.y - sy });
  const A = position(a), B = position(b);
  let x = lerp(A.x, B.x, progress), y = lerp(A.y, B.y, progress);
  // Scale carries emphasis: compact information, fuller statements and resolution.
  // Keep the phone's outer-gutter stops small; authored sockets have room to grow.
  const diameter = point => point === first ? S.anchor.w : mobile
    ? (point.el?.dataset.travelMobile === 'dock' ? clamp(point.size * .75, 8, 20) : 10)
    : point.size;
  const inTransit = Math.sin(Math.PI * progress);
  let size = lerp(diameter(a), diameter(b), progress) * (1 - .18 * inTransit);
  if (S.focusTarget?.isConnected && !mobile) {
    const focus = center(S.focusTarget);
    if (focus.y > 80 && focus.y < vh - 30) { x = focus.x; y = focus.y; size = clamp(Number(S.focusTarget.dataset.travelSize) || 16, 8, 36); }
  }
  if (sy > 80) y = clamp(y, 82, vh - 28);
  if (S.intro < 1) {
    x = lerp(vw / 2, x, S.intro); y = lerp(vh / 2, y, S.intro); size = lerp(22, size, S.intro);
  }
  y += S.offY;
  // A short, frame-rate-independent settle also makes focus/hover hand-offs gentle.
  const previous = dotEl._position || { x, y, size };
  const t = 1 - Math.pow(.001, gsap.ticker.deltaRatio() / 60);
  const current = { x: lerp(previous.x, x, t), y: lerp(previous.y, y, t), size: lerp(previous.size, size, t) };
  dotEl._position = current;
  dotEl.style.opacity = 1;
  dotEl.style.transform = `translate3d(${current.x - current.size / 2}px,${current.y - current.size / 2}px,0) scale(${current.size / 24})`;
}
export function startDot(dotEl) {
  const fn = () => drive(dotEl);
  const resize = () => measureAnchor();
  gsap.ticker.add(fn);
  addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  return () => { gsap.ticker.remove(fn); removeEventListener('resize', resize); };
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
    // Font loading and asynchronously loaded diagrams can move downstream stops.
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(page);
    return () => {
      observer.disconnect();
      S.stops.forEach(stop => stop.owner?.classList.remove('is-current', 'is-passed'));
      S.stops = [];
    };
  });
}
