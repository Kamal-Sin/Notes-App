import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { MdMic, MdMicOff } from 'react-icons/md';

const AddNote = ({ handleAddNote }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [interimText, setInterimText] = useState('');
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const noteTextRef = useRef(noteText);
  const isListeningRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);
  const retryCountRef = useRef(0);
  const titleCharacterLimit = 50;
  const textCharacterLimit = 200;

  // Keep ref in sync with state
  useEffect(() => {
    noteTextRef.current = noteText;
  }, [noteText]);

  // Keep listening ref in sync
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Add event handlers for debugging
      recognition.onstart = () => {
        console.log('Speech recognition started');
        // Reset retry count on successful start
        retryCountRef.current = 0;
        setErrorMessage('');
      };

      recognition.onspeechstart = () => {
        console.log('Speech detected - user started speaking');
      };

      recognition.onspeechend = () => {
        console.log('Speech ended - waiting for final results');
      };

      recognition.onresult = (event) => {
        console.log('onresult called', {
          resultIndex: event.resultIndex,
          resultsLength: event.results.length,
          lastProcessedIndex: lastProcessedIndexRef.current
        });
        
        // Reset retry count on successful result
        retryCountRef.current = 0;
        setErrorMessage('');
        
        let newFinalTranscript = '';
        let currentInterim = '';

        // Process only new results that we haven't processed yet
        // Start from the last processed index + 1, or from resultIndex if it's larger
        const startIndex = Math.max(event.resultIndex, lastProcessedIndexRef.current + 1);
        
        for (let i = startIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          console.log(`Result ${i}:`, {
            transcript: transcript,
            isFinal: result.isFinal,
            confidence: result[0].confidence
          });
          
          if (result.isFinal) {
            // Process final results
            newFinalTranscript += transcript + ' ';
            lastProcessedIndexRef.current = i;
            console.log('Final transcript added:', transcript);
          } else {
            // Collect interim results for display
            currentInterim += transcript;
          }
        }

        // Show interim results in real-time
        if (currentInterim) {
          setInterimText(currentInterim);
          console.log('Interim text:', currentInterim);
        } else {
          setInterimText('');
        }

        // Append new final transcript to note text
        if (newFinalTranscript.trim()) {
          const currentText = noteTextRef.current;
          // Remove any trailing space and add new text
          const trimmedCurrent = currentText.trim();
          const newText = trimmedCurrent + (trimmedCurrent ? ' ' : '') + newFinalTranscript.trim();
          
          // Check character limit
          if (textCharacterLimit - newText.length >= 0) {
            setNoteText(newText);
            console.log('Added transcript:', newFinalTranscript.trim());
          } else {
            // If over limit, truncate to fit
            const truncatedText = newText.substring(0, textCharacterLimit);
            setNoteText(truncatedText);
            console.log('Text truncated due to limit');
          }
          // Clear interim text when we get final results
          setInterimText('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', {
          error: event.error,
          message: event.message || 'No additional error message'
        });
        
        // Handle different error types
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable microphone access in your browser settings.');
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'aborted') {
          // User manually stopped, don't restart
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'network') {
          // Network error - speech recognition requires internet connection
          retryCountRef.current += 1;
          console.warn('Network error:', retryCountRef.current, 'retry attempts');
          
          // Stop retrying after 3 attempts to prevent infinite loop
          if (retryCountRef.current >= 3) {
            console.error('Too many network errors. Stopping recognition.');
            setErrorMessage('Network error: Unable to connect to speech recognition service. This may be due to firewall, VPN, or network restrictions. Please check your network settings or try again later.');
            setIsListening(false);
            isListeningRef.current = false;
            retryCountRef.current = 0;
            try {
              recognitionRef.current.stop();
            } catch (e) {
              console.error('Error stopping after network failures:', e);
            }
          } else {
            setErrorMessage(`Network error: Retrying... (${retryCountRef.current}/3)`);
            // Clear the error message after 3 seconds
            setTimeout(() => {
              if (retryCountRef.current < 3) {
                setErrorMessage('');
              }
            }, 3000);
            // Don't stop listening - let onend handle restarting
          }
        } else if (event.error === 'no-speech') {
          // No speech detected - this is normal, just continue listening
          console.log('No speech detected, continuing to listen...');
        } else if (event.error === 'audio-capture') {
          // No microphone found or not working
          alert('No microphone found or microphone is not working. Please check your microphone settings.');
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'service-not-allowed') {
          // Speech recognition service not allowed
          alert('Speech recognition service is not available. Please check your browser settings.');
          setIsListening(false);
          isListeningRef.current = false;
        }
        // For other errors, let onend handle restarting if still in listening mode
      };

      recognition.onend = () => {
        // Only restart if user is still in listening mode (didn't manually stop)
        // and we haven't exceeded retry limit
        if (isListeningRef.current && retryCountRef.current < 3) {
          // Add a longer delay before restarting to avoid rapid restart loops
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current && retryCountRef.current < 3) {
              try {
                // Restart recognition automatically
                recognitionRef.current.start();
                console.log('Speech recognition restarted (attempt', retryCountRef.current + 1, ')');
                // Clear any error messages when successfully restarted (but only if we get results)
              } catch (error) {
                // If restart fails, stop listening
                console.error('Error restarting recognition:', error);
                // Only stop if it's a critical error (not just a temporary network issue)
                if (error.message && error.message.includes('already started')) {
                  // Recognition is already running, which is fine
                  console.log('Recognition already running');
                } else {
                  setIsListening(false);
                  isListeningRef.current = false;
                  retryCountRef.current = 0;
                }
              }
            }
          }, 500); // Longer delay to prevent rapid restart attempts
        } else if (retryCountRef.current >= 3) {
          // We've exceeded retry limit, stop trying
          console.log('Stopped retrying due to network errors');
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [textCharacterLimit]);

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

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // User wants to stop - set flag first, then stop
      isListeningRef.current = false;
      setIsListening(false);
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    } else {
      // User wants to start - reset the processed index and retry count
      lastProcessedIndexRef.current = -1;
      retryCountRef.current = 0;
      isListeningRef.current = true;
      setIsListening(true);
      setErrorMessage('');
      setInterimText('');
      
      // Check if we're on HTTPS or localhost (required for speech recognition)
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isSecure) {
        setErrorMessage('Speech recognition requires HTTPS. Please use https:// or run on localhost.');
        setIsListening(false);
        isListeningRef.current = false;
        return;
      }
      
      try {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
        console.log('Speech recognition start() called successfully');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setErrorMessage(`Error starting: ${error.message || error}`);
        setIsListening(false);
        isListeningRef.current = false;
      }
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
    
    <div className="textarea-container">
      <textarea 
        ref={textareaRef}
        rows="8" 
        cols="10" 
        placeholder="Type to add a note... (Ctrl+Enter to save)"
        value={noteText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      ></textarea>
      {isSupported && (
        <button
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          type="button"
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          {isListening ? <MdMicOff /> : <MdMic />}
        </button>
      )}
      {errorMessage && (
        <div className="voice-error-message">
          {errorMessage}
        </div>
      )}
      {interimText && isListening && (
        <div className="interim-text">
          {interimText}
        </div>
      )}
    </div>
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