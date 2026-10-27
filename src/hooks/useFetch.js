import { useEffect, useState } from 'react';

/**
 * Runs an async loader whenever `deps` change and tracks its state.
 * Stale responses (from a previous deps value) are ignored.
 */
const useFetch = (loader, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
};

export default useFetch;
