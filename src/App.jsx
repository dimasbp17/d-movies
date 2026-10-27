import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { WatchlistProvider } from './context/WatchlistContext';
import CollectionDetail from './pages/collection/CollectionDetail';
import Explore from './pages/explore/Explore';
import Home from './pages/home/Home';
import MovieDetail from './pages/movie/MovieDetail';
import NotFound from './pages/NotFound';
import People from './pages/person/People';
import PersonDetail from './pages/person/PersonDetail';
import SearchPage from './pages/search/SearchPage';
import SeasonDetail from './pages/tv/SeasonDetail';
import TvDetail from './pages/tv/TvDetail';
import Watchlist from './pages/watchlist/Watchlist';

// Keep old links (shared before the redesign) working.
const LegacyDetail = () => <Navigate to={`/movie/${useParams().id}`} replace />;

const App = () => (
  <WatchlistProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie" element={<Explore key="movie" type="movie" />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="tv" element={<Explore key="tv" type="tv" />} />
          <Route path="tv/:id" element={<TvDetail />} />
          <Route path="tv/:id/season/:season" element={<SeasonDetail />} />
          <Route path="person/:id" element={<PersonDetail />} />
          <Route path="people" element={<People />} />
          <Route path="collection/:id" element={<CollectionDetail />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="watchlist" element={<Watchlist />} />

          <Route path="movies" element={<Navigate to="/movie" replace />} />
          <Route path="movies/popular-movies" element={<Navigate to="/movie?list=popular" replace />} />
          <Route path="movies/top-rated-movies" element={<Navigate to="/movie?list=top_rated" replace />} />
          <Route path="movies/now-showing" element={<Navigate to="/movie?list=now_playing" replace />} />
          <Route path="movies/upcoming-movies" element={<Navigate to="/movie?list=upcoming" replace />} />
          <Route path="movies/detail-movies/:id" element={<LegacyDetail />} />
          <Route path="movies/recommendations-movies/:id" element={<LegacyDetail />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </WatchlistProvider>
);

export default App;
