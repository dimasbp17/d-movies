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
import { PageSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { formatDate, formatMoney, formatRuntime, languageName, yearOf } from '../../lib/format';
import { FALLBACK_REGION, getMovie, REGION } from '../../services/api';

const KEY_JOBS = ['Director', 'Screenplay', 'Writer', 'Story', 'Novel', 'Original Music Composer', 'Director of Photography'];

const certificationOf = (releaseDates) => {
  for (const region of [REGION, FALLBACK_REGION]) {
    const entry = releaseDates?.results?.find((r) => r.iso_3166_1 === region);
    const cert = entry?.release_dates.find((d) => d.certification)?.certification;
    if (cert) return cert;
  }
  return null;
};

const keyCrew = (crew = []) => {
  const seen = new Set();
  return crew
    .filter((c) => KEY_JOBS.includes(c.job))
    .sort((a, b) => KEY_JOBS.indexOf(a.job) - KEY_JOBS.indexOf(b.job))
    .filter((c) => {
      const k = `${c.id}-${c.job}`;
      return seen.has(k) ? false : seen.add(k);
    })
    .slice(0, 6);
};

const CollectionBanner = ({ collection }) => (
  <Link
    to={`/collection/${collection.id}`}
    className="group relative block overflow-hidden rounded-3xl ring-1 ring-white/10"
  >
    <Img
      path={collection.backdrop_path}
      size="w1280"
      className="h-52 w-full transition duration-[1500ms] group-hover:scale-105 md:h-60"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/10" />
    <div className="absolute inset-0 flex flex-col justify-center p-8">
      <p className="eyebrow mb-2">Part of a saga</p>
      <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">{collection.name}</h3>
      <span className="btn-ghost mt-5 w-fit">View the collection</span>
    </div>
  </Link>
);

const MovieDetail = () => {
  const { id } = useParams();
  const { data: movie, loading, error } = useFetch(() => getMovie(id), [id]);
  useDocumentTitle(movie?.title);

  if (loading) return <PageSkeleton />;
  if (error || !movie)
    return (
      <div className="container pt-36">
        <EmptyState title="Movie not found" description="It may have been removed from TMDB." />
      </div>
    );

  const profit = movie.revenue && movie.budget ? movie.revenue - movie.budget : null;

  return (
    <div key={id}>
      <DetailHero
        item={movie}
        type="movie"
        certification={certificationOf(movie.release_dates)}
        meta={[yearOf(movie), formatRuntime(movie.runtime), languageName(movie.original_language)]}
        crew={keyCrew(movie.credits?.crew)}
      />

      <div className="container space-y-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-16">
            <CastRow cast={movie.credits?.cast} />
            {movie.belongs_to_collection && <CollectionBanner collection={movie.belongs_to_collection} />}
            <MediaGallery videos={movie.videos?.results} images={movie.images} />
            <Reviews reviews={movie.reviews?.results} />
          </div>

          <aside className="space-y-6">
            <WatchProviders data={movie['watch/providers']} />
            <FactsPanel
              type="movie"
              facts={[
                ['Status', movie.status],
                ['Release date', formatDate(movie.release_date)],
                ['Original title', movie.original_title !== movie.title ? movie.original_title : null],
                ['Spoken languages', movie.spoken_languages?.map((l) => l.english_name).join(', ')],
                ['Budget', formatMoney(movie.budget)],
                ['Revenue', formatMoney(movie.revenue)],
                [
                  'Profit',
                  profit !== null ? (
                    <span className={profit >= 0 ? 'text-emerald-300' : 'text-rose-glow'}>{formatMoney(profit)}</span>
                  ) : null,
                ],
                ['Countries', movie.production_countries?.map((c) => c.name).join(', ')],
              ]}
              companies={movie.production_companies}
              keywords={movie.keywords?.keywords}
            />
          </aside>
        </div>

        <Row
          eyebrow="If you liked this"
          title="Recommended for You"
          items={movie.recommendations?.results}
          renderItem={(item) => <MediaCard item={item} type="movie" />}
        />
        <Row
          eyebrow="More like this"
          title="Similar Movies"
          items={movie.similar?.results}
          renderItem={(item) => <MediaCard item={item} type="movie" />}
        />
      </div>
    </div>
  );
};

export default MovieDetail;
