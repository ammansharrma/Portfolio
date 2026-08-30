import { useEffect, useState, memo } from 'react';
import './Loader.css';

const SEEN_KEY = 'as-loader-seen';

// 7x5 bitmap of the "A" mark, row-major, true = filled cell.
const A_BITMAP = [
  [false, true, true, true, false],
  [true, false, false, false, true],
  [true, false, false, false, true],
  [true, true, true, true, true],
  [true, false, false, false, true],
  [true, false, false, false, true],
  [true, false, false, false, true],
];

// Flat index (row * 5 + col) of every filled cell, in a fixed hand-picked
// order that dissolves the mark in rather than filling row-by-row.
const A_FILL_ORDER = [17, 3, 21, 1, 33, 8, 26, 2, 15, 20, 31, 6, 11, 30, 16, 25, 5, 32];

const LIVE_FACT = 'role: Member of Technical Staff · company: Mindstix · since: Aug 2024';

function useTypeOnce(text, startDelayMs) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let intervalId;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setCharCount((c) => {
          if (c >= text.length) {
            window.clearInterval(intervalId);
            return c;
          }
          return c + 1;
        });
      }, 18);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [text, startDelayMs]);

  return text.slice(0, charCount);
}

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
  const liveText = useTypeOnce(LIVE_FACT, 900);

  useEffect(() => {
    if (!visible) {
      onLoadComplete?.();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      markSeen();
      setVisible(false);
      onLoadComplete?.();
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [visible, onLoadComplete]);

  if (!visible) return null;

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-field" aria-hidden="true">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="loader-field-dot" style={{ '--i': i }} />
        ))}
      </div>
      <div className="loader-mark-grid" aria-hidden="true">
        {A_BITMAP.flat().map((filled, i) => {
          const fillStep = A_FILL_ORDER.indexOf(i);
          return (
            <span
              key={i}
              className={`loader-mark-cell ${filled ? 'is-filled' : 'is-empty'}`}
              style={filled ? { '--fill-order': fillStep } : undefined}
            />
          );
        })}
      </div>
      <span className="sr-only">Aamaan Ssanjay Sharrma</span>
      <p className="loader-live font-mono" aria-live="off">
        <span className="loader-live-prefix">{'›'}</span> {liveText}
        <span className="loader-live-cursor">{'▮'}</span>
      </p>
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
