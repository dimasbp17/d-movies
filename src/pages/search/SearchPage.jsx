import { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import PersonCard from '../../components/cards/PersonCard';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { PosterSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { formatCompact } from '../../lib/format';
import { search } from '../../services/api';

const TABS = [
  ['movie', 'Movies'],
  ['tv', 'TV Shows'],
  ['person', 'People'],
];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || 'movie';
  const page = Number(params.get('page')) || 1;
  const [draft, setDraft] = useState(q);
  useDocumentTitle(q ? `Search: ${q}` : 'Search');

  useEffect(() => setDraft(q), [q]);

  // Totals per tab so users can see where the matches are.
  const { data: counts } = useFetch(
    () =>
      q
        ? Promise.all(TABS.map(([t]) => search(t, q).then((d) => d.total_results))).then((n) =>
            Object.fromEntries(TABS.map(([t], i) => [t, n[i]]))
          )
        : Promise.resolve(null),
    [q]
  );

  const { data, loading } = useFetch(
    () => (q ? search(type, q, page) : Promise.resolve(null)),
    [q, type, page]
  );

  const submit = (e) => {
    e.preventDefault();
    if (draft.trim()) setParams({ q: draft.trim(), type });
  };

  const changePage = (p) => {
    setParams({ q, type, page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container pb-10 pt-28 md:pt-36">
      <form onSubmit={submit} className="relative mx-auto mb-10 max-w-3xl animate-fade-up">
        <HiMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-accent" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search movies, TV shows, people…"
          className="h-16 w-full rounded-full border border-white/10 bg-white/[0.04] pl-16 pr-32 text-lg text-white backdrop-blur-xl placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
          autoFocus={!q}
        />
        <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3">
          Search
        </button>
      </form>

      {!q ? (
        <EmptyState
          icon={HiMagnifyingGlass}
          title="What are you in the mood for?"
          description="Search by title, actor, director — anything. Tip: press Ctrl K anywhere to search quickly."
        />
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-2xl text-white md:text-3xl">
              Results for <span className="text-gradient italic">“{q}”</span>
            </h1>
            <div className="glass flex rounded-full p-1">
              {TABS.map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setParams({ q, type: t })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    type === t ? 'bg-accent text-ink-950' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                  {counts && <span className="ml-1.5 opacity-60">{formatCompact(counts[t])}</span>}
                </button>
              ))}
            </div>
          </div>

          {!loading && !data?.results.length ? (
            <EmptyState title="No matches" description="Try another spelling or switch tabs above." />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <PosterSkeleton key={i} />)
                : data.results.map((item) =>
                    type === 'person' ? (
                      <PersonCard key={item.id} person={item} subtitle={item.known_for_department} />
                    ) : (
                      <MediaCard key={item.id} item={item} type={type} />
                    )
                  )}
            </div>
          )}

          {!loading && data && <Pagination page={page} totalPages={data.total_pages} onChange={changePage} />}
        </>
      )}
    </div>
  );
};

export default SearchPage;
