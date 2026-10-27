import axios from 'axios';

const apiKey = import.meta.env.VITE_APIKEY;
const token = import.meta.env.VITE_TOKEN;

const client = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || 'https://api.themoviedb.org/3',
  params: { language: 'en-US', ...(apiKey ? { api_key: apiKey } : {}) },
  headers: !apiKey && token ? { Authorization: `Bearer ${token}` } : {},
});

// Region used for certifications, release dates & streaming providers.
export const REGION = 'ID';
export const FALLBACK_REGION = 'US';

// Small in-memory cache so navigating back and forth feels instant.
const cache = new Map();
const MAX_CACHE = 200;

const get = async (url, params = {}) => {
  const key = `${url}?${JSON.stringify(params)}`;
  if (cache.has(key)) return cache.get(key);

  const request = client.get(url, { params }).then((res) => res.data);
  cache.set(key, request);
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);

  try {
    return await request;
  } catch (error) {
    cache.delete(key);
    throw error;
  }
};

/* ---------- Lists ---------- */

export const getTrending = (type = 'all', window = 'day', page = 1) =>
  get(`/trending/${type}/${window}`, { page });

// movie: now_playing | popular | top_rated | upcoming
// tv:    airing_today | on_the_air | popular | top_rated
export const getList = (type, category, page = 1) =>
  get(`/${type}/${category}`, { page, region: type === 'movie' ? REGION : undefined });

export const discover = (type, params = {}) =>
  get(`/discover/${type}`, { include_adult: false, ...params });

export const getGenres = (type = 'movie') =>
  get(`/genre/${type}/list`).then((data) => data.genres);

export const getPopularPeople = (page = 1) => get('/person/popular', { page });

/* ---------- Details ---------- */

export const getMovie = (id) =>
  get(`/movie/${id}`, {
    append_to_response:
      'videos,credits,images,recommendations,similar,reviews,keywords,release_dates,watch/providers,external_ids',
    include_image_language: 'en,null',
  });

export const getTv = (id) =>
  get(`/tv/${id}`, {
    append_to_response:
      'videos,aggregate_credits,images,recommendations,similar,reviews,keywords,content_ratings,watch/providers,external_ids',
    include_image_language: 'en,null',
  });

export const getSeason = (tvId, season) =>
  get(`/tv/${tvId}/season/${season}`, { append_to_response: 'videos,images' });

export const getPerson = (id) =>
  get(`/person/${id}`, {
    append_to_response: 'combined_credits,images,external_ids',
  });

export const getCollection = (id) => get(`/collection/${id}`);

export const getKeyword = (id) => get(`/keyword/${id}`);

export const getImages = (type, id) =>
  get(`/${type}/${id}/images`, { include_image_language: 'en,null' });

export const getVideos = (type, id) => get(`/${type}/${id}/videos`);

/* ---------- Search ---------- */

export const search = (type = 'multi', query, page = 1) =>
  get(`/search/${type}`, { query, page, include_adult: false });
