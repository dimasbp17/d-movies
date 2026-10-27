import Modal from './Modal';

const TrailerModal = ({ video, onClose }) => (
  <Modal open={!!video} onClose={onClose} className="w-full max-w-5xl">
    {video && (
      <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
        <div className="aspect-video">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
          <span className="line-clamp-1 font-medium text-white/80">{video.name}</span>
          <span className="shrink-0 text-xs text-white/40">{video.type}</span>
        </div>
      </div>
    )}
  </Modal>
);

export default TrailerModal;
