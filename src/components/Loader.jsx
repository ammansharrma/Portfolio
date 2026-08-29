import { useEffect, useState, memo } from 'react';
import './Loader.css';

const SEEN_KEY = 'as-loader-seen';

function shouldSkipLoader() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
}

function Loader({ onLoadComplete }) {
  const [visible, setVisible] = useState(() => !shouldSkipLoader());

  useEffect(() => {
    if (!visible) {
      onLoadComplete?.();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      markSeen();
      setVisible(false);
      onLoadComplete?.();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [visible, onLoadComplete]);

  if (!visible) return null;

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-grid" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="loader-dot" style={{ '--i': i }} />
        ))}
      </div>
      <p className="loader-mark">AS</p>
      <button
        type="button"
        className="loader-skip font-mono"
        onClick={() => {
          markSeen();
          setVisible(false);
          onLoadComplete?.();
        }}
      >
        skip ▮
      </button>
    </div>
  );
}

export default memo(Loader);
