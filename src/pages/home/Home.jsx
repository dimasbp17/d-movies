import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BannerSlider from './_partials/BannerSlider';
import NowPlayingSlider from './_partials/NowPlayingSlider';
import { Button } from '@material-tailwind/react';
import CardHorizontal from '../../components/CardHorizontal';
import PopularMoviesSlider from './_partials/PopularMoviesSlider';
import GenreList from '../../components/GenreList';
import { genreMovies, getDiscoverMovies } from '../../services/api';
import { FaFire } from 'react-icons/fa';
import { IoFilterCircle, IoFilterCircleOutline } from 'react-icons/io5';
import { RiSlideshow3Fill } from 'react-icons/ri';
import TopRatedMoviesSlider from './_partials/TopRatedMoviesSlider';
import { IoIosStar } from 'react-icons/io';
import UpcomingMoviesSlider from './_partials/UpcomingMoviesSlider';
import { MdUpcoming } from 'react-icons/md';

const Home = () => {
  const [discoverMovies, setDiscoverMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(28);

  useEffect(() => {
    if (selectedGenre) {
      getDiscoverMovies(selectedGenre).then((data) => {
        setDiscoverMovies(data.results);
      });
    }

    genreMovies().then((response) => {
      setGenres(response.genres);
    });
  }, [selectedGenre]);

  const baseImageUrl = import.meta.env.VITE_BASEIMGURL;

  return (
    <>
      <div className="">
        <div>
          <Navbar />
        </div>
        <div className="z-50">
          <BannerSlider />
        </div>
        <div className="px-4 md:px-20">
          <div className="mt-10">
            <div className="flex items-center justify-between my-5">
              <p className="flex items-center gap-2 text-base font-bold text-white md:text-2xl">
                <RiSlideshow3Fill /> Now Showing Movies
              </p>
              <Link to={'/movies/now-showing'}>
                <Button
                  size="sm"
                  className="text-white capitalize rounded-none bg-primary"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div>
              <NowPlayingSlider />
            </div>
          </div>

          <div className="my-20">
            <div className="flex items-center justify-between my-5">
              <p className="flex items-center gap-2 text-base font-bold text-white md:text-2xl">
                <FaFire /> Popular Movies
              </p>
              <Link to={'/movies/popular-movies'}>
                <Button
                  size="sm"
                  className="text-white capitalize rounded-none bg-primary"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div>
              <PopularMoviesSlider />
            </div>
          </div>

          <div className="my-20">
            <div className="flex items-center justify-between my-5">
              <p className="flex items-center gap-2 text-base font-bold text-white md:text-2xl">
                <IoFilterCircle /> Discover Movies
              </p>
            </div>
            <div>
              <GenreList
                genres={genres}
                onSelectGenre={setSelectedGenre}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 my-5 lg:grid-cols-4">
              {discoverMovies.map((movie) => (
                <Link to={`/movies/detail-movies/${movie.id}`}>
                  <CardHorizontal
                    poster={`${baseImageUrl}/w500/${movie.backdrop_path}`}
                    alt={movie.title}
                    title={movie.title}
                    release={movie.release_date}
                    rating={movie.vote_average.toFixed(1)}
                    // genre={getGenreNames(movie.genre_ids)}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="my-20">
            <div className="flex items-center justify-between my-5">
              <p className="flex items-center gap-2 text-base font-bold text-white md:text-2xl">
                <IoIosStar /> Top Rated Movies
              </p>
              <Link to={'/movies/top-rated-movies'}>
                <Button
                  size="sm"
                  className="text-white capitalize rounded-none bg-primary"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div>
              <TopRatedMoviesSlider />
            </div>
          </div>

          <div className="my-20">
            <div className="flex items-center justify-between my-5">
              <p className="flex items-center gap-2 text-base font-bold text-white md:text-2xl">
                <MdUpcoming /> Upcoming Movies
              </p>
              <Link to={'/movies/upcoming-movies'}>
                <Button
                  size="sm"
                  className="text-white capitalize rounded-none bg-primary"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div>
              <UpcomingMoviesSlider />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
