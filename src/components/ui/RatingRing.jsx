const colorFor = (pct) => (pct >= 70 ? '#7ee2a8' : pct >= 50 ? '#f2c46d' : '#ff7a93');

/** Circular user-score indicator (0–10 rating rendered as a percentage). */
const RatingRing = ({ value = 0, size = 56, stroke = 4, className = '' }) => {
  const pct = Math.round((value || 0) * 10);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-ink-950/80 backdrop-blur ${className}`}
      style={{ width: size, height: size }}
      title={`User score ${pct}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorFor(pct)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute font-semibold text-white" style={{ fontSize: size * 0.28 }}>
        {pct ? pct : 'NR'}
        {pct ? <sup className="text-[0.55em] text-white/60">%</sup> : null}
      </span>
    </div>
  );
};

export default RatingRing;
