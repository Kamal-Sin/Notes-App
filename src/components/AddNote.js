import React from 'react';
import { useState, useRef, useEffect } from 'react';

const AddNote = ({ handleAddNote }) => {
  const [noteText, setNoteText] = useState('');
  const textareaRef = useRef(null);
  const characterLimit = 200;

  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = (event) => {
    if(characterLimit - event.target.value.length >=0){
    setNoteText(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if(noteText.trim().length > 0){
        handleAddNote(noteText)
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

  return(<div className="note new">
    <textarea 
    ref={textareaRef}
    rows="8" 
    cols="10" 
    placeholder="Type to add a note... (Ctrl+Enter to save)"
    value={noteText}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    ></textarea>
    <div className="note-footer">
      <small className={characterLimit - noteText.length < 20 ? 'warning' : ''}>
        {characterLimit - noteText.length} Remaining
      </small>
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