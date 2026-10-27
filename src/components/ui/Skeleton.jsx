export const PosterSkeleton = () => (
  <div>
    <div className="skeleton aspect-[2/3] rounded-2xl" />
    <div className="skeleton mt-3 h-3.5 w-3/4 rounded-full" />
    <div className="skeleton mt-2 h-3 w-1/3 rounded-full" />
  </div>
);

export const WideSkeleton = () => <div className="skeleton aspect-video rounded-2xl" />;

export const PersonSkeleton = ({ round }) => (
  <div>
    <div className={`skeleton ${round ? 'aspect-square rounded-full' : 'aspect-[3/4] rounded-2xl'}`} />
    <div className="skeleton mx-auto mt-3 h-3.5 w-2/3 rounded-full" />
  </div>
);

export const PageSkeleton = () => (
  <div className="animate-fade-in">
    <div className="skeleton h-[70vh] w-full" />
    <div className="container -mt-40 space-y-4">
      <div className="skeleton h-12 w-2/3 max-w-xl rounded-2xl" />
      <div className="skeleton h-4 w-1/3 max-w-sm rounded-full" />
      <div className="skeleton h-24 w-full max-w-2xl rounded-2xl" />
    </div>
  </div>
);
