import React from 'react';
import Note from './Note';
import AddNote from './AddNote';

const NotesList = ({ 
  notes, 
  handleAddNote, 
  handleDeleteNote, 
  handleTogglePin, 
  handleUpdateCategory,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory
}) => {
  const categories = ['All', 'Work', 'Personal', 'Ideas', 'Tasks', 'Important'];

  return(
    <div className='notes-container'>
      {/* Controls Section */}
      <div className='notes-controls'>
        <div className='sort-controls'>
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </div>
        
        <div className='category-controls'>
          <label htmlFor="category-select">Filter by:</label>
          <select 
            id="category-select"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='notes-list'>
        {notes.map((note)=> (
        <Note 
        key={note.id}
        id={note.id} 
        title={note.title}
        text={note.text} 
        date={note.date} 
        category={note.category}
        isPinned={note.isPinned}
        handleDeleteNote={handleDeleteNote}
        handleTogglePin={handleTogglePin}
        handleUpdateCategory={handleUpdateCategory}
        />
        ))}
        <AddNote handleAddNote={handleAddNote} />
      </div>
    </div>
  );
};
export default NotesList;