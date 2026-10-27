import { useCallback, useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import SectionHeader from './SectionHeader';
import { PosterSkeleton } from './Skeleton';

/**
 * Horizontal, scroll-snapping carousel with arrow controls.
 * Pass `items` + `renderItem`; `itemClassName` controls the card width.
 */
const Row = ({
  eyebrow,
  title,
  to,
  items = [],
  loading = false,
  renderItem,
  itemClassName = 'w-[140px] sm:w-[165px] lg:w-[190px]',
  skeleton = <PosterSkeleton />,
  headerExtra,
  bleed = true,
}) => {
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, items.length, loading]);

  const scroll = (dir) => {
    const el = track.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!loading && !items.length) return null;

  return (
    <section className="animate-fade-up">
      <SectionHeader eyebrow={eyebrow} title={title} to={to}>
        {headerExtra}
        <div className="hidden gap-2 md:flex">
          <button className="btn-icon" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Scroll left">
            <HiChevronLeft />
          </button>
          <button className="btn-icon" onClick={() => scroll(1)} disabled={edges.end} aria-label="Scroll right">
            <HiChevronRight />
          </button>
        </div>
      </SectionHeader>

      <div
        ref={track}
        onScroll={update}
        className={`scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-1 md:gap-5 ${
          bleed ? 'md:-mx-10 md:scroll-px-10 md:px-10 xl:-mx-16 xl:scroll-px-16 xl:px-16' : 'md:mx-0 md:scroll-px-0 md:px-0'
        }`}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
                {skeleton}
              </div>
            ))
          : items.map((item, i) => (
              <div key={`${item.id}-${i}`} className={`shrink-0 snap-start ${itemClassName}`}>
                {renderItem(item, i)}
              </div>
            ))}
      </div>
    </section>
  );
};

export default Row;
