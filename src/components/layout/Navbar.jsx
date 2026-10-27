import { useEffect, useState } from 'react';
import { HiBars3, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { RiBookmarkLine } from 'react-icons/ri';
import { NavLink, useLocation } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movie', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/people', label: 'People' },
];

const linkClass = ({ isActive }) =>
  `relative px-1 py-2 text-sm font-medium transition hover:text-white ${
    isActive
      ? 'text-white after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent'
      : 'text-white/60'
  }`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items } = useWatchlist();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Ctrl/Cmd + K or "/" opens search from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'border-b border-white/5 bg-ink-950/75 backdrop-blur-xl'
            : 'bg-gradient-to-b from-ink-950/80 to-transparent'
        }`}
      >
        <div className="container flex h-16 items-center gap-8 md:h-20">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="group hidden h-10 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] pl-4 pr-2 text-sm text-white/50 backdrop-blur-xl transition hover:border-white/20 hover:text-white/80 sm:flex"
            >
              <HiMagnifyingGlass className="text-base" />
              <span className="pr-6">Search titles, people…</span>
              <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] text-white/40">
                Ctrl K
              </kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} className="btn-icon sm:hidden" aria-label="Search">
              <HiMagnifyingGlass />
            </button>

            <NavLink to="/watchlist" className="btn-icon relative" aria-label="Watchlist" title="Watchlist">
              <RiBookmarkLine />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink-950">
                  {items.length}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="btn-icon md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <HiXMark /> : <HiBars3 />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="container flex flex-col gap-1 pb-6 animate-fade-in md:hidden">
            {[...LINKS, { to: '/watchlist', label: 'Watchlist' }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-white/70 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
