import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MediaCard from '../../components/cards/MediaCard';
import ExternalLinks from '../../components/detail/ExternalLinks';
import EmptyState from '../../components/ui/EmptyState';
import Img from '../../components/ui/Img';
import Lightbox from '../../components/ui/Lightbox';
import Row from '../../components/ui/Row';
import SectionHeader from '../../components/ui/SectionHeader';
import { PageSkeleton } from '../../components/ui/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import { ageFrom, formatDate, formatRating, titleOf, yearOf } from '../../lib/format';
import { getPerson } from '../../services/api';

const GENDER = { 1: 'Female', 2: 'Male', 3: 'Non-binary' };

const Biography = ({ text }) => {
  const [open, setOpen] = useState(false);
  if (!text) return <p className="text-white/50">We don&rsquo;t have a biography for this person yet.</p>;
  return (
    <div>
      <p className={`whitespace-pre-line leading-relaxed text-white/70 ${open ? '' : 'line-clamp-6'}`}>{text}</p>
      {text.length > 600 && (
        <button onClick={() => setOpen((o) => !o)} className="mt-3 text-sm font-semibold text-accent hover:underline">
          {open ? 'Show less' : 'Read full biography'}
        </button>
      )}
    </div>
  );
};

const Filmography = ({ credits }) => {
  const departments = useMemo(() => {
    const crewDepts = [...new Set(credits.crew.map((c) => c.department))];
    return [['Acting', credits.cast], ...crewDepts.map((d) => [d, credits.crew.filter((c) => c.department === d)])].filter(
      ([, list]) => list.length
    );
  }, [credits]);

  const [dept, setDept] = useState(departments[0]?.[0]);
  const [media, setMedia] = useState('all');

  const list = (departments.find(([d]) => d === dept)?.[1] || [])
    .filter((c) => media === 'all' || c.media_type === media)
    // Merge duplicates (e.g. same show credited multiple times) & sort newest first.
    .reduce((acc, c) => {
      const key = `${c.media_type}-${c.id}`;
      const existing = acc.find((x) => x.key === key);
      const role = c.character || c.job;
      if (existing) {
        if (role && !existing.roles.includes(role)) existing.roles.push(role);
      } else acc.push({ ...c, key, roles: role ? [role] : [] });
      return acc;
    }, [])
    .sort((a, b) => (yearOf(b) || '9999').localeCompare(yearOf(a) || '9999'));

  if (!departments.length) return null;

  return (
    <section>
      <SectionHeader eyebrow="Career" title="Filmography">
        <div className="glass flex rounded-full p-1">
          {[
            ['all', 'All'],
            ['movie', 'Movies'],
            ['tv', 'TV'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setMedia(k)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                media === k ? 'bg-accent text-ink-950' : 'text-white/60 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </SectionHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {departments.map(([d, l]) => (
          <button key={d} onClick={() => setDept(d)} className={`chip ${dept === d ? 'chip-active' : ''}`}>
            {d} <span className="opacity-50">{l.length}</span>
          </button>
        ))}
      </div>

      <ol className="glass divide-y divide-white/5 overflow-hidden rounded-3xl">
        {list.length === 0 && <li className="p-6 text-sm text-white/40">No credits in this category.</li>}
        {list.map((c) => (
          <li key={c.key}>
            <Link to={`/${c.media_type}/${c.id}`} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.03]">
              <span className="w-12 shrink-0 font-display text-sm tabular-nums text-white/40">{yearOf(c) || '—'}</span>
              <Img path={c.poster_path} size="w92" className="h-14 w-10 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-medium text-white group-hover:text-accent">{titleOf(c)}</p>
                <p className="line-clamp-1 text-xs text-white/45">
                  {c.roles.length ? (dept === 'Acting' ? `as ${c.roles.join(', ')}` : c.roles.join(', ')) : '—'}
                  {c.episode_count ? ` · ${c.episode_count} ep` : ''}
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/50 sm:inline">
                {c.media_type === 'tv' ? 'TV' : 'Film'}
              </span>
              <span className="hidden w-10 shrink-0 text-right text-xs text-white/50 sm:inline">★ {formatRating(c.vote_average)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

const PersonDetail = () => {
  const { id } = useParams();
  const { data: person, loading, error } = useFetch(() => getPerson(id), [id]);
  const [lightbox, setLightbox] = useState(null);
  useDocumentTitle(person?.name);

  if (loading) return <PageSkeleton />;
  if (error || !person)
    return (
      <div className="container pt-36">
        <EmptyState title="Person not found" />
      </div>
    );

  const credits = person.combined_credits || { cast: [], crew: [] };
  const knownSource = person.known_for_department === 'Acting' ? credits.cast : credits.crew;
  const knownFor = [...new Map(knownSource.map((c) => [`${c.media_type}-${c.id}`, c])).values()]
    .filter((c) => c.poster_path)
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 16);
  const photos = person.images?.profiles || [];
  const age = ageFrom(person.birthday, person.deathday);

  const facts = [
    ['Known for', person.known_for_department],
    ['Credits', (credits.cast.length + credits.crew.length).toLocaleString()],
    ['Gender', GENDER[person.gender]],
    ['Born', person.birthday ? `${formatDate(person.birthday)}${!person.deathday && age ? ` (${age} years old)` : ''}` : null],
    ['Died', person.deathday ? `${formatDate(person.deathday)} (aged ${age})` : null],
    ['Place of birth', person.place_of_birth],
    ['Also known as', person.also_known_as?.slice(0, 3).join(', ')],
  ].filter(([, v]) => v);

  return (
    <div key={id} className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <Img path={knownFor[0]?.backdrop_path} size="w1280" className="h-full w-full scale-110 opacity-25 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/60 to-ink-950" />
      </div>

      <div className="container relative space-y-20 pt-28 md:pt-36">
        <div className="grid gap-10 md:grid-cols-[300px_1fr] lg:gap-16">
          <aside className="space-y-6">
            <Img
              path={person.profile_path}
              size="h632"
              alt={person.name}
              person
              eager
              className="mx-auto aspect-[2/3] w-56 rounded-3xl shadow-2xl ring-1 ring-white/10 md:w-full animate-fade-up"
            />
            <ExternalLinks ids={person.external_ids} homepage={person.homepage} />
            <dl className="glass space-y-4 rounded-3xl p-6">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</dt>
                  <dd className="mt-1 text-sm text-white/85">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="min-w-0 space-y-14">
            <div className="space-y-5 animate-fade-up">
              <p className="eyebrow">{person.known_for_department}</p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">{person.name}</h1>
              <Biography text={person.biography} />
            </div>

            <Row
              eyebrow="Highlights"
              title="Known For"
              bleed={false}
              items={knownFor}
              renderItem={(item) => (
                <MediaCard item={item} type={item.media_type} subtitle={item.character || item.job} />
              )}
            />

            {photos.length > 1 && (
              <section>
                <SectionHeader eyebrow="Gallery" title={`Photos (${photos.length})`} />
                <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
                  {photos.slice(0, 20).map((p, i) => (
                    <button
                      key={p.file_path}
                      onClick={() => setLightbox(i)}
                      className="group aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/5"
                    >
                      <Img path={p.file_path} size="w185" className="h-full w-full transition duration-700 group-hover:scale-105" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            <Filmography credits={credits} />
          </div>
        </div>
      </div>

      <Lightbox images={photos.slice(0, 20)} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
    </div>
  );
};

export default PersonDetail;
