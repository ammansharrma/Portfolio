import { useState, useEffect, useRef, memo } from 'react'
import './Hero.css'
import InteractiveBubble from '../../components/InteractiveBubble'
import NavArrow from '../../assets/Nav-Arrow.webp'
import MonitorsTyping from '../../assets/GIFs/monitors-typing.gif'
import BrainiacBrain from '../../assets/GIFs/brainiac-brain.gif'

const originalText = '"I argue with language models for a living."'
const newText = '"I\'m Joking. I can code too."'

function Hero() {
  const [displayText, setDisplayText] = useState(originalText)
  const [hasScrambled, setHasScrambled] = useState(false)
  const isAnimatingRef = useRef(false)
  const intervalsRef = useRef([])

  const startScrambleAnimation = (targetText) => {
    // Don't start if already animating
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
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
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
    transform: `scale(${1 - scrollProgress * 0.05})`, // Subtle shrink
    willChange: 'opacity, filter, transform'
  }

  return (
    <div className="hero-page page-container" id="hero">
      <InteractiveBubble />
      <div className="hero-content" style={heroStyle}>
        <h1 className="hero-subtitle">
          A full-stack software engineer{" "}
          <img src={MonitorsTyping} alt="coding" className="hero-gif" loading="eager" decoding="async" />{" "}
          specializing
          <br />
          in building intelligent{" "}
          <img src={BrainiacBrain} alt="brain" className="hero-gif" loading="eager" decoding="async" />{" "}
          user-centric applications
        </h1>
        <p
          className="hero-title"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          
          {displayText}
          
        </p>
      </div>

      <div className="scroll-indicators" style={{ opacity: 1 - scrollProgress * 2 }}> 
        <button className="scroll-btn scroll-btn-pulse" onClick={scrollToNext} aria-label="Scroll down">
          <img src={NavArrow} alt="" loading="eager" decoding="async" />
        </button>
        <button className="scroll-btn scroll-btn-pulse" onClick={scrollToNext} aria-label="Scroll down" style={{ animationDelay: '0.1s' }}>
          <img src={NavArrow} alt="" loading="eager" decoding="async" />
        </button>
      </div>
    </div>
  );
}

export default memo(Hero)
