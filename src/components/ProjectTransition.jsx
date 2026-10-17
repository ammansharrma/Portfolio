import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './ProjectTransition.css';

let detailModule;
const preloadDetails = () => detailModule ||= import('../pages/ProjectDetail/ProjectDetail').catch(() => { detailModule = null; });

// Freeze a viewport-sized copy of the route, without copying the global sky.
function createStrips(content, entering) {
  const bounds = content.getBoundingClientRect();
  const template = content.cloneNode(true);
  const originals = [content, ...content.querySelectorAll('*')];
  const copies = [template, ...template.querySelectorAll('*')];
  originals.forEach((source, index) => {
    const copy = copies[index];
    const style = getComputedStyle(source);
    if (style.position === 'sticky' && entering) {
      // Keep the grid/flex slot occupied. Absolute positioning removes the left
      // detail panel from its grid and moves the text into the wrong column.
      copy.style.setProperty('position', 'relative', 'important');
      copy.style.top = 'auto';
      copy.style.bottom = 'auto';
    } else if (style.position === 'sticky' || style.position === 'fixed') {
      const rect = source.getBoundingClientRect();
      const parent = source.offsetParent?.getBoundingClientRect() || bounds;
      if (style.position === 'sticky' && source !== content) {
        const placeholder = document.createElement('div');
        Object.assign(placeholder.style, {
          width: `${rect.width}px`, height: `${rect.height}px`,
          gridArea: style.gridArea, margin: style.margin, visibility: 'hidden',
        });
        copy.before(placeholder);
      }
      Object.assign(copy.style, {
        position: 'absolute', top: `${rect.top - parent.top}px`,
        left: `${rect.left - parent.left}px`, right: 'auto', bottom: 'auto',
        width: `${rect.width}px`, height: `${rect.height}px`, transform: 'none',
      });
    }
    if (source instanceof HTMLVideoElement && source.readyState >= 2) {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1280 / source.videoWidth);
      canvas.width = Math.round(source.videoWidth * scale);
      canvas.height = Math.round(source.videoHeight * scale);
      canvas.className = source.className;
      canvas.style.cssText = copy.style.cssText;
      try {
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
        // Canvas pixels survive below as an image when the template is cloned.
        const image = document.createElement('img');
        image.src = canvas.toDataURL();
        image.className = canvas.className;
        image.style.cssText = canvas.style.cssText;
        copy.replaceWith(image);
      } catch { /* The video's poster remains available for cross-origin media. */ }
    }
  });
  Object.assign(template.style, {
    position: 'absolute', top: `${bounds.top}px`, left: `${bounds.left}px`,
    width: `${bounds.width}px`, height: `${bounds.height}px`, margin: '0',
    visibility: 'visible', opacity: '1', pointerEvents: 'none',
  });
  const overlay = document.createElement('div');
  overlay.className = 'project-stripe-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  const strips = Array.from({ length: 6 }, (_, index) => {
    const strip = document.createElement('div');
    strip.className = 'project-moving-stripe';
    strip.style.clipPath = `inset(${index * 100 / 6}% 0 ${100 - (index + 1) * 100 / 6}% 0)`;
    const slice = template.cloneNode(true);
    // Each SVG diagram needs its own gradient/marker IDs inside every strip.
    const ids = new Map();
    slice.querySelectorAll('[id]').forEach(node => {
      const id = node.id;
      const unique = `stripe-${index}-${id}`;
      ids.set(id, unique);
      node.id = unique;
    });
    slice.querySelectorAll('*').forEach(node => {
      for (const attribute of [...node.attributes]) {
        let value = attribute.value.replace(/url\(#([^)]*)\)/g,
          (match, id) => ids.has(id) ? `url(#${ids.get(id)})` : match);
        if (['href', 'xlink:href'].includes(attribute.name) && ids.has(value.slice(1))) {
          value = `#${ids.get(value.slice(1))}`;
        }
        if (value !== attribute.value) node.setAttribute(attribute.name, value);
      }
    });
    strip.append(slice);
    overlay.append(strip);
    return strip;
  });
  document.body.append(overlay);
  return { overlay, strips };
}

export default function ProjectTransition() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    let busy = false;
    let disposed = false;
    // Warm the destination before a click, so coverage never waits on a download.
    void preloadDetails();
    const animations = new Set();
    const animate = async (element, frames, options) => {
      const animation = element.animate(frames, { ...options, fill: 'both' });
      animations.add(animation);
      await animation.finished;
    };
    const overlays = new Set();
    const slide = async (content, entering, snapshotRoot = content) => {
      const { overlay, strips } = createStrips(snapshotRoot, entering);
      overlays.add(overlay);
      // Opacity hides the entire composited route, including sticky descendants
      // and children that explicitly set visibility: visible.
      content.style.opacity = '0';
      content.style.pointerEvents = 'none';
      try {
        await Promise.all(strips.map((strip, index) => animate(strip, [
          { transform: `translate3d(${entering ? '-100%' : '0'}, 0, 0)` },
          { transform: `translate3d(${entering ? '0' : '100%'}, 0, 0)` },
        ], { duration: 600, delay: index * 45, easing: 'cubic-bezier(.45,0,.2,1)' })));
      } finally {
        overlay.remove();
        overlays.delete(overlay);
      }
    };
    const onClick = async event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      if (url.origin !== window.location.origin || !url.pathname.startsWith(`${base}/`)) return;
      const path = url.pathname.slice(base.length);
      if (!/^\/(?:experience\/[^/]+\/)?projects\/[^/]+\/?$/.test(path)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;
      event.preventDefault();
      event.stopPropagation();
      if (busy) return;
      busy = true;
      const content = document.querySelector('.pages-container');
      if (!content) { busy = false; navigateRef.current(`${path}${url.search}${url.hash}`); return; }
      const previousOpacity = content.style.opacity;
      const previousPointerEvents = content.style.pointerEvents;
      // The landing showcase covers Experience. Copy only that visible layer,
      // so the sticky section underneath never enters the moving strips.
      const outgoingRoot = link.closest('.project-slider-viewport') || content;
      let navigated = false;
      try {
        await preloadDetails();
        if (disposed) return;
        await slide(content, false, outgoingRoot);
        if (disposed) return;
        flushSync(() => navigateRef.current(`${path}${url.search}${url.hash}`));
        navigated = true;
        // React.lazy can commit its fallback even after the import is warm.
        // Let the destination and its layout effects settle before copying it.
        for (let frame = 0; frame < 60; frame++) {
          await new Promise(resolve => requestAnimationFrame(resolve));
          if (disposed) return;
          if (frame > 0 && content.querySelector('.project-detail-page, .project-detail-error')) break;
        }
        await slide(content, true);
      } catch {
        // Navigation still works if animation or preloading is unavailable.
        if (!disposed && !navigated) navigateRef.current(`${path}${url.search}${url.hash}`);
      } finally {
        animations.forEach(animation => animation.cancel());
        animations.clear();
        content.style.opacity = previousOpacity;
        content.style.pointerEvents = previousPointerEvents;
        busy = false;
      }
    };
    document.addEventListener('click', onClick, true);
    return () => {
      disposed = true;
      document.removeEventListener('click', onClick, true);
      animations.forEach(animation => animation.cancel());
      overlays.forEach(overlay => overlay.remove());
    };
  }, []);

  return null;
}
