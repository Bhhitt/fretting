# Fretting - Guitar Fretboard Learning Application

## 📋 Table of Contents
- [Overview](#overview)
- [Current Features](#current-features)
- [Technical Implementation](#technical-implementation)
- [User Interface](#user-interface)
- [Game Mechanics](#game-mechanics)
- [Code Structure](#code-structure)
- [Future Enhancement Ideas](#future-enhancement-ideas)

## Overview

Fretting is a web-based guitar fretboard learning application designed to help guitarists improve their note recognition skills through interactive, timed exercises. The application presents a visual representation of a guitar fretboard and challenges users to identify specific notes within a time limit.

## Current Features

### 🎸 Guitar Fretboard Display
- **Visual Representation**: Interactive fretboard with 24 frets and 6 strings
- **Standard Tuning**: E (high), B, G, D, A, E (low)
- **Fret Markers**: Visual inlay markers at frets 3, 5, 7, 9, 12 (double), 15, 17, 19, 21, and 24 (double)
- **String Labels**: Each string is labeled with its note name on the left side
- **Clickable Positions**: All 150 note positions (6 strings × 25 positions) are clickable

### ⏱️ Timed Exercise Mode
- **Duration**: 60-second timed challenges
- **Random Note Selection**: System randomly prompts users to find notes from all 12 chromatic notes (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- **Countdown Timer**: Live countdown display showing remaining time
- **Auto-completion**: Exercise automatically ends when timer reaches zero

### 🎯 Interactive Gameplay
- **Note Prompting**: Clear display showing which note to find (e.g., "Find: B")
- **Click-to-Answer**: Users click on the fretboard position they believe contains the prompted note
- **Immediate Feedback**:
  - ✅ **Correct**: Green highlight with "Correct! ✓" message
  - ❌ **Incorrect**: Red highlight with "Try Again! ✗" message
- **Multiple Attempts**: Users can keep trying until they find the correct note
- **Progressive Rounds**: After a correct answer, a new random note is prompted

### 📊 Score Tracking
- **Real-time Scoring**: Displays score as "correct/total attempts" (e.g., "1/2")
- **Accuracy Calculation**: Final score shows percentage accuracy
- **Performance Summary**: End-of-exercise modal displays:
  - Total correct answers
  - Total attempts
  - Accuracy percentage
  - Time duration (60 seconds)

### 🎨 Visual Design
- **Gradient Background**: Purple gradient background (#667eea to #764ba2)
- **Realistic Fretboard**: Brown wood-textured appearance with metal fret bars
- **String Visualization**: Varying line thickness to represent different string gauges
- **Hover Effects**: Visual feedback when hovering over clickable positions
- **Animations**:
  - Pulse animation for correct answers
  - Shake animation for incorrect answers
  - Fade-in/fade-out for feedback messages

### 🎮 Controls
- **Start Exercise**: Green button to begin a new 60-second session
- **Reset**: Red button to stop current exercise and reset all values
- **Game Over Modal**: Displays results with option to close

## Technical Implementation

### Architecture
- **Single-Page Application**: Entirely self-contained in `index.html`
- **No Dependencies**: No external libraries or frameworks required
- **Vanilla JavaScript**: Pure JavaScript for all functionality
- **Embedded CSS**: All styling included inline
- **No Build Process**: Can be opened directly in any modern browser

### File Structure
```
fretting/
├── .git/
├── .gitignore          # Excludes node_modules, IDE files, OS files, tmp files
├── README.md           # Basic project description and usage
├── DOCUMENTATION.md    # This file - comprehensive documentation
└── index.html          # Main application file (691 lines)
```

### Key Constants
- `STRINGS`: Array defining 6 guitar strings with their tuning
- `NOTES`: Array of 12 chromatic notes
- `NUM_FRETS`: Set to 24 frets
- `EXERCISE_TIME`: 60 seconds per exercise
- `FRET_MARKERS`: Object mapping fret positions to marker types (dot/double-dot)

### Timing Values (hardcoded)
- New round delay: 1000ms (delay before starting new round after correct answer)
- Feedback delay: 500ms (delay before clearing incorrect highlight)
- Feedback duration: 1000ms (duration to show feedback messages)

### Core Functions

#### Note Calculation
- `getNoteAtFret(stringIndex, fret)`: Calculates note at specific position using chromatic scale math
- `getRandomNote()`: Returns random note from NOTES array
- `findNotePositions(note)`: Scans entire fretboard to find all positions containing a specific note

#### Game Flow
- `initFretboard()`: Builds DOM structure for fretboard visualization
- `startExercise()`: Initializes new 60-second exercise session
- `startNewRound()`: Prompts user with new random note
- `endExercise()`: Stops timer and shows results modal
- `resetExercise()`: Resets all game state to initial values

#### User Interaction
- `handleNoteClick(event)`: Processes user clicks on fretboard positions
- `showFeedback(message, type)`: Displays temporary feedback overlay
- `updateScore()`: Updates score display
- `updateTimer()`: Updates countdown timer display

### Game State
JavaScript object tracking:
- `isPlaying`: Boolean indicating if exercise is active
- `timeLeft`: Remaining seconds in current exercise
- `score`: Number of correct answers
- `attempts`: Total number of clicks/attempts
- `currentNote`: The note currently being asked for
- `currentPositions`: Array of all fretboard positions containing current note
- `timerInterval`: Reference to timer interval for cleanup

## User Interface

### Layout
1. **Header**: Title "🎸 Guitar Fretboard Learning"
2. **Control Panel**:
   - Left: Prompt area showing current instruction
   - Center: Timer and score display
   - Right: Start/Reset buttons
3. **Fretboard Area**: Interactive guitar neck visualization
4. **Modal Overlay**: Game-over screen (appears when exercise ends)

### Color Scheme
- Primary Purple: #667eea
- Secondary Purple: #764ba2
- Success Green: #27ae60
- Error Red: #e74c3c
- Neutral Gray: Various shades for UI elements
- Wood Brown: #8B4513, #654321 for fretboard

### Responsive Features
- Horizontal scrolling for fretboard on smaller screens
- Flexbox layout for control panel
- Minimum width constraints to maintain usability

## Game Mechanics

### Note Distribution
- All 12 chromatic notes have equal probability of being selected
- Each note appears on multiple fretboard positions:
  - Most notes appear on 12-13 different positions across the fretboard
  - Users must identify ANY valid position for the prompted note

### Scoring System
- **Points**: +1 for each correct answer
- **Attempts**: Counter increments on every click (correct or incorrect)
- **Accuracy**: Calculated as (score / attempts) × 100%
- **No Penalties**: Incorrect answers don't decrease score, only affect accuracy

### Win Condition
- No explicit "win" condition
- Goal is to maximize correct answers and accuracy within 60 seconds
- Self-improvement focused: Compare current performance to previous attempts

### Difficulty
- Current difficulty: **Beginner to Intermediate**
- Challenges:
  - 60-second time pressure
  - 12 different notes to recognize
  - Multiple valid positions per note
  - All 150 fretboard positions available

## Code Structure

### HTML Structure
- Container div with white background card
- Header with title
- Controls section with prompt, stats, and buttons
- Fretboard container with:
  - Strings container (dynamically generated)
  - Fret markers (dynamically generated)

### CSS Organization
- Reset styles (*, body)
- Layout components (container, controls, fretboard)
- Interactive elements (buttons, note positions)
- Animations (@keyframes: pulse, shake, fadeInOut)
- Responsive utilities (overflow, flexbox)

### JavaScript Organization
1. **Configuration**: Constants and configuration objects
2. **State Management**: gameState object
3. **Utility Functions**: Note calculation helpers
4. **Initialization**: Fretboard DOM generation
5. **Game Logic**: Exercise flow control
6. **Event Handlers**: User interaction processing
7. **UI Updates**: Display refresh functions
8. **Initialization**: DOMContentLoaded event listener

## Future Enhancement Ideas

### Potential Features (Not Yet Implemented)
- **Difficulty Levels**: Easy (single octave), Medium (12 frets), Hard (24 frets)
- **Exercise Variations**:
  - Chord recognition
  - Scale patterns
  - Interval training
- **Customization**:
  - Adjustable timer duration
  - Different tunings (Drop D, DADGAD, etc.)
  - Number of strings (7-string, bass, etc.)
- **Progress Tracking**:
  - Session history
  - Performance graphs
  - Personal best records
  - LocalStorage persistence
- **Learning Modes**:
  - Practice mode (no timer)
  - Show all positions of a note
  - Hint system
- **Accessibility**:
  - Keyboard navigation
  - Screen reader support
  - High contrast mode
- **Audio**:
  - Play note sounds
  - Audio feedback for correct/incorrect
- **Social Features**:
  - Leaderboard
  - Share scores
  - Challenge friends

### Technical Improvements (Not Yet Implemented)
- Performance optimization: Pre-compute note position map
- Touch device optimization
- Progressive Web App (PWA) capabilities
- Unit tests
- Multi-language support

---

**Version**: 1.0  
**Last Updated**: January 3, 2026  
**Total Lines of Code**: ~691 lines (single file)  
**Dependencies**: None  
**Browser Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
