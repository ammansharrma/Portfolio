import { useEffect, useRef } from 'react';

// Decorative previews play only while visible and when motion is welcome.
export default function MotionVideo({ autoPlay, src, children, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!autoPlay) return;
    const video = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (visible && !motion.matches && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(video);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, [autoPlay, src]);
  return <video ref={ref} src={src} preload="metadata" {...props}>{children}</video>;
}
