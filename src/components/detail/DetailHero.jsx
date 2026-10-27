import { useState } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { img, pickLogo, pickTrailer, titleOf } from '../../lib/format';
import Img from '../ui/Img';
import RatingRing from '../ui/RatingRing';
import TrailerModal from '../ui/TrailerModal';
import WatchlistButton from '../ui/WatchlistButton';
import ExternalLinks from './ExternalLinks';

/**
 * Cinematic header for movie & TV detail pages.
 * `meta` is a list of short strings (year, runtime…), `crew` a list of {name, id, job}.
 */
const DetailHero = ({ item, type, certification, meta = [], crew = [] }) => {
  const [video, setVideo] = useState(null);
  const trailer = pickTrailer(item.videos?.results);
  const logo = pickLogo(item.images?.logos);
  const title = titleOf(item);

  return (
    <section className="relative">
      <div className="absolute inset-0 h-[85vh] min-h-[600px] overflow-hidden">
        <Img path={item.backdrop_path} size="original" alt="" eager className="h-full w-full object-top animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/50" />
      </div>

      <div className="container relative grid gap-10 pb-12 pt-28 md:grid-cols-[minmax(0,300px)_1fr] md:items-end md:pt-44 lg:gap-14">
        <div className="mx-auto w-52 animate-fade-up md:mx-0 md:w-full">
          <Img
            path={item.poster_path}
            size="w500"
            alt={title}
            eager
            className="aspect-[2/3] w-full rounded-3xl shadow-2xl ring-1 ring-white/10"
          />
        </div>

        <div className="space-y-6 animate-fade-up [animation-delay:120ms]">
          {logo ? (
            <>
              <h1 className="sr-only">{title}</h1>
              <img
                src={img(logo.file_path, 'w500')}
                alt={title}
                className="max-h-28 w-auto max-w-[85%] object-contain object-left drop-shadow-2xl md:max-h-36"
              />
            </>
          ) : (
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              {title}
            </h1>
          )}

          {item.tagline && <p className="font-display text-lg italic text-accent-soft/90">“{item.tagline}”</p>}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            {certification && (
              <span className="rounded-md border border-white/25 px-2 py-0.5 text-xs font-semibold text-white">
                {certification}
              </span>
            )}
            {meta.filter(Boolean).map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-white/30" />}
                {m}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {item.genres?.map((g) => (
              <Link key={g.id} to={`/${type}?genre=${g.id}`} className="chip">
                {g.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <RatingRing value={item.vote_average} size={60} />
              <div className="text-xs leading-tight text-white/50">
                <span className="block font-semibold text-white">User Score</span>
                {item.vote_count?.toLocaleString()} votes
              </div>
            </div>
            {trailer && (
              <button onClick={() => setVideo(trailer)} className="btn-primary px-6 py-3">
                <HiPlay className="text-lg" /> Play Trailer
              </button>
            )}
            <WatchlistButton item={item} type={type} variant="button" className="px-6 py-3" />
          </div>

          {item.overview && (
            <div className="max-w-3xl">
              <h2 className="eyebrow mb-2">Overview</h2>
              <p className="leading-relaxed text-white/75">{item.overview}</p>
            </div>
          )}

          {crew.length > 0 && (
            <dl className="grid max-w-3xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {crew.map((c) => (
                <div key={`${c.id}-${c.job}`}>
                  <dt>
                    <Link to={`/person/${c.id}`} className="font-semibold text-white transition hover:text-accent">
                      {c.name}
                    </Link>
                  </dt>
                  <dd className="text-xs text-white/45">{c.job}</dd>
                </div>
              ))}
            </dl>
          )}

          <ExternalLinks ids={item.external_ids} homepage={item.homepage} />
        </div>
      </div>

      <TrailerModal video={video} onClose={() => setVideo(null)} />
    </section>
  );
};

export default DetailHero;
