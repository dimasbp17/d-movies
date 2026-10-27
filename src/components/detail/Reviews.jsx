import { useState } from 'react';
import { IoStar } from 'react-icons/io5';
import { formatShortDate, img } from '../../lib/format';
import SectionHeader from '../ui/SectionHeader';

const avatarOf = (path) => {
  if (!path) return null;
  // Some TMDB avatars are full gravatar URLs prefixed with a slash.
  return path.startsWith('/http') ? path.slice(1) : img(path, 'w92');
};

const ReviewCard = ({ review }) => {
  const [open, setOpen] = useState(false);
  const { author, author_details: d = {}, content, created_at, url } = review;
  const avatar = avatarOf(d.avatar_path);
  const long = content.length > 420;

  return (
    <article className="glass flex flex-col rounded-3xl p-6">
      <header className="mb-4 flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-display text-lg font-semibold text-accent">
            {author[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 font-semibold text-white">{author}</p>
          <p className="text-xs text-white/40">{formatShortDate(created_at)}</p>
        </div>
        {d.rating ? (
          <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
            <IoStar /> {d.rating}
          </span>
        ) : null}
      </header>
      <p className={`whitespace-pre-line text-sm leading-relaxed text-white/65 ${open ? '' : 'line-clamp-6'}`}>
        {content}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
        {long && (
          <button onClick={() => setOpen((o) => !o)} className="text-accent hover:underline">
            {open ? 'Show less' : 'Read more'}
          </button>
        )}
        <a href={url} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white">
          View on TMDB
        </a>
      </div>
    </article>
  );
};

const Reviews = ({ reviews = [] }) => {
  const [showAll, setShowAll] = useState(false);
  if (!reviews.length) return null;
  const shown = showAll ? reviews : reviews.slice(0, 2);

  return (
    <section>
      <SectionHeader eyebrow="What people say" title={`Reviews (${reviews.length})`} />
      <div className="grid gap-5 lg:grid-cols-2">
        {shown.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
      {reviews.length > 2 && (
        <button onClick={() => setShowAll((s) => !s)} className="btn-ghost mt-6">
          {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </section>
  );
};

export default Reviews;
