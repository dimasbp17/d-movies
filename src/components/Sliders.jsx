import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CardMovies from './CardMovies';
import img from '../../public/assets/slider.jpg';

const HeroSlider = () => {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            slidesToSlide: 1, // optional, default to 1.
        },
    };
    return (
        <>
            <Carousel
                responsive={responsive}
                showDots={false}
                autoPlaySpeed={1000}
                infinite={true}
                autoPlay={true}
            >
                {/* <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div>
                <div>
                    <CardMovies />
                </div> */}
            </Carousel>
            ;
        </>
    );
};

export default HeroSlider;
