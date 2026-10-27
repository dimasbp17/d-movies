import { useParams } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import EmptyState from '../../components/ui/EmptyState';
import Img from '../../components/ui/Img';
import RatingRing from '../../components/ui/RatingRing';
import { PageSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { formatShortDate } from '../../lib/format';
import { getCollection } from '../../services/api';

const CollectionDetail = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => getCollection(id), [id]);
  useDocumentTitle(data?.name);

  if (loading) return <PageSkeleton />;
  if (error || !data)
    return (
      <div className="container pt-36">
        <EmptyState title="Collection not found" />
      </div>
    );

  const parts = [...data.parts].sort((a, b) => (a.release_date || '9999').localeCompare(b.release_date || '9999'));
  const rated = parts.filter((p) => p.vote_average);
  const avg = rated.length ? rated.reduce((s, p) => s + p.vote_average, 0) / rated.length : 0;
  const released = parts.filter((p) => p.release_date && new Date(p.release_date) <= new Date());

  return (
    <div>
      <section className="relative">
        <div className="absolute inset-0 h-[75vh] overflow-hidden">
          <Img path={data.backdrop_path} size="original" eager className="h-full w-full object-top animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />
        </div>
        <div className="container relative grid gap-10 pb-16 pt-32 md:grid-cols-[260px_1fr] md:items-end md:pt-48">
          <Img
            path={data.poster_path}
            size="w500"
            alt={data.name}
            className="mx-auto aspect-[2/3] w-48 rounded-3xl shadow-2xl ring-1 ring-white/10 md:w-full"
          />
          <div className="space-y-5 animate-fade-up">
            <p className="eyebrow">Collection</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <RatingRing value={avg} size={56} />
                <span className="text-xs text-white/50">
                  <span className="block font-semibold text-white">Average score</span>
                  across {rated.length} films
                </span>
              </div>
              <div className="text-sm text-white/60">
                <span className="block font-display text-2xl text-white">{parts.length}</span> films
              </div>
              {released.length > 0 && (
                <div className="text-sm text-white/60">
                  <span className="block font-display text-2xl text-white">
                    {released[0].release_date.slice(0, 4)}–{released[released.length - 1].release_date.slice(0, 4)}
                  </span>
                  span
                </div>
              )}
            </div>
            {data.overview && <p className="max-w-3xl leading-relaxed text-white/70">{data.overview}</p>}
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="heading mb-8">In chronological order</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {parts.map((p, i) => (
            <MediaCard
              key={p.id}
              item={p}
              type="movie"
              subtitle={`Part ${i + 1} · ${p.release_date ? formatShortDate(p.release_date) : 'TBA'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
