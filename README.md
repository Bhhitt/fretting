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
├── README.md           # This file
├── DOCUMENTATION.md    # Comprehensive documentation
└── design.txt          # Design document
```

## Features
- Interactive guitar fretboard with 24 frets and 6 strings
- Multiple drill modes (Find Note, Name Note)
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
