import { useSearchParams } from 'react-router-dom';
import PersonCard from '../../components/cards/PersonCard';
import Pagination from '../../components/ui/Pagination';
import { PersonSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { titleOf } from '../../lib/format';
import { getPopularPeople } from '../../services/api';

const People = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const { data, loading } = useFetch(() => getPopularPeople(page), [page]);
  useDocumentTitle('Popular People');

  const changePage = (p) => {
    setParams({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container pb-10 pt-28 md:pt-36">
      <header className="mb-12 animate-fade-up">
        <p className="eyebrow mb-2">People</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
          The faces <span className="text-gradient italic">behind the screen</span>
        </h1>
        <p className="mt-3 text-white/50">Actors, directors and creators trending on TMDB right now.</p>
      </header>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 18 }).map((_, i) => <PersonSkeleton key={i} />)
          : data?.results.map((p) => (
              <PersonCard
                key={p.id}
                person={p}
                subtitle={p.known_for?.map(titleOf).filter(Boolean).slice(0, 2).join(', ') || p.known_for_department}
              />
            ))}
      </div>

      {!loading && data && <Pagination page={page} totalPages={data.total_pages} onChange={changePage} />}
    </div>
  );
};

export default People;
