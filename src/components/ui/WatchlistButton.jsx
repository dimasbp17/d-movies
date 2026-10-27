import { RiBookmarkFill, RiBookmarkLine } from 'react-icons/ri';
import { useWatchlist } from '../../context/WatchlistContext';
import { typeOf } from '../../lib/format';

const WatchlistButton = ({ item, type, variant = 'icon', className = '' }) => {
  const { has, toggle } = useWatchlist();
  const mediaType = type || typeOf(item);
  const saved = has(mediaType, item.id);
  const Icon = saved ? RiBookmarkFill : RiBookmarkLine;
  const label = saved ? 'Remove from watchlist' : 'Add to watchlist';

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(item, mediaType);
  };

  if (variant === 'button') {
    return (
      <button onClick={onClick} className={`btn-ghost ${saved ? 'text-accent' : ''} ${className}`}>
        <Icon className="text-base" />
        {saved ? 'In Watchlist' : 'Watchlist'}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-ink-950/60 backdrop-blur-md transition hover:scale-110 hover:border-accent/60 ${
        saved ? 'text-accent' : 'text-white/80'
      } ${className}`}
    >
      <Icon />
    </button>
  );
};

export default WatchlistButton;
