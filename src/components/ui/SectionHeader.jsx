import { HiArrowRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const SectionHeader = ({ eyebrow, title, to, linkLabel = 'See all', children }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
      <h2 className="heading">{title}</h2>
    </div>
    <div className="flex items-center gap-2">
      {children}
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/60 transition hover:text-accent"
        >
          {linkLabel}
          <HiArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  </div>
);

export default SectionHeader;
