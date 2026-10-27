import { FaFacebookF, FaImdb, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { HiLink } from 'react-icons/hi2';

const SITES = [
  ['imdb_id', FaImdb, 'IMDb', (id) => `https://www.imdb.com/${id.startsWith('nm') ? 'name' : 'title'}/${id}`],
  ['instagram_id', FaInstagram, 'Instagram', (id) => `https://instagram.com/${id}`],
  ['twitter_id', FaXTwitter, 'X', (id) => `https://x.com/${id}`],
  ['facebook_id', FaFacebookF, 'Facebook', (id) => `https://facebook.com/${id}`],
  ['tiktok_id', FaTiktok, 'TikTok', (id) => `https://tiktok.com/@${id}`],
  ['youtube_id', FaYoutube, 'YouTube', (id) => `https://youtube.com/${id}`],
];

const ExternalLinks = ({ ids = {}, homepage }) => {
  const links = SITES.filter(([key]) => ids?.[key]);
  if (!links.length && !homepage) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map(([key, Icon, label, url]) => (
        <a key={key} href={url(ids[key])} target="_blank" rel="noreferrer" className="btn-icon" title={label} aria-label={label}>
          <Icon />
        </a>
      ))}
      {homepage && (
        <a href={homepage} target="_blank" rel="noreferrer" className="btn-icon" title="Official website" aria-label="Official website">
          <HiLink />
        </a>
      )}
    </div>
  );
};

export default ExternalLinks;
