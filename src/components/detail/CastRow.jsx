import PersonCard from '../cards/PersonCard';
import Row from '../ui/Row';

const CastRow = ({ cast = [], title = 'Top Cast', to }) => (
  <Row
    eyebrow="Ensemble"
    title={title}
    to={to}
    items={cast.slice(0, 20)}
    bleed={false}
    itemClassName="w-[120px] sm:w-[140px] lg:w-[150px]"
    renderItem={(p) => (
      <PersonCard
        person={p}
        subtitle={p.character || p.roles?.map((r) => r.character).filter(Boolean).join(', ')}
      />
    )}
  />
);

export default CastRow;
