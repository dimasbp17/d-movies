import { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import PersonCard from '../../components/cards/PersonCard';
import WideCard from '../../components/cards/WideCard';
import Row from '../../components/ui/Row';
import SectionHeader from '../../components/ui/SectionHeader';
import { PersonSkeleton, WideSkeleton } from '../../components/ui/Skeleton';
import useFetch from '../../hooks/useFetch';
import { formatShortDate, img, titleOf } from '../../lib/format';
import { discover, getGenres, getList, getPopularPeople, getTrending } from '../../services/api';
import Hero from './Hero';
import Top10Row from './Top10Row';

const Toggle = ({ value, options, onChange }) => (
  <div className="glass flex rounded-full p-1">
    {options.map(([key, label]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
          value === key ? 'bg-accent text-ink-950' : 'text-white/60 hover:text-white'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

const TrendingRow = () => {
  const [timeWindow, setTimeWindow] = useState('day');
  const { data, loading } = useFetch(() => getTrending('all', timeWindow), [timeWindow]);

  return (
    <Row
      eyebrow="What everyone's watching"
      title="Trending Now"
      loading={loading}
      items={(data?.results || []).filter((i) => i.media_type !== 'person')}
      renderItem={(item) => <MediaCard item={item} showType />}
      headerExtra={
        <Toggle
          value={timeWindow}
          onChange={setTimeWindow}
          options={[
            ['day', 'Today'],
            ['week', 'This Week'],
          ]}
        />
      }
    />
  );
};

const GenreDiscover = () => {
  const { data: genres } = useFetch(() => getGenres('movie'), []);
  const [genre, setGenre] = useState(28);
  const { data, loading } = useFetch(
    () => discover('movie', { with_genres: genre, sort_by: 'popularity.desc', 'vote_count.gte': 200 }),
    [genre]
  );
  const name = genres?.find((g) => g.id === genre)?.name;

  return (
    <section className="animate-fade-up">
      <SectionHeader
        eyebrow="Find your mood"
        title="Browse by Genre"
        to={`/movie?genre=${genre}`}
        linkLabel={name ? `More ${name}` : 'See all'}
      />
      <div className="scrollbar-hide -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {genres?.map((g) => (
          <button key={g.id} onClick={() => setGenre(g.id)} className={`chip ${genre === g.id ? 'chip-active' : ''}`}>
            {g.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <WideSkeleton key={i} />)
          : data?.results.slice(0, 8).map((m) => <WideCard key={m.id} item={m} type="movie" />)}
      </div>
    </section>
  );
};

const Spotlight = ({ item }) => {
  if (!item) return null;
  return (
    <Link
      to={`/movie/${item.id}`}
      className="group relative block overflow-hidden rounded-[2rem] ring-1 ring-white/10"
    >
      <img
        src={img(item.backdrop_path, 'w1280')}
        alt=""
        loading="lazy"
        className="h-[420px] w-full object-cover transition duration-[1500ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14">
        <p className="eyebrow mb-3">Coming soon to theaters</p>
        <h3 className="max-w-lg font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
          {titleOf(item)}
        </h3>
        <p className="mt-3 text-sm text-white/60">Premieres {formatShortDate(item.release_date)}</p>
        <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-white/70">{item.overview}</p>
        <span className="btn-primary mt-6 w-fit">Explore the film</span>
      </div>
    </Link>
  );
};

const Home = () => {
  const trending = useFetch(() => getTrending('movie', 'week'), []);
  const nowPlaying = useFetch(() => getList('movie', 'now_playing'), []);
  const popular = useFetch(() => getList('movie', 'popular'), []);
  const topRated = useFetch(() => getList('movie', 'top_rated'), []);
  const upcoming = useFetch(() => getList('movie', 'upcoming'), []);
  const popularTv = useFetch(() => getList('tv', 'popular'), []);
  const topTv = useFetch(() => getList('tv', 'top_rated'), []);
  const people = useFetch(() => getPopularPeople(), []);

  const heroItems = (trending.data?.results || []).filter((m) => m.backdrop_path).slice(0, 7);
  const upcomingItems = (upcoming.data?.results || [])
    .filter((m) => m.backdrop_path)
    .sort((a, b) => b.popularity - a.popularity);

  return (
    <>
      <Hero items={heroItems} />

      <div className="container relative z-10 mt-4 space-y-20">
        <TrendingRow />

        <Row
          eyebrow="In cinemas"
          title="Now Playing"
          to="/movie?list=now_playing"
          loading={nowPlaying.loading}
          items={nowPlaying.data?.results}
          renderItem={(item) => <WideCard item={item} type="movie" />}
          itemClassName="w-[280px] sm:w-[340px] lg:w-[400px]"
          skeleton={<WideSkeleton />}
        />

        <Row
          eyebrow="Fan favourites"
          title="Popular Movies"
          to="/movie?list=popular"
          loading={popular.loading}
          items={popular.data?.results}
          renderItem={(item) => <MediaCard item={item} type="movie" />}
        />

        <Top10Row items={topRated.data?.results} loading={topRated.loading} />

        <GenreDiscover />

        <Spotlight item={upcomingItems[0]} />

        <Row
          eyebrow="Mark your calendar"
          title="Upcoming Releases"
          to="/movie?list=upcoming"
          loading={upcoming.loading}
          items={upcomingItems.slice(1)}
          renderItem={(item) => (
            <WideCard item={item} type="movie" badge="Soon" meta={formatShortDate(item.release_date)} />
          )}
          itemClassName="w-[280px] sm:w-[340px] lg:w-[400px]"
          skeleton={<WideSkeleton />}
        />

        <Row
          eyebrow="Binge-worthy"
          title="Popular TV Shows"
          to="/tv?list=popular"
          loading={popularTv.loading}
          items={popularTv.data?.results}
          renderItem={(item) => <MediaCard item={item} type="tv" />}
        />

        <Row
          eyebrow="Faces of the moment"
          title="Popular People"
          to="/people"
          loading={people.loading}
          items={people.data?.results}
          renderItem={(p) => <PersonCard person={p} round subtitle={p.known_for_department} />}
          itemClassName="w-[110px] sm:w-[130px] lg:w-[150px]"
          skeleton={<PersonSkeleton round />}
        />

        <Row
          eyebrow="Critically acclaimed"
          title="Top Rated Series"
          to="/tv?list=top_rated"
          loading={topTv.loading}
          items={topTv.data?.results}
          renderItem={(item) => <MediaCard item={item} type="tv" />}
        />
      </div>
    </>
  );
};

export default Home;
