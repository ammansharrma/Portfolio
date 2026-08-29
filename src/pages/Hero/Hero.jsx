import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './Hero.css';

const NAME = 'AMMAN SHARRMA';

const FACTS = [
  'role: Member of Technical Staff · company: Mindstix · since: Aug 2024',
  'vidhaan-ai: multi-agent LLM orchestration · status: active build',
  'stock-predictor: BiLSTM + attention · accuracy: 68% directional',
];

function useTypewriter(facts, reduceMotion) {
  const [text, setText] = useState(reduceMotion ? facts[0] : '');
  const factIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const phaseRef = useRef('typing'); // typing | holding | deleting

  useEffect(() => {
    if (reduceMotion) return undefined;

    let timeoutId;

    const tick = () => {
      const currentFact = facts[factIndexRef.current];

      if (phaseRef.current === 'typing') {
        charIndexRef.current += 1;
        setText(currentFact.slice(0, charIndexRef.current));
        if (charIndexRef.current >= currentFact.length) {
          phaseRef.current = 'holding';
          timeoutId = window.setTimeout(tick, 3000);
          return;
        }
        timeoutId = window.setTimeout(tick, 18);
        return;
      }

      if (phaseRef.current === 'holding') {
        phaseRef.current = 'deleting';
        timeoutId = window.setTimeout(tick, 400);
        return;
      }

      // deleting
      charIndexRef.current -= 1;
      setText(currentFact.slice(0, charIndexRef.current));
      if (charIndexRef.current <= 0) {
        factIndexRef.current = (factIndexRef.current + 1) % facts.length;
        phaseRef.current = 'typing';
        timeoutId = window.setTimeout(tick, 300);
        return;
      }
      timeoutId = window.setTimeout(tick, 10);
    };

    timeoutId = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timeoutId);
  }, [facts, reduceMotion]);

  return text;
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const liveText = useTypewriter(FACTS, reduceMotion);
  const nameChars = NAME.split('');

  return (
    <div className="hero-page" id="hero">
      <div className="hero-bg-layer" />

      <div className="hero-content">
        <p className="hero-kicker font-mono">Pune, India</p>

        <h1 className="hero-name" aria-label={NAME}>
          {nameChars.map((char, i) => (
            <motion.span
              key={i}
              className="hero-name-char"
              aria-hidden="true"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.035, ease: [0.4, 0, 0.2, 1] }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <p className="hero-line">
          Full-stack developer and AI engineer building systems where backend
          architecture, agentic intelligence, and interface design behave as
          one product.
        </p>

        <p className="hero-live font-mono" aria-live="off">
          <span className="hero-live-prefix">{'\u203a'}</span> {liveText}
          <span className="hero-live-cursor">{'\u25AE'}</span>
        </p>

        <div className="hero-cta">
          <a href="mailto:aamaansharrma6@gmail.com" className="hero-cta-link">
            Email
          </a>
          <button
            type="button"
            className="hero-cta-link"
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }}
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(Hero);
