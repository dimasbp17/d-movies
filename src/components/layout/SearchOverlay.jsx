import { useEffect, useRef, useState } from 'react';
import { HiArrowRight, HiMagnifyingGlass } from 'react-icons/hi2';
import { IoStar } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { formatRating, titleOf, yearOf } from '../../lib/format';
import { search } from '../../services/api';
import Img from '../ui/Img';
import Modal from '../ui/Modal';

const TYPE_LABEL = { movie: 'Movie', tv: 'TV Series', person: 'Person' };

/** Command-palette style quick search across movies, TV & people. */
const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50);
    else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      search('multi', q)
        .then((data) => {
          setResults(data.results.filter((r) => ['movie', 'tv', 'person'].includes(r.media_type)).slice(0, 8));
          setActive(0);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const hrefOf = (r) => `/${r.media_type}/${r.id}`;

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const picked = results[active];
      go(picked ? hrefOf(picked) : `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} showClose={false} className="w-full max-w-2xl self-start sm:mt-[10vh]">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-850/95 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/5 px-5">
          <HiMagnifyingGlass className="shrink-0 text-xl text-accent" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search movies, TV shows, people…"
            className="h-16 w-full bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd
            onClick={onClose}
            className="cursor-pointer rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40"
          >
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-4 py-10 text-center text-sm text-white/40">
              Start typing to search across thousands of titles and people.
            </p>
          )}

          {query.trim() && loading && !results.length && (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton h-16 w-11 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3.5 w-1/2 rounded-full" />
                    <div className="skeleton h-3 w-1/4 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {query.trim() && !loading && !results.length && (
            <p className="px-4 py-10 text-center text-sm text-white/40">No results for “{query}”.</p>
          )}

          {results.map((r, i) => (
            <Link
              key={`${r.media_type}-${r.id}`}
              to={hrefOf(r)}
              onClick={onClose}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-4 rounded-2xl p-2 transition ${active === i ? 'bg-white/[0.06]' : ''}`}
            >
              <Img
                path={r.poster_path || r.profile_path}
                size="w92"
                alt={titleOf(r)}
                person={r.media_type === 'person'}
                className={`h-16 w-11 shrink-0 ${r.media_type === 'person' ? 'rounded-full !w-16' : 'rounded-lg'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-medium text-white">{titleOf(r)}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-white/60">{TYPE_LABEL[r.media_type]}</span>
                  {r.media_type === 'person' ? (
                    <span className="line-clamp-1">{r.known_for_department}</span>
                  ) : (
                    <>
                      <span>{yearOf(r) || 'TBA'}</span>
                      <span className="flex items-center gap-1">
                        <IoStar className="text-accent" /> {formatRating(r.vote_average)}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <button
              onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
              onMouseEnter={() => setActive(results.length)}
              className={`mt-1 flex w-full items-center justify-center gap-2 rounded-2xl p-3 text-sm font-medium text-accent transition ${
                active === results.length ? 'bg-accent/10' : ''
              }`}
            >
              See all results for “{query.trim()}” <HiArrowRight />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchOverlay;
