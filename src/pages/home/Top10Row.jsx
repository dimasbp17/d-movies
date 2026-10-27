import { Link } from 'react-router-dom';
import Img from '../../components/ui/Img';
import Row from '../../components/ui/Row';
import { titleOf } from '../../lib/format';

/** "Top 10" row with oversized outlined rank numbers. */
const Top10Row = ({ items = [], loading }) => (
  <Row
    eyebrow="All-time greats"
    title="Top 10 Highest Rated"
    to="/movie?list=top_rated"
    loading={loading}
    items={items.slice(0, 10)}
    itemClassName="w-[200px] sm:w-[230px] lg:w-[260px]"
    skeleton={<div className="skeleton ml-16 aspect-[2/3] rounded-2xl" />}
    renderItem={(item, i) => (
      <Link to={`/movie/${item.id}`} className="group flex items-end">
        <span
          className="-mr-5 select-none font-display text-[110px] font-bold leading-[0.8] text-transparent transition duration-500 group-hover:-translate-x-1 sm:text-[140px]"
          style={{ WebkitTextStroke: '2px rgba(242,196,109,.55)' }}
        >
          {i + 1}
        </span>
        <div className="relative aspect-[2/3] flex-1 overflow-hidden rounded-2xl shadow-card ring-1 ring-white/5 transition duration-500 group-hover:-translate-y-1 group-hover:ring-accent/40">
          <Img
            path={item.poster_path}
            size="w342"
            alt={titleOf(item)}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
    )}
  />
);

export default Top10Row;
