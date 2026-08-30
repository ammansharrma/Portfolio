import { useState, useEffect, memo } from 'react'
import './Contact.css'

function Contact() {
  const [currentTime, setCurrentTime] = useState('')
  const [copied, setCopied] = useState(false)

  const handleEmailClick = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('aamaansharrma6@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    <section className="contact-page section-shell" id="contact">
      <div className="section-shell-inner">
        <h2 className="section-label">Contact</h2>

        <div className="link-row">
          <a href="mailto:aamaansharrma6@gmail.com" className="link-row-item" onClick={handleEmailClick}>
            {copied ? 'Email copied' : 'Email'}
          </a>
          <a
            href={`${import.meta.env.BASE_URL}Mockups/Resume/Amman_Sharrma.pdf`}
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            href="https://github.com/ammansharrma"
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/amman-sharrma/"
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <footer className="contact-footer">
          <p className="contact-copyright font-mono">© 2026 AAMAAN SHARRMA, ALL RIGHTS RESERVED.</p>
          <p className="contact-time font-mono">{currentTime}</p>
        </footer>
      </div>
    </section>
  )
}

export default memo(Contact)
