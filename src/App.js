import React from 'react';
import { nanoid } from 'nanoid';
import { useState, useEffect, useCallback } from 'react';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';
const App = () => {
  const [notes, setNotes] = useState([]);

const [searchText, setSearchText] = useState('');
const [darkMode, setDarkMode] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'category'
const [selectedCategory, setSelectedCategory] = useState('All');

useEffect(() => {
  try {
    const savedNotes = JSON.parse(
      localStorage.getItem('react-notes-app-data')
    );

    if(savedNotes) {
      setNotes(savedNotes);
    }
  } catch (err) {
    setError('Failed to load saved notes');
    console.error('Error loading notes:', err);
  } finally {
    setIsLoading(false);
  }
},[]);

useEffect(() => {
  try {
    localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
  } catch (err) {
    setError('Failed to save notes');
    console.error('Error saving notes:', err);
  }
}, [notes]);

const addNote = useCallback((title, text, category = 'Personal') => {
  const date = new Date();
  const newNote = {
    id: nanoid(),
    title: title,
    text: text,
    date: date.toLocaleDateString(),
    category: category,
    isPinned: false
  }
  const newNotes = [...notes, newNote];
  setNotes(newNotes);
}, [notes]);

const deleteNote = useCallback((id) => {
  const newNotes = notes.filter((note)=> note.id !== id);
  setNotes(newNotes);
}, [notes]);

const togglePinNote = useCallback((id) => {
  const newNotes = notes.map((note) => 
    note.id === id ? { ...note, isPinned: !note.isPinned } : note
  );
  setNotes(newNotes);
}, [notes]);

const updateNoteCategory = useCallback((id, category) => {
  const newNotes = notes.map((note) => 
    note.id === id ? { ...note, category: category } : note
  );
  setNotes(newNotes);
}, [notes]);

const getFilteredAndSortedNotes = useCallback(() => {
  let filteredNotes = notes.filter((note) => 
    note.text.toLowerCase().includes(searchText.toLowerCase()) ||
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter by category
  if (selectedCategory !== 'All') {
    filteredNotes = filteredNotes.filter((note) => 
      note.category === selectedCategory
    );
  }

  // Sort notes (pinned notes always come first)
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  const sortNotes = (notesToSort) => {
    return notesToSort.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  };

  return [...sortNotes(pinnedNotes), ...sortNotes(unpinnedNotes)];
}, [notes, searchText, selectedCategory, sortBy]);

  return ( 
    <div className={`${darkMode && 'dark-mode'}`}>
      <div className="container">
      <Header handleToggleDarkMode={setDarkMode} />
      <Search handleSearchNote={setSearchText}/>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading notes...</div>
      ) : (
        <NotesList 
          notes={getFilteredAndSortedNotes()}
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
          handleTogglePin={togglePinNote}
          handleUpdateCategory={updateNoteCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      </div>
    </div>
  );
};

export default App;