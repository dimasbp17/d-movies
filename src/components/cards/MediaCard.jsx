import { IoStar } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { formatRating, titleOf, typeOf, yearOf } from '../../lib/format';
import Img from '../ui/Img';
import WatchlistButton from '../ui/WatchlistButton';

/** Portrait poster card used across rows and grids. */
const MediaCard = ({ item, type, subtitle, showType = false }) => {
  const mediaType = type || typeOf(item);
  const title = titleOf(item);

  return (
    <div className="group relative">
      <Link to={`/${mediaType}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-ink-800 shadow-card ring-1 ring-white/5 transition duration-500 group-hover:-translate-y-1 group-hover:ring-accent/40">
          <Img
            path={item.poster_path}
            size="w342"
            alt={title}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/0 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-ink-950/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <IoStar className="text-accent" />
            {formatRating(item.vote_average)}
          </div>

          {item.overview && (
            <p className="absolute inset-x-3 bottom-3 line-clamp-3 translate-y-2 text-[11px] leading-relaxed text-white/80 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {item.overview}
            </p>
          )}
        </div>

        <div className="mt-3 space-y-0.5 px-0.5">
          <h3 className="line-clamp-1 text-sm font-semibold text-white/90 transition group-hover:text-accent">
            {title}
          </h3>
          <p className="text-xs text-white/45">
            {subtitle ?? (
              <>
                {yearOf(item) || 'TBA'}
                {showType && <span> · {mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>}
              </>
            )}
          </p>
        </div>
      </Link>

      <WatchlistButton
        item={item}
        type={mediaType}
        className="absolute right-2.5 top-2.5 opacity-0 transition group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      />
    </div>
  );
};

export default MediaCard;
