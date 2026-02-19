import { useState, useEffect, memo, useMemo } from 'react'
import './Contact.css'
import InteractiveWhiteBubbles from '../../components/InteractiveWhiteBubbles'
import MainLogo from '../../components/MainLogo'
import TopRightArrow from '../../assets/Arrow-top-right.webp'

function Contact() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute instead of every second

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="contact-page page-container" id="contact">
      {/* <InteractiveWhiteBubbles /> */}
      
      <div className="contact-content">
        <div className="logo-center">
          <MainLogo />
        </div>
        
        <h1 className="contact-title">CONCEPT TO <span className="bold-text">CREATION</span></h1>
        
        <button className="cta-button">
          <span>Let's work together</span>
          <span className="button-icon">
            <img src={TopRightArrow} alt="" loading="lazy" decoding="async" />
          </span>
        </button>

        <p className="contact-description">
          I Thrive On Crafting Dynamic Web Applications,<br />
          And Delivering Seamless User Experiences.
        </p>
      </div>

      <div className="social-links">
        <a href="#" className="social-link">
          LinkedIn <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" />
        </a>
        <a href="#" className="social-link">
          Resume <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" />
        </a>
        <a href="#" className="social-link">
          Github <img src={TopRightArrow} alt="" className="arrow-icon" loading="lazy" decoding="async" />
        </a>
      </div>

      <div className="divider"></div>

      <footer className="footer">
        <p className="copyright">© 2025 A SHARRMA, ALL RIGHTS RESERVED.</p>
        <div className="time-display">
          <p className="time">{currentTime}</p>
        </div>
      </footer>

      <div className="decorative-gradient"></div>
    </div>
  )
}

export default memo(Contact)
