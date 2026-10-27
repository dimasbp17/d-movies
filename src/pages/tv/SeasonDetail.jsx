import { useState } from 'react';
import { HiArrowLeft, HiChevronDown } from 'react-icons/hi2';
import { IoStar } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState';
import Img from '../../components/ui/Img';
import { PageSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { formatRating, formatRuntime, formatShortDate } from '../../lib/format';
import { getSeason, getTv } from '../../services/api';

const Episode = ({ ep }) => {
  const [open, setOpen] = useState(false);
  const guests = ep.guest_stars?.slice(0, 6) || [];
  const director = ep.crew?.find((c) => c.job === 'Director');

  return (
    <article className="glass overflow-hidden rounded-3xl transition hover:border-white/20">
      <div className="flex flex-col gap-5 p-4 sm:flex-row">
        <div className="relative shrink-0 sm:w-64">
          <Img path={ep.still_path} size="w500" alt={ep.name} className="aspect-video w-full rounded-2xl" />
          <span className="absolute left-2 top-2 rounded-full bg-ink-950/75 px-2.5 py-1 text-xs font-bold text-accent backdrop-blur">
            E{String(ep.episode_number).padStart(2, '0')}
          </span>
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-display text-xl font-semibold text-white">{ep.name}</h3>
            {ep.vote_average > 0 && (
              <span className="flex items-center gap-1 text-sm font-semibold text-white">
                <IoStar className="text-accent" /> {formatRating(ep.vote_average)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/45">
            {formatShortDate(ep.air_date)}
            {ep.runtime ? ` · ${formatRuntime(ep.runtime)}` : ''}
            {director ? ` · Directed by ${director.name}` : ''}
          </p>
          <p className={`mt-3 text-sm leading-relaxed text-white/65 ${open ? '' : 'line-clamp-3'}`}>
            {ep.overview || 'No synopsis available yet.'}
          </p>
          {(guests.length > 0 || ep.overview?.length > 220) && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent"
            >
              {open ? 'Less' : 'More'} <HiChevronDown className={`transition ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
      {open && guests.length > 0 && (
        <div className="border-t border-white/5 px-4 py-4 animate-fade-in">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Guest stars</p>
          <div className="flex flex-wrap gap-3">
            {guests.map((g) => (
              <Link key={g.credit_id} to={`/person/${g.id}`} className="group flex items-center gap-2.5 rounded-full bg-white/5 py-1 pl-1 pr-4 hover:bg-white/10">
                <Img path={g.profile_path} size="w92" person className="h-8 w-8 rounded-full" />
                <span className="text-xs">
                  <span className="block font-medium text-white group-hover:text-accent">{g.name}</span>
                  <span className="text-white/40">{g.character}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

const SeasonDetail = () => {
  const { id, season } = useParams();
  const { data: tv } = useFetch(() => getTv(id), [id]);
  const { data, loading, error } = useFetch(() => getSeason(id, season), [id, season]);
  useDocumentTitle(tv && data ? `${tv.name} — ${data.name}` : null);

  if (loading) return <PageSkeleton />;
  if (error || !data)
    return (
      <div className="container pt-36">
        <EmptyState title="Season not found" />
      </div>
    );

  const seasons = tv?.seasons?.filter((s) => s.episode_count > 0) || [];

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[60vh] overflow-hidden">
        <Img path={tv?.backdrop_path} size="original" className="h-full w-full object-top opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      </div>

      <div className="container relative pt-28 md:pt-36">
        <Link to={`/tv/${id}`} className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-accent">
          <HiArrowLeft /> Back to {tv?.name || 'series'}
        </Link>

        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-end">
          <Img
            path={data.poster_path || tv?.poster_path}
            size="w342"
            alt={data.name}
            className="hidden aspect-[2/3] w-full rounded-3xl shadow-2xl ring-1 ring-white/10 md:block"
          />
          <div className="space-y-4 animate-fade-up">
            <p className="eyebrow">{tv?.name}</p>
            <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">{data.name}</h1>
            <p className="text-sm text-white/50">
              {data.episodes?.length} episodes · Premiered {formatShortDate(data.air_date)}
              {data.vote_average > 0 && ` · ★ ${formatRating(data.vote_average)}`}
            </p>
            {data.overview && <p className="max-w-3xl leading-relaxed text-white/70">{data.overview}</p>}
          </div>
        </div>

        {seasons.length > 1 && (
          <div className="scrollbar-hide -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {seasons.map((s) => (
              <Link
                key={s.id}
                to={`/tv/${id}/season/${s.season_number}`}
                className={`chip px-4 py-2 text-sm ${String(s.season_number) === season ? 'chip-active' : ''}`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 space-y-4">
          {data.episodes?.map((ep) => (
            <Episode key={ep.id} ep={ep} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonDetail;
