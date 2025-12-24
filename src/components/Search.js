import React, { useState, useEffect } from 'react';
import {MdSearch, MdClear} from 'react-icons/md';
import { MdAutoAwesome } from 'react-icons/md';

const Search = ({ 
  handleSearchNote, 
  useSemanticSearch, 
  setUseSemanticSearch,
  isGeneratingEmbedding 
}) => {
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

  const hasApiKey = !!process.env.REACT_APP_GEMINI_API_KEY;

  return (
    <div className="search-container">
      <div className="search">
        <MdSearch className="search-icons" size="1.3em" />
        <input 
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          type="text" 
          placeholder={useSemanticSearch ? "Search by meaning..." : "Search notes..."}
        />
        {searchTerm && (
          <MdClear 
            className="clear-icon" 
            size="1.3em" 
            onClick={handleClear}
          />
        )}
      </div>
      {hasApiKey && (
        <div className="search-mode-toggle">
          <button
            className={`search-mode-button ${useSemanticSearch ? 'active' : ''}`}
            onClick={() => setUseSemanticSearch(!useSemanticSearch)}
            title={useSemanticSearch ? "Switch to keyword search" : "Switch to semantic search"}
            disabled={isGeneratingEmbedding}
          >
            <MdAutoAwesome size="1.2em" />
            <span>{useSemanticSearch ? 'Semantic' : 'Keyword'}</span>
            {isGeneratingEmbedding && <span className="loading-indicator">...</span>}
          </button>
        </div>
      )}
    </div>
  );
};
export default Search;