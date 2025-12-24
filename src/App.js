import React from 'react';
import { nanoid } from 'nanoid';
import { useState, useEffect, useCallback } from 'react';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';
import NoteModal from './components/NoteModal';
import { generateEmbedding, cosineSimilarity } from './services/aiService';
const App = () => {
  const [notes, setNotes] = useState([]);

const [searchText, setSearchText] = useState('');
const [darkMode, setDarkMode] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'category'
const [selectedCategory, setSelectedCategory] = useState('All');
const [useSemanticSearch, setUseSemanticSearch] = useState(false);
const [searchEmbedding, setSearchEmbedding] = useState(null);
const [isGeneratingEmbedding, setIsGeneratingEmbedding] = useState(false);
const [selectedNote, setSelectedNote] = useState(null);

useEffect(() => {
  try {
    const savedNotes = JSON.parse(
      localStorage.getItem('react-notes-app-data')
    );

    if(savedNotes) {
      // Ensure all notes have embedding field (for backward compatibility)
      const notesWithEmbeddings = savedNotes.map(note => ({
        ...note,
        embedding: note.embedding || null
      }));
      setNotes(notesWithEmbeddings);
      
      // Generate embeddings for existing notes that don't have them (background process)
      if (process.env.REACT_APP_GEMINI_API_KEY) {
        notesWithEmbeddings.forEach((note, index) => {
          if (!note.embedding && note.text) {
            // Stagger the requests to avoid rate limiting
            setTimeout(() => {
              const combinedText = `${note.title || ''} ${note.text}`.trim();
              if (combinedText) {
                generateEmbedding(combinedText).then(embedding => {
                  if (embedding) {
                    setNotes(prevNotes => 
                      prevNotes.map(n => 
                        n.id === note.id ? { ...n, embedding } : n
                      )
                    );
                  }
                }).catch(err => {
                  console.error('Error generating embedding for existing note:', err);
                });
              }
            }, index * 200); // 200ms delay between requests
          }
        });
      }
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

const addNote = useCallback(async (title, text, category = 'Personal') => {
  const date = new Date();
  const newNote = {
    id: nanoid(),
    title: title,
    text: text,
    date: date.toLocaleDateString(),
    category: category,
    isPinned: false,
    embedding: null // Will be generated asynchronously if semantic search is enabled
  }
  
  // Generate embedding for semantic search (async, non-blocking)
  if (process.env.REACT_APP_GEMINI_API_KEY) {
    const combinedText = `${title} ${text}`;
    generateEmbedding(combinedText).then(embedding => {
      if (embedding) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === newNote.id ? { ...note, embedding } : note
          )
        );
      }
    }).catch(err => {
      console.error('Error generating embedding for new note:', err);
    });
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

  // Generate embedding for search query
useEffect(() => {
  const generateSearchEmbedding = async () => {
    if (!useSemanticSearch || !searchText.trim() || !process.env.REACT_APP_GEMINI_API_KEY) {
      setSearchEmbedding(null);
      return;
    }

    setIsGeneratingEmbedding(true);
    try {
      const embedding = await generateEmbedding(searchText);
      setSearchEmbedding(embedding);
    } catch (error) {
      console.error('Error generating search embedding:', error);
      setSearchEmbedding(null);
    } finally {
      setIsGeneratingEmbedding(false);
    }
  };

  // Debounce embedding generation
  const timeoutId = setTimeout(() => {
    generateSearchEmbedding();
  }, 500);

  return () => clearTimeout(timeoutId);
}, [searchText, useSemanticSearch]);

const getFilteredAndSortedNotes = useCallback(() => {
  let filteredNotes = notes;

  // Apply search filter
  if (searchText.trim()) {
    if (useSemanticSearch && searchEmbedding) {
      // Semantic search: calculate similarity scores
      filteredNotes = notes.map(note => {
        if (!note.embedding) {
          // Fallback to keyword search if no embedding
          const matchesKeyword = 
            note.text.toLowerCase().includes(searchText.toLowerCase()) ||
            note.title.toLowerCase().includes(searchText.toLowerCase());
          return { ...note, similarity: matchesKeyword ? 0.5 : 0 };
        }
        
        const similarity = cosineSimilarity(searchEmbedding, note.embedding);
        return { ...note, similarity };
      }).filter(note => note.similarity > 0.3) // Threshold for relevance
        .sort((a, b) => b.similarity - a.similarity); // Sort by similarity
    } else {
      // Keyword search
      filteredNotes = notes.filter((note) => 
        note.text.toLowerCase().includes(searchText.toLowerCase()) ||
        note.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

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
      // If semantic search is active, preserve similarity order
      if (useSemanticSearch && searchText.trim() && a.similarity !== undefined) {
        return b.similarity - a.similarity;
      }
      
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
}, [notes, searchText, selectedCategory, sortBy, useSemanticSearch, searchEmbedding]);

  return ( 
    <div className={`${darkMode && 'dark-mode'}`}>
      <div className="container">
      <Header handleToggleDarkMode={setDarkMode} />
      <Search 
        handleSearchNote={setSearchText}
        useSemanticSearch={useSemanticSearch}
        setUseSemanticSearch={setUseSemanticSearch}
        isGeneratingEmbedding={isGeneratingEmbedding}
      />
      
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
          onNoteClick={setSelectedNote}
        />
      )}
      
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onDelete={deleteNote}
          onTogglePin={togglePinNote}
          onUpdateCategory={updateNoteCategory}
        />
      )}
      </div>
    </div>
  );
};

export default App;