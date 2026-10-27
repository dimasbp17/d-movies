import { RiFilmLine } from 'react-icons/ri';

const EmptyState = ({ icon: Icon = RiFilmLine, title, description, children }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center animate-fade-up">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
      <Icon />
    </div>
    <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
    {description && <p className="mt-2 max-w-md text-sm text-white/50">{description}</p>}
    {children && <div className="mt-6">{children}</div>}
  </div>
);

export default EmptyState;
