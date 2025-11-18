# React Notes App

A modern, feature-rich notes application built with React that allows users to create, manage, and search through their notes with a beautiful dark/light mode interface.

## Features

- **Create & Delete Notes**: Add new notes with a 200-character limit and delete existing ones
- ** Smart Search**: Real-time search with debounced input for better performance
- ** Dark/Light Mode**: Toggle between dark and light themes
- ** Local Storage**: Notes are automatically saved to browser's local storage
- ** Keyboard Shortcuts**: Use Ctrl+Enter to quickly save notes
- ** Responsive Design**: Works seamlessly on desktop and mobile devices
- ** Performance Optimized**: Uses React.memo and useCallback for better performance
- ** Modern UI**: Clean, intuitive interface with smooth animations

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

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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
- Type your note content (max 200 characters)
- Click "Save" or press `Ctrl+Enter` to save

### Searching Notes
- Use the search bar to filter notes in real-time
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

## Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Optimizes function references
- **Debounced Search**: Reduces search API calls
- **Lazy Loading**: Efficient component loading

## Author

**Kamal Singh**