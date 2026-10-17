import arrow from '../assets/Arrow-top-right.webp';
import './DirectionArrow.css';

export default function DirectionArrow({ direction = 'diagonal' }) {
  return <img src={arrow} className={`direction-arrow direction-arrow-${direction}`} width="16" height="16" alt="" aria-hidden="true" />;
}
