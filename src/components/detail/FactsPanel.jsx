import { Link } from 'react-router-dom';
import { img } from '../../lib/format';

/** Sidebar with key facts, companies/networks and keyword chips. */
const FactsPanel = ({ facts = [], companies = [], companiesLabel = 'Production', keywords = [], type }) => (
  <div className="glass space-y-6 rounded-3xl p-6">
    <dl className="space-y-4">
      {facts
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</dt>
            <dd className="mt-1 text-sm text-white/85">{value}</dd>
          </div>
        ))}
    </dl>

    {companies.length > 0 && (
      <div>
        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">{companiesLabel}</h4>
        <div className="flex flex-wrap gap-2">
          {companies.map((c) =>
            c.logo_path ? (
              <span
                key={c.id}
                title={c.name}
                className="flex h-12 items-center rounded-xl bg-white/90 px-3"
              >
                <img src={img(c.logo_path, 'w154')} alt={c.name} className="max-h-7 max-w-[96px] object-contain" loading="lazy" />
              </span>
            ) : (
              <span key={c.id} className="chip">
                {c.name}
              </span>
            )
          )}
        </div>
      </div>
    )}

    {keywords.length > 0 && (
      <div>
        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Keywords</h4>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((k) => (
            <Link key={k.id} to={`/${type}?keyword=${k.id}`} className="chip px-2.5 py-1 text-[11px]">
              #{k.name}
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default FactsPanel;
