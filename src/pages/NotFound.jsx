import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container flex min-h-[80vh] flex-col items-center justify-center pt-20 text-center">
    <p className="font-display text-[140px] font-bold leading-none text-transparent [-webkit-text-stroke:2px_rgba(242,196,109,.5)] md:text-[200px]">
      404
    </p>
    <h1 className="mt-4 font-display text-3xl font-semibold text-white">This scene was cut.</h1>
    <p className="mt-3 max-w-md text-white/50">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
    <Link to="/" className="btn-primary mt-8">
      Back to home
    </Link>
  </div>
);

export default NotFound;
