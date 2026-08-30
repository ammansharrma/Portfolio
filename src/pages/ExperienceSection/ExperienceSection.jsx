import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const EXPERIENCE = [
  { id: 'mindstix', company: 'Mindstix', role: 'Software Developer', period: 'Jun 2025 — now' },
  { id: 'omnevu', company: 'OmneVu', role: 'Intern', period: 'Dec 2024 — Jun 2025' },
];

function ExperienceSection() {
  const navigate = useNavigate();

  return (
    <section className="experience-section-page section-shell" id="experience">
      <div className="section-shell-inner">
        <h2 className="section-label">Where I Work</h2>
        <div className="index-list">
          {EXPERIENCE.map((job) => (
            <button
              key={job.id}
              type="button"
              className="index-row"
              onClick={() => navigate(`/experience/${job.id}`)}
            >
              <span className="index-row-title">{job.company}</span>
              <span className="index-row-desc">{job.role}</span>
              <span className="index-row-meta">{job.period}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ExperienceSection);
