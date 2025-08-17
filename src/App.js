import React from 'react';
import { nanoid } from 'nanoid';
import { useState, useEffect, useCallback } from 'react';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';
const App = () => {
  const [notes, setNotes] = useState([
  {
    id: nanoid(),
    text: "This is my first note!",
    date: "02/14/2022"
  },
  {
    id: nanoid(),
    text: "This is my second note!",
    date: "02/10/2022"
  },
  {
    id: nanoid(),
    text: "This is my third note!",
    date: "02/12/2022"
  },
]);

const [searchText, setSearchText] = useState('');
const [darkMode, setDarkMode] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

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

const addNote = useCallback((text) => {
  const date = new Date();
  const newNote = {
    id: nanoid(),
    text: text,
    date: date.toLocaleDateString()
  }
  const newNotes = [...notes, newNote];
  setNotes(newNotes);
}, [notes]);

const deleteNote = useCallback((id) => {
  const newNotes = notes.filter((note)=> note.id !== id);
  setNotes(newNotes);
}, [notes]);

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
          notes={notes.filter((note)=> 
            note.text.toLowerCase().includes(searchText.toLowerCase())
            )} 
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
        />
      )}
      </div>
    </div>
  );
};

export default App;