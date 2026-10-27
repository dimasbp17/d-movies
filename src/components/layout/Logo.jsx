import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => (
  <Link to="/" className={`group inline-flex items-baseline gap-0.5 ${className}`} aria-label="D-Movies home">
    <span className="font-display text-2xl font-bold italic tracking-tight text-white">D</span>
    <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
    <span className="font-display text-2xl font-semibold tracking-tight text-white/90">Movies</span>
  </Link>
);

export default Logo;
