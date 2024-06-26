import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CardSlider from '../../components/slider/card-slider/CardSlider';
import HeroSlider from '../../components/slider/hero-slider/HeroSlider';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import axios from 'axios';
import CardMovies from '../../components/CardMovies';
import ArrowButton from '../../components/slider/card-slider/ArrowButton';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <ArrowButton type="next" />,
        prevArrow: <ArrowButton type="prev" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    // useEffect(() => {
    //     const showdata = async () => {
    //         try {
    //             const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=e2368d17c6fd64b3c890546a220c68a5');

    //             // setData(response.data);
    //             console.log(response);
    //         } catch (error) {
    //             console.error('Error fetching user:', error);
    //         }
    //     };

    //     showdata();
    // }, []);

    return (
        <>
            <div className="bg-black font-poppins">
                <div className="sticky top-0 z-50">
                    <Navbar />
                </div>
                <div>
                    <HeroSlider />
                </div>
                <div className="px-4 md:px-20">
                    <div className="mt-10">
                        <div className="flex items-center justify-between my-5">
                            <p className="text-base font-bold text-white md:text-2xl">Popular Movies</p>
                            <Link
                                to={'/popularmovies'}
                                className="px-3 py-2 text-xs font-normal text-white duration-200 rounded-sm md:px-5 md:font-medium bg-primary hover:shadow-md hover:shadow-red-600"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="">
                            <Slider {...settings}>
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
                                </div>
                                <div>
                                    <CardMovies />
                                </div>
                            </Slider>
                        </div>
                    </div>
                    <div className="my-20">
                        <div className="flex items-center justify-between my-5">
                            <p className="text-base font-bold text-white md:text-2xl">Currently Playing</p>
                            <Link
                                to={'/currentlyplaying'}
                                className="px-3 md:px-5 py-2 text-xs font-normal md:font-medium text-white bg-[#FF0000] hover:bg-red-500 rounded-sm duration-300"
                            >
                                View All
                            </Link>
                        </div>
                        <div>
                            <CardSlider />
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
