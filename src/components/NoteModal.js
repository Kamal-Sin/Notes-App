import React from 'react';
import { MdClose, MdDeleteForever, MdPushPin, MdEdit } from 'react-icons/md';

const NoteModal = ({ note, onClose, onDelete, onTogglePin, onUpdateCategory }) => {
  const [isEditingCategory, setIsEditingCategory] = React.useState(false);
  const [tempCategory, setTempCategory] = React.useState(note?.category || 'Personal');
  
  // Update tempCategory when note changes
  React.useEffect(() => {
    if (note) {
      setTempCategory(note.category);
    }
  }, [note]);
  
  if (!note) return null;
  
  const categories = ['Work', 'Personal', 'Ideas', 'Tasks', 'Important'];

  const handleCategorySave = () => {
    onUpdateCategory(note.id, tempCategory);
    setIsEditingCategory(false);
  };

  const handleCategoryCancel = () => {
    setTempCategory(note.category);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <div className="note-modal-overlay" onClick={handleBackdropClick}>
      <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="note-modal-header">
          <div className="note-modal-category-section">
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
                  style={{ backgroundColor: getCategoryColor(note.category) }}
                >
                  {note.category}
                </span>
                <MdEdit 
                  onClick={() => setIsEditingCategory(true)}
                  className="edit-category-icon" 
                  size="1em" 
                />
              </div>
            )}
          </div>
          <div className="note-modal-actions">
            {note.isPinned && (
              <span className="pin-badge">
                <MdPushPin size="1em" /> Pinned
              </span>
            )}
            <MdPushPin 
              onClick={() => onTogglePin(note.id)}
              className={`pin-icon ${note.isPinned ? 'pinned' : ''}`} 
              size="1.5em" 
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            />
            <MdDeleteForever 
              onClick={handleDelete}
              className="delete-icon" 
              size="1.5em"
              title="Delete note"
            />
            <MdClose 
              onClick={onClose}
              className="close-icon" 
              size="1.5em"
              title="Close"
            />
          </div>
        </div>
        
        <div className="note-modal-body">
          <h2 className="note-modal-title">{note.title}</h2>
          <div className="note-modal-text">{note.text}</div>
          <div className="note-modal-footer">
            <small className="note-modal-date">Created: {note.date}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
