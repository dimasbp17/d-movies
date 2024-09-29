import React from 'react';
import { IoMdSearch } from 'react-icons/io';

const Search = () => {
  return (
    <>
      <div className="relative">
        <input
          type="search"
          className="w-full px-3 text-xs text-black rounded-sm h-7 lg:h-8 lg:w-52 focus:outline-none"
          placeholder="Search movies..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center mx-2 bg-white">
          <IoMdSearch className="text-black size-4" />
        </div>
      </div>
    </>
  );
};

export default Search;
