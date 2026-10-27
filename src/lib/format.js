const IMAGE_BASE = (import.meta.env.VITE_BASEIMGURL || 'https://image.tmdb.org/t/p').replace(
  /\/+$/,
  ''
);

export const img = (path, size = 'w500') => (path ? `${IMAGE_BASE}/${size}${path}` : null);

export const titleOf = (item = {}) => item.title || item.name || item.original_title || '';

export const dateOf = (item = {}) => item.release_date || item.first_air_date || '';

export const yearOf = (item = {}) => (dateOf(item) ? dateOf(item).slice(0, 4) : '');

// TMDB list items don't always carry media_type (only trending/multi search do).
export const typeOf = (item = {}, fallback = 'movie') =>
  item.media_type || (item.first_air_date !== undefined || item.name ? 'tv' : fallback);

export const formatDate = (value, opts = { month: 'long', day: 'numeric', year: 'numeric' }) => {
  if (!value) return '—';
  const date = new Date(value);
  return isNaN(date) ? '—' : new Intl.DateTimeFormat('en-US', opts).format(date);
};

export const formatShortDate = (value) =>
  formatDate(value, { month: 'short', day: 'numeric', year: 'numeric' });

export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatMoney = (value) =>
  value
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)
    : '—';

export const formatCompact = (value) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value || 0
  );

export const formatRating = (value) => (value ? Number(value).toFixed(1) : 'NR');

export const languageName = (code) => {
  if (!code) return '—';
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
};

export const ageFrom = (birthday, deathday) => {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const start = new Date(birthday);
  let age = end.getFullYear() - start.getFullYear();
  const m = end.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < start.getDate())) age--;
  return age;
};

export const pickTrailer = (videos = []) => {
  const yt = videos.filter((v) => v.site === 'YouTube');
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ||
    yt.find((v) => v.type === 'Trailer') ||
    yt.find((v) => v.type === 'Teaser') ||
    yt[0] ||
    null
  );
};

export const pickLogo = (logos = []) =>
  logos.find((l) => l.iso_639_1 === 'en') || logos.find((l) => !l.iso_639_1) || null;
