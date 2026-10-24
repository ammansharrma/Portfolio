import { memo } from 'react';
import { Link } from 'react-router-dom';
import './ExperienceSection.css';
import TopRightArrow from '../../assets/Arrow-top-right.webp';

const experiences = [
  { id: 'mindstix', name: 'MINDSTIX', role: 'Software Developer', dates: 'Jun 2025 — Present', summary: 'Production AI agents, real-time workflows, and full-stack delivery.' },
  { id: 'omnevu', name: 'OMNEVU', role: 'Full Stack Developer Intern', dates: 'Dec 2024 — Jun 2025', summary: 'Inventory, warranty, and retail workflows built for everyday use.' },
];
function ExperienceSection() {
  return <section className="experience-section-page page-container" id="experience" aria-labelledby="experience-heading">
    <div className="experience-layout"><h2 className="experience-main-title" id="experience-heading">EXPERIENCE</h2>
      <div className="experience-list">{experiences.map(item => <Link key={item.id} to={`/experience/${item.id}`} className="experience-row">
        <div className="experience-row-left"><div className="experience-logo"><img src={`${import.meta.env.BASE_URL}images/companies/${item.id}.${item.id === 'mindstix' ? 'svg' : 'png'}`} alt={item.id === 'omnevu' ? '' : item.name} className={`experience-company-logo experience-company-logo-${item.id}`} loading="lazy" />{item.id === 'omnevu' && <span>{item.name}</span>}</div><p className="experience-role">{item.role}</p><p className="experience-summary">{item.summary}</p></div>
        <div className="experience-row-right"><span className="experience-year">{item.dates}</span><img src={TopRightArrow} alt="" className="experience-arrow" width="20" height="20" /></div>
      </Link>)}</div>
    </div>
  </section>;
}
export default memo(ExperienceSection);
