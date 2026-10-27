import { Link } from 'react-router-dom';
import Img from '../ui/Img';

const PersonCard = ({ person, subtitle, round = false }) => (
  <Link to={`/person/${person.id}`} className="group block text-center">
    <div
      className={`relative mx-auto overflow-hidden bg-ink-800 ring-1 ring-white/5 transition duration-500 group-hover:ring-2 group-hover:ring-accent/60 ${
        round ? 'aspect-square rounded-full' : 'aspect-[3/4] rounded-2xl'
      }`}
    >
      <Img
        path={person.profile_path}
        size={round ? 'w185' : 'w342'}
        alt={person.name}
        person
        className="h-full w-full grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
      />
    </div>
    <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-white/90 transition group-hover:text-accent">
      {person.name}
    </h3>
    {subtitle && <p className="line-clamp-1 text-xs text-white/45">{subtitle}</p>}
  </Link>
);

export default PersonCard;
