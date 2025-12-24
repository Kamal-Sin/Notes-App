# React Notes App

A modern, feature-rich notes application built with React that allows users to create, manage, and search through their notes with a beautiful dark/light mode interface.

## Features

- **Create & Delete Notes**: Add new notes with a 1000-character limit and delete existing ones
- **Smart Search**: Real-time search with debounced input for better performance
- **AI-Powered Features**:
  - **Auto-Title Generation**: Automatically generates descriptive titles from note content using AI
  - **Semantic Search**: Search notes by meaning, not just keywords (requires API key)
- **Dark/Light Mode**: Toggle between dark and light themes
- **Local Storage**: Notes are automatically saved to browser's local storage
- **Keyboard Shortcuts**: Use Ctrl+Enter to quickly save notes
- **Voice Input**: Speech-to-text functionality for hands-free note creation
- **Categories**: Organize notes with categories (Work, Personal, Ideas, Tasks, Important)
- **Pin Notes**: Pin important notes to keep them at the top
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance Optimized**: Uses React.memo and useCallback for better performance
- **Modern UI**: Clean, intuitive interface with smooth animations

##  Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-notes-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up AI features:
   - Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) (free tier available)
   - Create a `.env` file in the root directory:
   ```env
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - **Important**: Restart the development server after adding the `.env` file
   - Without an API key, the app will still work but AI features (auto-title generation and semantic search) will use fallback methods

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes ESLint issues
- `npm run format` - Formats code using Prettier

## Usage

### Creating Notes
- Click on the "Type to add a note..." textarea
- Type your note content (max 1000 characters)
- Optionally add a title, or leave it blank for AI auto-generation
- Click "Save" or press `Ctrl+Enter` to save
- Use the microphone icon for voice input (requires browser permission)

### Searching Notes
- Use the search bar to filter notes in real-time
- Toggle between **Keyword** and **Semantic** search modes (if API key is configured)
  - **Keyword Search**: Traditional text matching
  - **Semantic Search**: Find notes by meaning and context
- Click the clear icon (✕) to reset the search

### Managing Notes
- Hover over notes to see a subtle lift effect
- Click the delete icon to remove a note
- Toggle between dark and light mode using the "Toggle Mode" button


## Error Handling

The app includes comprehensive error handling for:
- Local storage operations
- Data loading and saving
- User input validation

## Styling

- **CSS Grid**: Responsive layout using CSS Grid
- **CSS Transitions**: Smooth animations for better UX
- **Dark Mode**: Complete dark theme support
- **Mobile-First**: Responsive design for all screen sizes

## Technologies Used

- **React 18** - Modern React with hooks
- **CSS Grid** - Responsive layout system
- **Local Storage** - Client-side data persistence
- **React Icons** - Beautiful icon library
- **Nanoid** - Unique ID generation
- **Google Gemini API** - AI-powered title generation and semantic search (optional)
- **Web Speech API** - Voice input functionality

## Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Optimizes function references
- **Debounced Search**: Reduces search API calls
- **Lazy Loading**: Efficient component loading

## AI Features Details

### Auto-Title Generation
When you save a note without a title, the app automatically generates a descriptive title using AI. If no API key is configured, it uses a smart fallback that extracts the first sentence or first 50 characters.

### Semantic Search
Semantic search understands the meaning of your query, not just exact keyword matches. For example:
- Searching "meeting notes" will find notes about "conference discussions" or "team gatherings"
- Searching "shopping list" will find notes about "things to buy" or "grocery items"

**Note**: Semantic search requires a Google Gemini API key and generates embeddings for your notes. Embeddings are stored locally and generated asynchronously when notes are created.

## Author

**Kamal Singh**