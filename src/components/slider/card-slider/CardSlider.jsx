import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowButton from './ArrowButton';
import CardMovies from '../../CardMovies';

const SliderCard = ({ items }) => {
  const settings = {
    dots: true, // Menampilkan titik navigasi di bawah slider
    infinite: true, // Slide berjalan terus tanpa berhenti di slide terakhir
    speed: 500, // Kecepatan transisi dalam milidetik
    slidesToShow: 5, // Jumlah slide yang ditampilkan sekaligus
    slidesToScroll: 1, // Jumlah slide yang digeser saat navigasi
    autoplay: true, // Slide akan berpindah otomatis
    autoplaySpeed: 3000, // Interval waktu otomatis dalam milidetik
    nextArrow: <ArrowButton type="next" />,
    prevArrow: <ArrowButton type="prev" />,

    lazyLoad: true,
    // centerMode: true,
    // centerPadding: '20px',
  };

  const baseImageUrl = import.meta.env.VITE_BASEIMGURL;

  return (
    <>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4"
          >
            <div className="p-4 text-center bg-gray-200 border rounded-lg">
              <CardMovies
                poster={`${baseImageUrl}/${item.poster}`}
                alt={item.title}
                title={item.title}
                releaseDate={item.release_date}
                rating={item.vote_average}
                genre={item.genre_ids}
              />
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default SliderCard;
