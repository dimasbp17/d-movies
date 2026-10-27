import { useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { img } from '../../lib/format';
import Modal from './Modal';

/** Full-screen image viewer with keyboard navigation. */
const Lightbox = ({ images = [], index, onChange, onClose }) => {
  const open = index !== null && index !== undefined;
  const go = (d) => onChange((index + d + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, images.length, onChange]);

  const current = open ? images[index] : null;

  return (
    <Modal open={open} onClose={onClose} className="flex w-full max-w-6xl flex-col items-center">
      {current && (
        <>
          <img
            key={current.file_path}
            src={img(current.file_path, 'original')}
            alt=""
            className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl animate-fade-in"
          />
          <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
            <button className="btn-icon" onClick={() => go(-1)} aria-label="Previous image">
              <HiChevronLeft />
            </button>
            <span className="tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button className="btn-icon" onClick={() => go(1)} aria-label="Next image">
              <HiChevronRight />
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default Lightbox;
