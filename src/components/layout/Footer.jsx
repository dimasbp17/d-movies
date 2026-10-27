import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const SOCIALS = [
  { href: 'https://github.com/dimasbp17', icon: FaGithub, label: 'GitHub' },
  { href: 'https://x.com/DimasBagus_17', icon: FaXTwitter, label: 'X' },
];

const COLUMNS = [
  {
    title: 'Movies',
    links: [
      ['Popular', '/movie?list=popular'],
      ['Now Playing', '/movie?list=now_playing'],
      ['Top Rated', '/movie?list=top_rated'],
      ['Upcoming', '/movie?list=upcoming'],
    ],
  },
  {
    title: 'TV Shows',
    links: [
      ['Popular', '/tv?list=popular'],
      ['Airing Today', '/tv?list=airing_today'],
      ['On The Air', '/tv?list=on_the_air'],
      ['Top Rated', '/tv?list=top_rated'],
    ],
  },
  {
    title: 'More',
    links: [
      ['Popular People', '/people'],
      ['My Watchlist', '/watchlist'],
      ['Search', '/search'],
    ],
  },
];

const Footer = () => (
  <footer className="relative mt-24 border-t border-white/5 bg-ink-900/60">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="max-w-sm space-y-4">
        <Logo />
        <p className="text-sm leading-relaxed text-white/50">
          A calm place to discover what to watch next — trending films, binge-worthy series and the people who make
          them.
        </p>
        <div className="flex gap-2">
          {SOCIALS.map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="btn-icon" aria-label={label}>
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{col.title}</h4>
          <ul className="space-y-2.5">
            {col.links.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-white/60 transition hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-white/5">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/40 md:flex-row">
        <p>© {new Date().getFullYear()} Dimas Bagus Prasetyo. Crafted with care.</p>
        <p className="flex items-center gap-2">
          Data &amp; images by
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#01b4e4] hover:underline"
          >
            TMDB
          </a>
          · This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
