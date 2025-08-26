import React from 'react';
import { useState, useRef, useEffect } from 'react';

const AddNote = ({ handleAddNote }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const textareaRef = useRef(null);
  const titleCharacterLimit = 50;
  const textCharacterLimit = 200;

  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleTextChange = (event) => {
    if(textCharacterLimit - event.target.value.length >=0){
    setNoteText(event.target.value);
    }
  };

  const handleTitleChange = (event) => {
    if(titleCharacterLimit - event.target.value.length >=0){
    setNoteTitle(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if(noteText.trim().length > 0){
        const title = noteTitle.trim().length > 0 ? noteTitle : 'Untitled Note';
        handleAddNote(title, noteText, selectedCategory)
        setNoteTitle('');
        setNoteText('');
        // Re-focus after saving
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
    }
  };

  const handleKeyDown = (event) => {
    // Save on Ctrl+Enter
    if (event.ctrlKey && event.key === 'Enter') {
      handleSaveClick();
    }
  };

  const categories = ['Work', 'Personal', 'Ideas', 'Tasks', 'Important'];

  return(<div className="note new">
    <div className="category-selector">
      <label htmlFor="new-note-category">Category:</label>
      <select 
        id="new-note-category"
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="category-select-new"
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
    
    <input
      type="text"
      placeholder="Note title (optional)"
      value={noteTitle}
      onChange={handleTitleChange}
      className="note-title-input"
      maxLength={titleCharacterLimit}
    />
    
    <textarea 
    ref={textareaRef}
    rows="8" 
    cols="10" 
    placeholder="Type to add a note... (Ctrl+Enter to save)"
    value={noteText}
    onChange={handleTextChange}
    onKeyDown={handleKeyDown}
    ></textarea>
    <div className="note-footer">
      <div className="character-counts">
        <small className={titleCharacterLimit - noteTitle.length < 10 ? 'warning' : ''}>
          Title: {titleCharacterLimit - noteTitle.length}
        </small>
        <small className={textCharacterLimit - noteText.length < 20 ? 'warning' : ''}>
          Text: {textCharacterLimit - noteText.length}
        </small>
      </div>
      <button 
        className="save" 
        onClick={handleSaveClick}
        disabled={noteText.trim().length === 0}
      >
        Save
      </button>
    </div>
  </div>
  );
};
export default AddNote;