import { useEffect } from 'react';

const BASE = 'D-Movies';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
};

export default useDocumentTitle;
