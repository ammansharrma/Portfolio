import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExperienceSection.css';
import TopRightArrow from '../../assets/Arrow-top-right.webp';

function ExperienceSection() {
  const navigate = useNavigate();

  return (
    <div className="experience-section-page page-container" id="experience">
      <div className="experience-layout">
        <h1 className="experience-main-title">EXPERIENCE</h1>
        
        <div className="experience-list">
          {/* Mindstix Experience Row */}
          <div 
            className="experience-row" 
            onClick={() => navigate('/experience/mindstix')}
          >
            <div className="experience-row-left">
              <div className="experience-logo mindstix-logo">
                <svg viewBox="0 0 160 30" width="160" height="30" fill="currentColor">
                  <text x="0" y="22" fontFamily="sans-serif" fontWeight="500" fontSize="24" letterSpacing="0.5">MINDSTIX</text>
                </svg>
              </div>
              <span className="experience-proof">Production AI agents on AWS Bedrock AgentCore</span>
            </div>
            <div className="experience-row-right">
              <span className="experience-year">Software Developer · Jun 2025 – Present</span>
              <img 
                src={TopRightArrow} 
                alt="View Details" 
                className="experience-arrow" 
                width="20"
                height="20"
              />
            </div>
          </div>

          {/* OmneVu Experience Row */}
          <div 
            className="experience-row" 
            onClick={() => navigate('/experience/omnevu')}
          >
            <div className="experience-row-left">
              <div className="experience-logo omnevu-logo">
                <svg viewBox="0 0 160 30" width="160" height="30" fill="currentColor">
                  <text x="0" y="22" fontFamily="sans-serif" fontWeight="500" fontSize="24" letterSpacing="1">OMNEVU</text>
                </svg>
              </div>
            </div>
            <div className="experience-row-right">
              <span className="experience-year">Full Stack Developer Intern · Dec 2024 – Jun 2025</span>
              <img 
                src={TopRightArrow} 
                alt="View Details" 
                className="experience-arrow" 
                width="20"
                height="20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ExperienceSection);
