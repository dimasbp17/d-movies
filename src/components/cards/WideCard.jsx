import { IoStar } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { formatRating, titleOf, typeOf, yearOf } from '../../lib/format';
import Img from '../ui/Img';
import WatchlistButton from '../ui/WatchlistButton';

/** Landscape backdrop card — used for discover grids and upcoming releases. */
const WideCard = ({ item, type, meta, badge }) => {
  const mediaType = type || typeOf(item);
  const title = titleOf(item);

  return (
    <div className="group relative">
      <Link
        to={`/${mediaType}/${item.id}`}
        className="relative block aspect-video overflow-hidden rounded-2xl bg-ink-800 shadow-card ring-1 ring-white/5 transition duration-500 hover:ring-accent/40"
      >
        <Img
          path={item.backdrop_path || item.poster_path}
          size="w780"
          alt={title}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
            {badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-white transition group-hover:text-accent">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
            <span className="flex items-center gap-1 text-white/80">
              <IoStar className="text-accent" /> {formatRating(item.vote_average)}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="line-clamp-1">{meta ?? yearOf(item)}</span>
          </div>
        </div>
      </Link>
      <WatchlistButton
        item={item}
        type={mediaType}
        className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      />
    </div>
  );
};

export default WideCard;
