import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

// TMDB never serves more than 500 pages.
const MAX_PAGES = 500;

const pagesAround = (current, total) => {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
};

const Pagination = ({ page, totalPages, onChange }) => {
  const total = Math.min(totalPages || 1, MAX_PAGES);
  if (total <= 1) return null;

  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button className="btn-icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <HiChevronLeft />
      </button>
      {pagesAround(page, total).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-1 text-white/30">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`h-10 min-w-10 rounded-full px-3 text-sm font-medium tabular-nums transition ${
              p === page
                ? 'bg-accent text-ink-950 shadow-glow'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        className="btn-icon"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <HiChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;
