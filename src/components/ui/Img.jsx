import { useEffect, useState } from 'react';
import { RiFilmLine, RiUser3Line } from 'react-icons/ri';
import { img } from '../../lib/format';

/** TMDB image with a fade-in on load and an elegant placeholder when missing. */
const Img = ({ path, size = 'w500', alt = '', className = '', person = false, eager = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = img(path, size);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    const Icon = person ? RiUser3Line : RiFilmLine;
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-850 text-white/20 ${className}`}
        aria-label={alt}
      >
        <Icon className="h-1/4 w-1/4 max-h-12 max-w-12" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`bg-ink-800 object-cover transition-opacity duration-700 ${
        loaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
};

export default Img;
