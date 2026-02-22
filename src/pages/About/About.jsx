import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'
import TopRightArrow from '../../assets/Arrow-top-right.webp'
import HelloGif from '../../assets/GIFs/Hello.gif'

function About() {
  const navigate = useNavigate();
  return (
    <div className="about-page page-container" id="about">
      <div className="about-layout">
        <div className="about-left">
          <h1 className="about-title">ABOUT ME</h1>
        </div>

        <div className="about-right">
          <div className="about-greeting">
                        Hello <img 
              src={HelloGif} 
              alt="hello" 
              className="hello-gif" 
              loading="lazy" 
              decoding="async" 
              width="48"
              height="48"
            />
          </div>

          <div className="about-content">
            <p className="about-text">
              I'm interested in building complete systems where backend architecture, AI intelligence, and interface design operate as one cohesive experience.
            </p>

            <p className="about-text">
              I'm drawn to problems that require both precision and intuition. The kind where scalable APIs, structured data models, and intelligent AI pipelines need to work quietly behind a clean, fast interface.
            </p>

            <div className="about-section">
              <h3 className="about-section-title">How I Build</h3>
              <ul className="about-principles">
                <li>
                                    <img 
                    src={TopRightArrow} 
                    alt="" 
                    className="arrow-icon" 
                    loading="lazy" 
                    decoding="async" 
                    width="18"
                    height="18"
                  />
                  I think in systems, not isolated features.
                </li>
                <li>
                                    <img 
                    src={TopRightArrow} 
                    alt="" 
                    className="arrow-icon" 
                    loading="lazy" 
                    decoding="async" 
                    width="18"
                    height="18"
                  />
                  I care about performance as much as polish.
                </li>
                <li>
                                    <img 
                    src={TopRightArrow} 
                    alt="" 
                    className="arrow-icon" 
                    loading="lazy" 
                    decoding="async" 
                    width="18"
                    height="18"
                  />
                  I design AI integrations with safety, structure, and cost-awareness in mind.
                </li>
              </ul>
            </div>

            <p className="about-text">
              Currently, I contribute to end-to-end product systems from API design to production-ready UI engineering while independently building AI-driven projects that explore retrieval pipelines, structured prompting, and controlled execution flows.
            </p>

            <p className="about-text">
              Previously, I worked on applied AI tooling and automation systems, where I learned that <span className="highlight">clarity often matters more than complexity.</span>
            </p>

            <p className="about-text">
              Outside of engineering, I study financial systems and product strategy because <span className="highlight">great software isn't just built, it's positioned.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="experience-footer">
        <div
          className="experience-item"
          onClick={() => navigate("/experience/omnevu")}
        >
          PREVIOUSLY WORKED AT OMNEVU{" "}
                    <img 
            src={TopRightArrow} 
            alt="" 
            className="arrow-icon" 
            loading="lazy" 
            decoding="async" 
            width="18"
            height="18"
          />
        </div>
        <div
          className="experience-item"
          onClick={() => navigate("/experience/mindstix")}
        >
          CURRENTLY AT MINDSTIX{" "}
                    <img 
            src={TopRightArrow} 
            alt="" 
            className="arrow-icon" 
            loading="lazy" 
            decoding="async" 
            width="18"
            height="18"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(About)
