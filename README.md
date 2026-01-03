# fretting
Guitar fretting exercises

## Overview
A web-based guitar fretboard learning application that helps guitarists improve their note recognition through timed exercises.

## Project Structure
```
fretting/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Application styles
├── js/
│   └── app.js          # Application logic
├── tests/
│   ├── index.html      # Test runner
│   ├── test-framework.js  # Testing framework
│   ├── app.test.js     # Test suite
│   └── README.md       # Testing documentation
├── README.md           # This file
├── DOCUMENTATION.md    # Comprehensive documentation
└── design.txt          # Design document
```

## Features
- Interactive guitar fretboard with 24 frets and 6 strings
- **Three drill modes**:
  - **Find Note**: Click a single position for the prompted note
  - **Name Note**: Identify a highlighted position by selecting the note name
  - **Find All Instances**: Select ALL positions of a specific note (with optional fret range restriction)
- Timed exercises (60 seconds)
- Multiple tuning presets (Standard 6-string, Drop D, 7-string)
- Note naming options (Sharps/Flats)
- Customizable fret range
- Visual feedback for correct/incorrect answers
- Score tracking with accuracy calculation
- Responsive design

## How to Use
1. Open `index.html` in a web browser
2. Configure settings (drill mode, tuning, fret range, etc.)
3. Click "Start Exercise" to begin
4. Find and click the prompted note on the fretboard (or identify highlighted notes)
5. Continue until time runs out
6. View your final score and accuracy

## Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required - just open the HTML file!

## Development
The application uses vanilla JavaScript with no build process required. All files are organized into:
- **HTML**: Main structure and markup
- **CSS**: All styling and animations
- **JavaScript**: Game logic, state management, and interactivity

### Testing
A comprehensive test suite is included in the `tests/` directory:
- **56 unit tests** covering note calculations, tuning systems, game logic, and quiz types
- Browser-based test runner with visual feedback
- Run tests by opening `tests/all-tests.html` in a browser

To run tests:
1. Start a local server: `python3 -m http.server 8000`
2. Navigate to `http://localhost:8000/tests/all-tests.html`
3. Click "Run All Tests"

See `tests/README.md` for detailed testing documentation.
