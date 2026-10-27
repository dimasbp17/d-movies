import { FALLBACK_REGION, REGION } from '../../services/api';
import { img } from '../../lib/format';

const REGION_NAME = { ID: 'Indonesia', US: 'the United States' };

const GROUPS = [
  ['flatrate', 'Stream'],
  ['free', 'Free'],
  ['ads', 'With ads'],
  ['rent', 'Rent'],
  ['buy', 'Buy'],
];

/** "Where to watch" — JustWatch data surfaced by TMDB's watch/providers. */
const WatchProviders = ({ data }) => {
  const results = data?.results || {};
  const region = results[REGION] ? REGION : results[FALLBACK_REGION] ? FALLBACK_REGION : null;
  if (!region) return null;
  const providers = results[region];

  const groups = GROUPS.filter(([key]) => providers[key]?.length);
  if (!groups.length) return null;

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="eyebrow mb-1">Where to watch</h3>
      <p className="mb-5 text-xs text-white/40">Availability in {REGION_NAME[region]}</p>
      <div className="space-y-4">
        {groups.map(([key, label]) => (
          <div key={key}>
            <p className="mb-2 text-xs font-medium text-white/50">{label}</p>
            <div className="flex flex-wrap gap-2">
              {providers[key].map((p) => (
                <a
                  key={p.provider_id}
                  href={providers.link}
                  target="_blank"
                  rel="noreferrer"
                  title={p.provider_name}
                  className="overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-accent/60"
                >
                  <img src={img(p.logo_path, 'w92')} alt={p.provider_name} className="h-11 w-11" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[10px] text-white/30">Powered by JustWatch</p>
    </div>
  );
};

export default WatchProviders;
