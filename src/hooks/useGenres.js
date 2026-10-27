import { useEffect, useState } from 'react';
import { getGenres } from '../services/api';

let cached = null;

/** Returns a map of genre id -> name covering both movie & TV genres. */
const useGenres = () => {
  const [genres, setGenres] = useState(cached || {});

  useEffect(() => {
    if (cached) return;
    Promise.all([getGenres('movie'), getGenres('tv')])
      .then(([movie, tv]) => {
        cached = Object.fromEntries([...movie, ...tv].map((g) => [g.id, g.name]));
        setGenres(cached);
      })
      .catch(() => {});
  }, []);

  return genres;
};

export const genreNames = (ids = [], map = {}, limit = 3) =>
  ids
    .map((id) => map[id])
    .filter(Boolean)
    .slice(0, limit);

export default useGenres;
