import React, { useState, useEffect } from 'react';
import {MdSearch, MdClear} from 'react-icons/md';

const Search = ({ handleSearchNote }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search to improve performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchNote(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearchNote]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
  <div className="search">
    <MdSearch className="search-icons" size="1.3em" />
      <input 
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        type="text" 
        placeholder="Search notes..."
      />
      {searchTerm && (
        <MdClear 
          className="clear-icon" 
          size="1.3em" 
          onClick={handleClear}
        />
      )}
     </div>
     );
};
export default Search;