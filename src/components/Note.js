import React, { useState } from 'react';
import { MdDeleteForever, MdPushPin, MdEdit } from 'react-icons/md';

const Note = React.memo(({ 
  id, 
  title,
  text, 
  date, 
  category, 
  isPinned, 
  handleDeleteNote, 
  handleTogglePin, 
  handleUpdateCategory 
}) => {
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  
  const categories = ['Work', 'Personal', 'Ideas', 'Tasks', 'Important'];

  const handleCategorySave = () => {
    handleUpdateCategory(id, tempCategory);
    setIsEditingCategory(false);
  };

  const handleCategoryCancel = () => {
    setTempCategory(category);
    setIsEditingCategory(false);
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Work': '#ff6b6b',
      'Personal': '#4ecdc4',
      'Ideas': '#45b7d1',
      'Tasks': '#96ceb4',
      'Important': '#feca57'
    };
    return colors[cat] || '#95a5a6';
  };

  return(
    <div className={`note ${isPinned ? 'pinned' : ''}`} data-category={category}>
      {isPinned && (
        <div className="pin-indicator">
          <MdPushPin size="1.2em" />
        </div>
      )}
      
      <div className="note-header">
        <div className="category-section">
          {isEditingCategory ? (
            <div className="category-edit">
              <select 
                value={tempCategory} 
                onChange={(e) => setTempCategory(e.target.value)}
                className="category-select-small"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button onClick={handleCategorySave} className="save-category">✓</button>
              <button onClick={handleCategoryCancel} className="cancel-category">✕</button>
            </div>
          ) : (
            <div className="category-display">
              <span 
                className="category-tag"
                style={{ backgroundColor: getCategoryColor(category) }}
              >
                {category}
              </span>
              <MdEdit 
                onClick={() => setIsEditingCategory(true)}
                className="edit-category-icon" 
                size="1em" 
              />
            </div>
          )}
        </div>
      </div>

      <h3 className="note-title">{title}</h3>
      <span className="note-text">{text}</span>
      
      <div className="note-footer">
        <small>{date}</small>
        <div className="note-actions">
          <MdPushPin 
            onClick={() => handleTogglePin(id)}
            className={`pin-icon ${isPinned ? 'pinned' : ''}`} 
            size="1.3em" 
          />
          <MdDeleteForever 
            onClick={() => handleDeleteNote(id)}
            className="delete-icon" 
            size="1.3em" 
          />
        </div>
      </div>
    </div>
  )
});

export default Note;