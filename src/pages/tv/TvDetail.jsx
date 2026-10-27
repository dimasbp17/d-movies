import { Link, useParams } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import CastRow from '../../components/detail/CastRow';
import DetailHero from '../../components/detail/DetailHero';
import FactsPanel from '../../components/detail/FactsPanel';
import MediaGallery from '../../components/detail/MediaGallery';
import Reviews from '../../components/detail/Reviews';
import WatchProviders from '../../components/detail/WatchProviders';
import EmptyState from '../../components/ui/EmptyState';
import Img from '../../components/ui/Img';
import Row from '../../components/ui/Row';
import SectionHeader from '../../components/ui/SectionHeader';
import { PageSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { formatDate, formatRating, formatShortDate, languageName, yearOf } from '../../lib/format';
import { FALLBACK_REGION, getTv, REGION } from '../../services/api';

const ratingOf = (contentRatings) =>
  [REGION, FALLBACK_REGION]
    .map((r) => contentRatings?.results?.find((c) => c.iso_3166_1 === r)?.rating)
    .find(Boolean) || null;

const yearsOf = (tv) => {
  const start = yearOf(tv);
  if (!start) return null;
  if (tv.in_production) return `${start}–present`;
  const end = tv.last_air_date?.slice(0, 4);
  return end && end !== start ? `${start}–${end}` : start;
};

const EpisodeCard = ({ label, episode, tvId }) => (
  <Link
    to={`/tv/${tvId}/season/${episode.season_number}`}
    className="group glass flex gap-4 rounded-3xl p-3 transition hover:border-accent/30"
  >
    <Img path={episode.still_path} size="w300" className="aspect-video w-40 shrink-0 rounded-2xl" />
    <div className="min-w-0 py-1">
      <p className="eyebrow mb-1">{label}</p>
      <p className="line-clamp-1 font-semibold text-white group-hover:text-accent">{episode.name}</p>
      <p className="mt-1 text-xs text-white/45">
        S{episode.season_number} · E{episode.episode_number} · {formatShortDate(episode.air_date)}
      </p>
    </div>
  </Link>
);

const Seasons = ({ tv }) => {
  const seasons = tv.seasons?.filter((s) => s.episode_count > 0) || [];
  if (!seasons.length) return null;
  // Show the regular seasons first, specials last.
  const ordered = [...seasons.filter((s) => s.season_number > 0), ...seasons.filter((s) => s.season_number === 0)];

  return (
    <section>
      <SectionHeader
        eyebrow={`${tv.number_of_seasons} seasons · ${tv.number_of_episodes} episodes`}
        title="Seasons"
      />
      {(tv.next_episode_to_air || tv.last_episode_to_air) && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {tv.last_episode_to_air && <EpisodeCard label="Latest episode" episode={tv.last_episode_to_air} tvId={tv.id} />}
          {tv.next_episode_to_air && <EpisodeCard label="Up next" episode={tv.next_episode_to_air} tvId={tv.id} />}
        </div>
      )}
      <div className="scrollbar-hide -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {ordered.map((s) => (
          <Link
            key={s.id}
            to={`/tv/${tv.id}/season/${s.season_number}`}
            className="group w-[150px] shrink-0 snap-start md:w-[170px]"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/5 transition group-hover:ring-accent/40">
              <Img
                path={s.poster_path || tv.poster_path}
                size="w342"
                alt={s.name}
                className="h-full w-full transition duration-700 group-hover:scale-105"
              />
              {s.vote_average > 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-ink-950/70 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
                  ★ {formatRating(s.vote_average)}
                </span>
              )}
            </div>
            <p className="mt-3 line-clamp-1 text-sm font-semibold text-white/90 group-hover:text-accent">{s.name}</p>
            <p className="text-xs text-white/45">
              {s.episode_count} episodes{s.air_date ? ` · ${s.air_date.slice(0, 4)}` : ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

const TvDetail = () => {
  const { id } = useParams();
  const { data: tv, loading, error } = useFetch(() => getTv(id), [id]);
  useDocumentTitle(tv?.name);

  if (loading) return <PageSkeleton />;
  if (error || !tv)
    return (
      <div className="container pt-36">
        <EmptyState title="Series not found" description="It may have been removed from TMDB." />
      </div>
    );

  const crew = (tv.created_by || []).map((c) => ({ ...c, job: 'Creator' }));
  const runtime = tv.episode_run_time?.[0];

  return (
    <div key={id}>
      <DetailHero
        item={tv}
        type="tv"
        certification={ratingOf(tv.content_ratings)}
        meta={[
          yearsOf(tv),
          `${tv.number_of_seasons} Season${tv.number_of_seasons > 1 ? 's' : ''}`,
          runtime ? `${runtime}m / ep` : null,
          languageName(tv.original_language),
        ]}
        crew={crew}
      />

      <div className="container space-y-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-16">
            <Seasons tv={tv} />
            <CastRow title="Series Cast" cast={tv.aggregate_credits?.cast} />
            <MediaGallery videos={tv.videos?.results} images={tv.images} />
            <Reviews reviews={tv.reviews?.results} />
          </div>

          <aside className="space-y-6">
            <WatchProviders data={tv['watch/providers']} />
            <FactsPanel
              type="tv"
              facts={[
                ['Status', tv.status],
                ['Type', tv.type],
                ['First aired', formatDate(tv.first_air_date)],
                ['Last aired', formatDate(tv.last_air_date)],
                ['Original name', tv.original_name !== tv.name ? tv.original_name : null],
                ['Spoken languages', tv.spoken_languages?.map((l) => l.english_name).join(', ')],
                ['Countries', tv.production_countries?.map((c) => c.name).join(', ')],
              ]}
              companies={tv.networks}
              companiesLabel="Networks"
              keywords={tv.keywords?.results}
            />
          </aside>
        </div>

        <Row
          eyebrow="If you liked this"
          title="Recommended Series"
          items={tv.recommendations?.results}
          renderItem={(item) => <MediaCard item={item} type="tv" />}
        />
        <Row
          eyebrow="More like this"
          title="Similar Series"
          items={tv.similar?.results}
          renderItem={(item) => <MediaCard item={item} type="tv" />}
        />
      </div>
    </div>
  );
};

export default TvDetail;
