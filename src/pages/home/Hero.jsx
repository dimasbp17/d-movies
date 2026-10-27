import { useCallback, useEffect, useState } from 'react';
import { HiInformationCircle, HiPlay } from 'react-icons/hi2';
import { IoStar } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Img from '../../components/ui/Img';
import TrailerModal from '../../components/ui/TrailerModal';
import WatchlistButton from '../../components/ui/WatchlistButton';
import useGenres, { genreNames } from '../../hooks/useGenres';
import { formatRating, img, pickLogo, pickTrailer, titleOf, typeOf, yearOf } from '../../lib/format';
import { getImages, getVideos } from '../../services/api';

const INTERVAL = 8000;

const Hero = ({ items = [] }) => {
  const [index, setIndex] = useState(0);
  const [logos, setLogos] = useState({});
  const [video, setVideo] = useState(null);
  const [paused, setPaused] = useState(false);
  const [noTrailer, setNoTrailer] = useState(false);
  const genres = useGenres();

  const current = items[index];
  const type = current ? typeOf(current) : 'movie';

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!items.length || paused || video) return;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [index, items.length, paused, video, next]);

  // Fetch the title logo (transparent PNG) for the current slide.
  useEffect(() => {
    if (!current || logos[current.id] !== undefined) return;
    getImages(type, current.id)
      .then((data) => setLogos((l) => ({ ...l, [current.id]: pickLogo(data.logos)?.file_path || null })))
      .catch(() => setLogos((l) => ({ ...l, [current.id]: null })));
  }, [current, type, logos]);

  const playTrailer = async () => {
    try {
      const data = await getVideos(type, current.id);
      const trailer = pickTrailer(data.results);
      if (trailer) setVideo(trailer);
      else {
        setNoTrailer(true);
        setTimeout(() => setNoTrailer(false), 2500);
      }
    } catch {
      /* ignore */
    }
  };

  if (!current) {
    return <div className="skeleton h-[88vh] min-h-[560px] w-full" />;
  }

  const logo = logos[current.id];

  return (
    <section
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrops (cross-fade) */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          {Math.abs(i - index) <= 1 || (index === items.length - 1 && i === 0) ? (
            <Img
              path={item.backdrop_path}
              size="original"
              alt=""
              eager={i === 0}
              className={`h-full w-full object-top ${i === index ? 'animate-ken-burns' : ''}`}
            />
          ) : null}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

      <div className="container relative flex h-full flex-col justify-end pb-28 md:justify-center md:pb-0">
        <div key={current.id} className="max-w-2xl space-y-5 animate-fade-up">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-8 bg-accent" /> Trending this week · #{index + 1}
          </p>

          {logo ? (
            <img
              src={img(logo, 'w500')}
              alt={titleOf(current)}
              className="max-h-32 w-auto max-w-[80%] object-contain object-left drop-shadow-2xl md:max-h-40"
            />
          ) : (
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              {titleOf(current)}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1 font-semibold text-white">
              <IoStar className="text-accent" /> {formatRating(current.vote_average)}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{yearOf(current)}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="rounded border border-white/20 px-1.5 text-[11px] uppercase tracking-wider">
              {type === 'tv' ? 'Series' : 'Film'}
            </span>
            {genreNames(current.genre_ids, genres).map((g) => (
              <span key={g} className="text-white/60">
                · {g}
              </span>
            ))}
          </div>

          <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            {current.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button onClick={playTrailer} className="btn-primary px-6 py-3">
              <HiPlay className="text-lg" /> {noTrailer ? 'Trailer unavailable' : 'Watch Trailer'}
            </button>
            <Link to={`/${type}/${current.id}`} className="btn-ghost px-6 py-3">
              <HiInformationCircle className="text-lg" /> More Info
            </Link>
            <WatchlistButton item={current} type={type} className="!h-12 !w-12 text-lg" />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute inset-x-0 bottom-8">
        <div className="container flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Show ${titleOf(item)}`}
              className={`relative h-1 overflow-hidden rounded-full bg-white/15 transition-all duration-500 ${
                i === index ? 'w-12' : 'w-4 hover:bg-white/30'
              }`}
            >
              {i === index && (
                <span
                  key={`${index}-${paused}`}
                  className="absolute inset-0 origin-left bg-accent"
                  style={{
                    animation: paused || video ? 'none' : `progress ${INTERVAL}ms linear both`,
                    transform: paused || video ? 'scaleX(1)' : undefined,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <TrailerModal video={video} onClose={() => setVideo(null)} />
    </section>
  );
};

export default Hero;
