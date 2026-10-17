import { useEffect, useRef, useState } from 'react';
import MotionVideo from './MotionVideo';

// Verified edge bands in these exports; opening frames can briefly hide them.
const exportSideInset = { 'stock-predictor': 35 / 240, 'portfolio-template': 35 / 240, 'rings-project': 35 / 240 };

// Detect only near-solid black edge bands; interior dark UI remains untouched.
function measureBorders(media) {
  const width = media.videoWidth || media.naturalWidth;
  const height = media.videoHeight || media.naturalHeight;
  if (!width || !height) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = Math.max(1, Math.round(240 * height / width));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(media, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const black = (x, y) => {
    const offset = (y * canvas.width + x) * 4;
    return data[offset + 3] > 250 && Math.max(data[offset], data[offset + 1], data[offset + 2]) < 18;
  };
  const column = x => {
    let count = 0;
    for (let y = 0; y < canvas.height; y++) if (black(x, y)) count++;
    return count / canvas.height > .99;
  };
  const row = y => {
    let count = 0;
    for (let x = 0; x < canvas.width; x++) if (black(x, y)) count++;
    return count / canvas.width > .99;
  };
  let left = 0, right = 0, top = 0, bottom = 0;
  while (left < canvas.width / 4 && column(left)) left++;
  while (right < canvas.width / 4 && column(canvas.width - right - 1)) right++;
  while (top < canvas.height / 4 && row(top)) top++;
  while (bottom < canvas.height / 4 && row(canvas.height - bottom - 1)) bottom++;
  // Reject blank/loading frames and small dark outlines.
  if (left >= canvas.width / 4 || right >= canvas.width / 4 || top >= canvas.height / 4 || bottom >= canvas.height / 4) return null;
  return { width, height, left: left / canvas.width > .02 ? left / canvas.width : 0,
    right: right / canvas.width > .02 ? right / canvas.width : 0,
    top: top / canvas.height > .02 ? top / canvas.height : 0,
    bottom: bottom / canvas.height > .02 ? bottom / canvas.height : 0 };
}

export default function ProjectPreview({ project, fill = false }) {
  const [crop, setCrop] = useState(null);
  const frameRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!fill) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [fill]);
  const sampled = useRef(new Set());
  const inspect = event => {
    const media = event.currentTarget;
    const bucket = media.videoWidth ? Math.floor(media.currentTime / 2) : 0;
    if (sampled.current.has(bucket) || sampled.current.size >= 4) return;
    try {
      const next = measureBorders(media);
      if (!next) return;
      if (project.heroVideo && exportSideInset[project.id]) {
        next.left = Math.max(next.left, exportSideInset[project.id]);
        next.right = Math.max(next.right, exportSideInset[project.id]);
      }
      sampled.current.add(bucket);
      setCrop(previous => previous ? { ...next,
        left: Math.min(previous.left, next.left), right: Math.min(previous.right, next.right),
        top: Math.min(previous.top, next.top), bottom: Math.min(previous.bottom, next.bottom) } : next);
    } catch { /* Keep the complete preview if pixels are unavailable. */ }
  };
  const x = crop ? 1 - crop.left - crop.right : 1;
  const y = crop ? 1 - crop.top - crop.bottom : 1;
  const ratio = crop ? crop.width * x / (crop.height * y) : 16 / 9;
  const frameStyle = crop && !fill ? { aspectRatio: ratio, maxWidth: `${78 * ratio}svh` } : undefined;
  let mediaStyle = crop ? { position: 'absolute', width: `${100 / x}%`, height: `${100 / y}%`, maxHeight: 'none', left: `${-crop.left / x * 100}%`, top: `${-crop.top / y * 100}%` } : undefined;
  if (fill && crop && size.width && size.height) {
    const scale = Math.max(size.width / (crop.width * x), size.height / (crop.height * y));
    mediaStyle = { position: 'absolute', width: crop.width * scale, height: crop.height * scale,
      left: (size.width - crop.width * x * scale) / 2 - crop.left * crop.width * scale,
      top: (size.height - crop.height * y * scale) / 2 - crop.top * crop.height * scale, maxWidth: 'none', maxHeight: 'none' };
  }
  return <div ref={frameRef} className={`project-preview-frame${fill ? ' is-fill' : ''}`} style={frameStyle}>
    {project.heroVideo ? <MotionVideo src={`${import.meta.env.BASE_URL}${project.heroVideo}`} muted loop autoPlay playsInline onLoadedData={inspect} onTimeUpdate={inspect} style={mediaStyle} />
      : <img src={`${import.meta.env.BASE_URL}${project.thumbnail}`} alt={`${project.title} preview`} loading="lazy" decoding="async" onLoad={inspect} style={mediaStyle} />}
  </div>;
}
