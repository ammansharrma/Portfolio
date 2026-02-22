import { useState, useEffect, memo } from 'react';
import LoaderGif from '../assets/GIFs/Loader.webm';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadComplete }) => {
  const [count, setCount] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [startZoom, setStartZoom] = useState(false);

  useEffect(() => {
    // Smooth counter animation
    let startTime = null;
    const duration = 2500; // 2.5 seconds to count to 100
    let rafId = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth acceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * 100);
      
      setCount(currentCount);
      
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Show logo after reaching 100
        setTimeout(() => {
          setShowLogo(true);
          // Start zoom animation after logo appears
          setTimeout(() => {
            setStartZoom(true);
            // Complete loading after zoom
            setTimeout(() => {
              onLoadComplete();
            }, 500);
          }, 400);
        }, 300);
      }
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onLoadComplete]);

  return (
    <div className={`loading-screen ${startZoom ? 'zoom-in' : ''}`}>
      {!showLogo && (
        <div className="loading-indicator">
          <div className="counter-bottom-right">{count}</div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${count}%` }}></div>
          </div>
        </div>
      )}
      
      {showLogo && (
        <div className={`logo-animation-container ${startZoom ? 'zooming' : ''}`}>
                    <video src={LoaderGif} className="main-logo" autoPlay muted playsInline width="300" height="300" />
        </div>
      )}
    </div>
  );
};

export default memo(LoadingScreen)
