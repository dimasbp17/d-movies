import { useState } from 'react';
import { RiBookmarkLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import EmptyState from '../../components/ui/EmptyState';
import { useWatchlist } from '../../context/WatchlistContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const FILTERS = [
  ['all', 'All'],
  ['movie', 'Movies'],
  ['tv', 'TV Shows'],
];

const SORTS = {
  added: (a, b) => b.added_at - a.added_at,
  rating: (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
  title: (a, b) => a.title.localeCompare(b.title),
  release: (a, b) => (b.date || '').localeCompare(a.date || ''),
};

const Watchlist = () => {
  const { items } = useWatchlist();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('added');
  useDocumentTitle('My Watchlist');

  const shown = items.filter((i) => filter === 'all' || i.media_type === filter).sort(SORTS[sort]);

  return (
    <div className="container pb-10 pt-28 md:pt-36">
      <header className="mb-10 animate-fade-up">
        <p className="eyebrow mb-2">Your library</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
          My <span className="text-gradient italic">Watchlist</span>
        </h1>
        <p className="mt-3 text-white/50">
          {items.length} saved title{items.length === 1 ? '' : 's'} · stored privately in this browser.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={RiBookmarkLine}
          title="Your watchlist is empty"
          description="Tap the bookmark on any movie or show to save it here for later."
        >
          <Link to="/movie" className="btn-primary">
            Start exploring
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="glass flex rounded-full p-1">
              {FILTERS.map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === k ? 'bg-accent text-ink-950' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="added">Recently added</option>
              <option value="rating">Highest rated</option>
              <option value="release">Newest release</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shown.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={{ ...item, release_date: item.date }}
                type={item.media_type}
                showType
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Watchlist;
