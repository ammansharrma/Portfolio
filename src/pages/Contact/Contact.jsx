import { useState, useEffect, memo } from 'react'
import './Contact.css'
import MainLogo from '../../components/MainLogo'
import TopRightArrow from '../../assets/Arrow-top-right.webp'

function Contact() {
  const [currentTime, setCurrentTime] = useState('')
  const [copied, setCopied] = useState(false)

  const handleEmailClick = () => {
    // Copy to clipboard fallback
    navigator.clipboard.writeText('aamaansharrma6@gmail.com')
    setCopied(true)
    
    // Reset "Copied" text after 2 seconds
    setTimeout(() => setCopied(false), 2000)
    
    // Attempt to open mail client
    window.location.href = 'mailto:aamaansharrma6@gmail.com'
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="contact-page page-container" id="contact">
      
      <div className="contact-content">
        <div className="logo-center">
          <MainLogo />
        </div>
        
        <h1 className="contact-title">CONCEPT TO <span className="bold-text">CREATION</span></h1>
        
        <div className={`cta-button ${copied ? 'copied' : ''}`} onClick={handleEmailClick}>
          <span>{copied ? 'Email Copied!' : "Let's work together"}</span>
          <span className="button-icon">
            <img src={TopRightArrow} alt="" loading="lazy" decoding="async" width="20" height="20" />
          </span>
        </div>

        <p className="contact-description">
          I Thrive On Crafting Dynamic Web Applications,<br />
          And Delivering Seamless User Experiences.
        </p>
      </div>

      <div className="social-links">
        <a 
          href="https://www.linkedin.com/in/amman-sharrma/" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" width="18" height="18" />
        </a>
        <a 
          href={`${import.meta.env.BASE_URL}Mockups/Resume/Amman_Sharrma.pdf`} 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" width="18" height="18" />
        </a>
        <a 
          href="https://github.com/ammansharrma" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" width="18" height="18" />
        </a>
      </div>

      <div className="divider"></div>

      <footer className="footer">
        <p className="copyright">© 2026 A SHARRMA, ALL RIGHTS RESERVED.</p>
        <div className="time-display">
          <p className="time">{currentTime}</p>
        </div>
      </footer>

      <div className="decorative-gradient"></div>
    </div>
  )
}

export default memo(Contact)
