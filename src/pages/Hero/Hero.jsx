import DirectionArrow from '../../components/DirectionArrow';
import MotionVideo from '../../components/MotionVideo';
import { useState, useEffect, useRef, memo } from 'react'
import './Hero.css'
import { profile } from '../../data/profile'
import NavArrow from '../../assets/Nav-Arrow.webp'
import MonitorsTyping from '../../assets/GIFs/monitors-typing.webm'
import BrainiacBrain from '../../assets/GIFs/brain.webm'

const originalText = '"I argue with language models for a living."'
const newText = '"I\'m Joking. I can code too."'

function Hero() {
  const [displayText, setDisplayText] = useState(originalText)
  const [hasScrambled, setHasScrambled] = useState(false)
  const isAnimatingRef = useRef(false)
  const intervalsRef = useRef([])

  const startScrambleAnimation = (targetText) => {
    // Don't start if already animating
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplayText(targetText); return }
    if (isAnimatingRef.current) return
    
    isAnimatingRef.current = true
    
    // Clear any existing intervals
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []

    const currentText = originalText
    let step = 0
    const encodeInterval = setInterval(() => {
      if (step < 5) {
        setDisplayText(
          currentText
            .split('')
            .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
            .join('')
        )
        step++
      } else {
        clearInterval(encodeInterval)
        // Decoding phase
        let decodeStep = 0
        const decodeInterval = setInterval(() => {
          if (decodeStep <= targetText.length) {
            setDisplayText(
              targetText.slice(0, decodeStep) +
                targetText
                  .slice(decodeStep)
                  .split('')
                  .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
                  .join('')
            )
            decodeStep++
          } else {
            clearInterval(decodeInterval)
            setDisplayText(targetText)
            setHasScrambled(true)
            isAnimatingRef.current = false
          }
        }, 20)
        intervalsRef.current.push(decodeInterval)
      }
    }, 30)
    intervalsRef.current.push(encodeInterval)
  }

  const handleMouseEnter = () => {
    if (!hasScrambled) {
      startScrambleAnimation(newText)
    } else {
      setDisplayText(newText)
    }
  }

  const handleMouseLeave = () => {
    if (hasScrambled && !isAnimatingRef.current) {
      setDisplayText(originalText)
    }
  }

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  const scrollToNext = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const progress = Math.min(scrollY / windowHeight, 1) // 0 to 1
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate distinct styles based on scroll
  const heroStyle = {
    opacity: 1 - scrollProgress * 1.5, // Fade out faster
    filter: `blur(${scrollProgress * 10}px)`, // Reduced blur for performance
    transform: `translate(-50%, -50%) scale(${1 - scrollProgress * 0.05})`, // Center + scale
    willChange: 'opacity, filter, transform',
    pointerEvents: scrollProgress > 0.6 ? 'none' : 'auto'
  }

  return (
    <div className="hero-page" id="hero">
      <div className="hero-bg-layer" />
      <div className="hero-page-texture" />
      <div className="hero-focus-layer" aria-hidden="true" style={{ opacity: Math.max(0, 1 - scrollProgress * 1.5) }} />
      <div className="hero-content" style={heroStyle}>
        <p className="hero-name">{profile.name}</p>
        <h1 className="hero-subtitle">
          I build production <span className="hero-circled-text">AI agents
            <svg className="hero-text-ring" viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true">
              <path d="M213 19C181 3 88 2 39 17C-1 29 2 60 42 72C85 85 175 82 211 66C246 50 240 26 203 16C164 5 85 8 45 22" />
            </svg>
          </span>{" "}
                    <MotionVideo
            src={MonitorsTyping} 
            className="hero-gif" 
            autoPlay 
            loop 
            muted 
            playsInline
            width="80"
            height="80"
          />{" "}
          <br />
          and reliable{" "}
                    <MotionVideo
            src={BrainiacBrain} 
            className="hero-gif" 
            autoPlay 
            loop 
            muted 
            playsInline
            width="60"
            height="60"
          />{" "}
          full-stack systems
        </h1>
        <p
          className="hero-title"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          
          {displayText}
          
        </p>
        <div className="hero-actions">
          <a href="#experience" className="hero-action">Explore my work <DirectionArrow /></a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="hero-action">View résumé <DirectionArrow /></a>
        </div>
      </div>

      <div className="scroll-indicators" style={{ opacity: 1 - scrollProgress * 2 }}> 
        <button className="scroll-btn scroll-btn-pulse" onClick={scrollToNext} aria-label="Scroll down">
                    <img 
            src={NavArrow} 
            alt=""
            loading="eager" 
            fetchPriority="high"
            decoding="async" 
            width="14"
            height="22"
          />
        </button>
        <button className="scroll-btn scroll-btn-pulse" onClick={scrollToNext} aria-label="Scroll down" style={{ animationDelay: '0.1s' }}>
                    <img 
            src={NavArrow} 
            alt=""
            loading="eager" 
            decoding="async" 
            width="14"
            height="22"
          />
        </button>
      </div>
    </div>
  );
}

export default memo(Hero)
