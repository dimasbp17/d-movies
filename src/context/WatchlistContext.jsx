import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dateOf, titleOf, typeOf } from '../lib/format';

const STORAGE_KEY = 'dmovies:watchlist';
const WatchlistContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const WatchlistProvider = ({ children }) => {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [items]);

  const keyOf = (type, id) => `${type}-${id}`;

  const has = useCallback(
    (type, id) => items.some((i) => keyOf(i.media_type, i.id) === keyOf(type, id)),
    [items]
  );

  const toggle = useCallback((item, fallbackType) => {
    const type = typeOf(item, fallbackType);
    setItems((prev) =>
      prev.some((i) => keyOf(i.media_type, i.id) === keyOf(type, item.id))
        ? prev.filter((i) => keyOf(i.media_type, i.id) !== keyOf(type, item.id))
        : [
            {
              id: item.id,
              media_type: type,
              title: titleOf(item),
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              vote_average: item.vote_average,
              date: dateOf(item),
              added_at: Date.now(),
            },
            ...prev,
          ]
    );
  }, []);

  const value = useMemo(() => ({ items, has, toggle }), [items, has, toggle]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchlist = () => useContext(WatchlistContext);
