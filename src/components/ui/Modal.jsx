import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({ open, onClose, children, className = '', showClose = true }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      {showClose && (
        <button onClick={onClose} className="btn-icon absolute right-4 top-4 z-10" aria-label="Close">
          <HiXMark className="text-lg" />
        </button>
      )}
      <div className={`animate-scale-in ${className}`}>{children}</div>
    </div>,
    document.body
  );
};

export default Modal;
