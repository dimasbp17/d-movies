import { useMemo } from 'react';
import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { PosterSkeleton } from '../../components/ui/Skeleton';
import useFetch from '../../hooks/useFetch';
import { formatCompact } from '../../lib/format';
import { discover, getGenres, getKeyword, getList } from '../../services/api';

const CONFIG = {
  movie: {
    title: 'Movies',
    tagline: 'From blockbuster premieres to quiet masterpieces.',
    lists: [
      ['popular', 'Popular'],
      ['now_playing', 'Now Playing'],
      ['top_rated', 'Top Rated'],
      ['upcoming', 'Upcoming'],
    ],
    dateKey: 'primary_release_year',
    sorts: [
      ['popularity.desc', 'Most popular'],
      ['vote_average.desc', 'Highest rated'],
      ['primary_release_date.desc', 'Newest'],
      ['revenue.desc', 'Box office'],
      ['vote_count.desc', 'Most voted'],
    ],
  },
  tv: {
    title: 'TV Shows',
    tagline: 'Series worth staying up late for.',
    lists: [
      ['popular', 'Popular'],
      ['airing_today', 'Airing Today'],
      ['on_the_air', 'On The Air'],
      ['top_rated', 'Top Rated'],
    ],
    dateKey: 'first_air_date_year',
    sorts: [
      ['popularity.desc', 'Most popular'],
      ['vote_average.desc', 'Highest rated'],
      ['first_air_date.desc', 'Newest'],
      ['vote_count.desc', 'Most voted'],
    ],
  },
};

const LANGUAGES = [
  ['', 'Any language'],
  ['en', 'English'],
  ['id', 'Indonesian'],
  ['ko', 'Korean'],
  ['ja', 'Japanese'],
  ['hi', 'Hindi'],
  ['es', 'Spanish'],
  ['fr', 'French'],
  ['zh', 'Chinese'],
  ['th', 'Thai'],
];

const RATINGS = [
  ['', 'Any rating'],
  ['8', '8+'],
  ['7', '7+'],
  ['6', '6+'],
  ['5', '5+'],
];

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => String(THIS_YEAR + 1 - i));

const FILTER_KEYS = ['genre', 'sort', 'year', 'rating', 'lang', 'keyword'];

const Explore = ({ type }) => {
  const cfg = CONFIG[type];
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const list = params.get('list') || 'popular';
  const selectedGenres = params.get('genre') ? params.get('genre').split(',').map(Number) : [];
  const isDiscover = FILTER_KEYS.some((k) => params.get(k));
  const keywordId = params.get('keyword');

  const { data: genres } = useFetch(() => getGenres(type), [type]);
  const { data: keyword } = useFetch(
    () => (keywordId ? getKeyword(keywordId) : Promise.resolve(null)),
    [keywordId]
  );

  const query = params.toString();
  const { data, loading, error } = useFetch(() => {
    if (!isDiscover) return getList(type, list, page);
    const sort = params.get('sort') || 'popularity.desc';
    return discover(type, {
      page,
      sort_by: sort,
      with_genres: params.get('genre') || undefined,
      with_keywords: keywordId || undefined,
      with_original_language: params.get('lang') || undefined,
      [cfg.dateKey]: params.get('year') || undefined,
      'vote_average.gte': params.get('rating') || undefined,
      // Avoid obscure titles with a single 10/10 vote dominating rating sorts.
      'vote_count.gte': sort.startsWith('vote_average') || params.get('rating') ? 150 : undefined,
    });
  }, [type, query]);

  const update = (changes, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.delete('page');
    setParams(next);
  };

  const toggleGenre = (id) => {
    const set = new Set(selectedGenres);
    set.has(id) ? set.delete(id) : set.add(id);
    update({ genre: [...set].join(','), list: null });
  };

  const clearFilters = () => setParams(new URLSearchParams());

  const changePage = (p) => {
    update({ page: p }, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heading = useMemo(() => {
    if (keyword) return `“${keyword.name}”`;
    if (isDiscover) return 'Discover';
    return cfg.lists.find(([k]) => k === list)?.[1];
  }, [keyword, isDiscover, cfg, list]);

  return (
    <div className="container pb-10 pt-28 md:pt-36">
      <header className="mb-10 animate-fade-up">
        <p className="eyebrow mb-2">{cfg.title}</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
          {heading} <span className="text-gradient italic">{isDiscover ? cfg.title.toLowerCase() : ''}</span>
        </h1>
        <p className="mt-3 text-white/50">
          {cfg.tagline}
          {data?.total_results ? (
            <span className="text-white/35"> · {formatCompact(data.total_results)} titles</span>
          ) : null}
        </p>
      </header>

      {/* Category tabs */}
      <div className="scrollbar-hide -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {cfg.lists.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setParams({ list: key })}
            className={`chip px-5 py-2 text-sm ${!isDiscover && list === key ? 'chip-active' : ''}`}
          >
            {label}
          </button>
        ))}
        <span className={`chip px-5 py-2 text-sm ${isDiscover ? 'chip-active' : 'pointer-events-none opacity-60'}`}>
          <HiAdjustmentsHorizontal /> Discover
        </span>
      </div>

      {/* Filters */}
      <div className="glass mb-10 space-y-4 rounded-3xl p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <select className="select" value={params.get('sort') || ''} onChange={(e) => update({ sort: e.target.value })}>
            <option value="">Sort by</option>
            {cfg.sorts.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select className="select" value={params.get('year') || ''} onChange={(e) => update({ year: e.target.value })}>
            <option value="">Any year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select className="select" value={params.get('rating') || ''} onChange={(e) => update({ rating: e.target.value })}>
            {RATINGS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select className="select" value={params.get('lang') || ''} onChange={(e) => update({ lang: e.target.value })}>
            {LANGUAGES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          {keyword && (
            <button className="chip chip-active" onClick={() => update({ keyword: null })}>
              #{keyword.name} <HiXMark />
            </button>
          )}
          {isDiscover && (
            <button onClick={clearFilters} className="ml-auto text-sm font-medium text-white/50 transition hover:text-accent">
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {genres?.map((g) => (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className={`chip ${selectedGenres.includes(g.id) ? 'chip-active' : ''}`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <EmptyState title="Something went wrong" description="We couldn't reach TMDB. Please try again in a moment." />
      ) : !loading && !data?.results.length ? (
        <EmptyState title="Nothing matches those filters" description="Try loosening your filters.">
          <button onClick={clearFilters} className="btn-primary">
            Reset filters
          </button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => <PosterSkeleton key={i} />)
            : data.results.map((item) => <MediaCard key={item.id} item={item} type={type} />)}
        </div>
      )}

      {!loading && data && <Pagination page={page} totalPages={data.total_pages} onChange={changePage} />}
    </div>
  );
};

export default Explore;
