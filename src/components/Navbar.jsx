import React, { useState } from 'react';
import Search from './Search';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import movies from '../../public/assets/dmovies.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const toogleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuClick = (menuName, path) => {
        setActive(menuName);
        navigate(path);
    };
    const isActiveMenu = (menuName) => {
        return location.active === menuName ? 'text-[#FF0000]' : 'hover:text-[#FF0000] duration-300';
    };

    return (
        <>
            <div className="w-full p-4 text-white bg-black md:px-10 lg:px-20 font-poppins md:py-5">
                <div>
                    <button
                        className="items-end justify-end block ms-auto md:hidden"
                        onClick={toogleNavbar}
                    >
                        {isOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
                    </button>
                </div>
                <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'}`}>
                    <Link to={'/'}>
                        <img
                            src={movies}
                            alt=""
                            className="hidden w-36 md:block"
                        />
                    </Link>
                    <ul className="flex flex-col items-center justify-center gap-10 md:flex md:flex-row ms-auto">
                        <li>
                            <button
                                className={`${isActiveMenu('home')}`}
                                onClick={() => {
                                    handleMenuClick('home');
                                    navigate('/');
                                }}
                            >
                                Home
                            </button>
                        </li>

                        <li>
                            <button
                                className={`${isActiveMenu('movies')}`}
                                onClick={() => {
                                    handleMenuClick('movies');
                                    navigate('/movies');
                                }}
                            >
                                Movies
                            </button>
                        </li>
                        <li>
                            <button
                                className={`${isActiveMenu('series')}`}
                                onClick={() => {
                                    handleMenuClick('series');
                                    navigate('/series');
                                }}
                            >
                                Series
                            </button>
                        </li>
                        <li>
                            <div className="order-5 w-full md:order-3">
                                <Search />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
