import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search = () => {
    return (
        <>
            <div className="relative">
                <input
                    type="search"
                    className="w-full h-10 px-3 text-xs text-black rounded-sm lg:h-8 lg:w-52 focus:outline-none"
                    placeholder="Search movies..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center mx-2">
                    <MagnifyingGlassIcon className="text-black size-4" />
                </div>
            </div>
        </>
    );
};

export default Search;
