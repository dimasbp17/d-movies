import { useState } from 'react';
import { HiPlay } from 'react-icons/hi2';
import Img from '../ui/Img';
import Lightbox from '../ui/Lightbox';
import SectionHeader from '../ui/SectionHeader';
import TrailerModal from '../ui/TrailerModal';

const VIDEO_ORDER = ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes'];

/** Tabbed videos / backdrops / posters gallery. */
const MediaGallery = ({ videos = [], images = {} }) => {
  const yt = videos
    .filter((v) => v.site === 'YouTube')
    .sort((a, b) => VIDEO_ORDER.indexOf(a.type) - VIDEO_ORDER.indexOf(b.type));
  const backdrops = images.backdrops || [];
  const posters = images.posters || [];

  const tabs = [
    ['videos', `Videos`, yt.length],
    ['backdrops', 'Backdrops', backdrops.length],
    ['posters', 'Posters', posters.length],
  ].filter(([, , n]) => n > 0);

  const [tab, setTab] = useState(tabs[0]?.[0]);
  const [video, setVideo] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  if (!tabs.length) return null;
  const pics = tab === 'posters' ? posters : backdrops;

  return (
    <section>
      <SectionHeader eyebrow="Media" title="Videos & Gallery">
        <div className="glass flex rounded-full p-1">
          {tabs.map(([key, label, n]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === key ? 'bg-accent text-ink-950' : 'text-white/60 hover:text-white'
              }`}
            >
              {label} <span className="opacity-60">{n}</span>
            </button>
          ))}
        </div>
      </SectionHeader>

      <div className="scrollbar-hide -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {tab === 'videos' &&
          yt.slice(0, 20).map((v) => (
            <button
              key={v.id}
              onClick={() => setVideo(v)}
              className="group w-[280px] shrink-0 snap-start text-left md:w-[340px]"
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5">
                <img
                  src={`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/30 transition group-hover:bg-ink-950/10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-accent group-hover:text-ink-950">
                    <HiPlay className="ml-0.5" />
                  </span>
                </div>
              </div>
              <p className="mt-2.5 line-clamp-1 text-sm font-medium text-white/85">{v.name}</p>
              <p className="text-xs text-white/40">{v.type}</p>
            </button>
          ))}

        {tab !== 'videos' &&
          pics.slice(0, 30).map((p, i) => (
            <button
              key={p.file_path}
              onClick={() => setLightbox(i)}
              className={`group shrink-0 snap-start overflow-hidden rounded-2xl ring-1 ring-white/5 ${
                tab === 'posters' ? 'aspect-[2/3] w-[160px]' : 'aspect-video w-[280px] md:w-[340px]'
              }`}
            >
              <Img
                path={p.file_path}
                size={tab === 'posters' ? 'w342' : 'w780'}
                className="h-full w-full transition duration-700 group-hover:scale-105"
              />
            </button>
          ))}
      </div>

      <TrailerModal video={video} onClose={() => setVideo(null)} />
      <Lightbox images={pics.slice(0, 30)} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
    </section>
  );
};

export default MediaGallery;
