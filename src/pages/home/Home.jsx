import React from 'react';
import CardMovies from '../../components/CardMovies';
import Navbar from '../../components/Navbar';
import CardSlider from '../../components/CardSlider';
import HeroSlider from '../../components/Sliders';

const Home = () => {
    return (
        <>
            <div>
                <div>
                    <Navbar />
                </div>
                {/* <div>
                    <HeroSlider />
                </div> */}
                <div>
                    <CardSlider />
                </div>
            </div>

            {/* <div className="grid gap-2 px-10 md:grid-cols-6">
                <CardMovies />
                <CardMovies />
                <CardMovies />
                <CardMovies />
                <CardMovies />
                <CardMovies />
            </div> */}
        </>
    );
};

export default Home;
