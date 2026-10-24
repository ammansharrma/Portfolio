import { useEffect, useRef, useState } from 'react';
import './ProjectVideo.css';

function Icon({ kind }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'play' ? <path d="m9 5 10 7-10 7Z" fill="currentColor" stroke="none" /> :
      kind === 'pause' ? <><path d="M9 5v14M15 5v14" strokeWidth="3" /></> :
      kind === 'fullscreen' ? <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" /> :
      <><path d="M11 5 6 9H3v6h3l5 4Z" />{kind === 'muted' ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />}</>}
  </svg>;
}
const timeLabel = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
export default function ProjectVideo({ src, title }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const video = videoRef.current;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (visible && !document.hidden && !motion.matches && !manualPause.current) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .2 });
    observer.observe(video);
    const onFullscreen = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', update);
    };
  }, [src]);
  const togglePlayback = () => {
    const video = videoRef.current;
    manualPause.current = !video.paused;
    if (video.paused) video.play().catch(() => setError('Playback could not start. Please try again.'));
    else video.pause();
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === playerRef.current) await document.exitFullscreen();
      else if (playerRef.current.requestFullscreen) await playerRef.current.requestFullscreen();
      else videoRef.current.webkitEnterFullscreen?.();
    } catch { setError('Fullscreen is unavailable in this browser.'); }
  };
  const progress = duration ? time / duration * 100 : 0;
  return <div ref={playerRef} className={`project-video-player ${playing ? 'is-playing' : 'is-paused'}`} role="group" aria-label={`${title} video`}>
    <video ref={videoRef} src={src} muted={muted} playsInline loop preload="metadata"
      onPlay={() => { setPlaying(true); setError(''); }} onPause={() => setPlaying(false)}
      onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      onVolumeChange={event => setMuted(event.currentTarget.muted)}
      onError={() => setError('This video could not be loaded.')} />
    <div className="project-video-shade" />
    <button className="project-video-control project-video-play" onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}><Icon kind={playing ? 'pause' : 'play'} /></button>
    <div className="project-video-top">
      <button className="project-video-control" onClick={() => { videoRef.current.muted = !videoRef.current.muted; }} aria-label={muted ? 'Unmute video' : 'Mute video'}><Icon kind={muted ? 'muted' : 'volume'} /></button>
      <button className="project-video-control" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}><Icon kind="fullscreen" /></button>
    </div>
    <input className="project-video-seek" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} disabled={!duration}
      aria-label="Video progress" aria-valuetext={`${timeLabel(time)} of ${timeLabel(duration)}`}
      style={{ '--video-progress': `${progress}%` }}
      onChange={event => { const next = Number(event.target.value); videoRef.current.currentTime = next; setTime(next); }} />
    {error && <p className="project-video-error" role="status">{error}</p>}
  </div>;
}
