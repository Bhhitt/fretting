// Guitar configuration
const TUNING_PRESETS = {
    standard_6: [
        { name: 'E', openNote: 'E', octave: 4 },
        { name: 'B', openNote: 'B', octave: 3 },
        { name: 'G', openNote: 'G', octave: 3 },
        { name: 'D', openNote: 'D', octave: 3 },
        { name: 'A', openNote: 'A', octave: 2 },
        { name: 'E', openNote: 'E', octave: 2 }
    ],
    drop_d: [
        { name: 'E', openNote: 'E', octave: 4 },
        { name: 'B', openNote: 'B', octave: 3 },
        { name: 'G', openNote: 'G', octave: 3 },
        { name: 'D', openNote: 'D', octave: 3 },
        { name: 'A', openNote: 'A', octave: 2 },
        { name: 'D', openNote: 'D', octave: 2 }
    ],
    standard_7: [
        { name: 'E', openNote: 'E', octave: 4 },
        { name: 'B', openNote: 'B', octave: 3 },
        { name: 'G', openNote: 'G', octave: 3 },
        { name: 'D', openNote: 'D', octave: 3 },
        { name: 'A', openNote: 'A', octave: 2 },
        { name: 'E', openNote: 'E', octave: 2 },
        { name: 'B', openNote: 'B', octave: 1 }
    ]
};

let STRINGS = TUNING_PRESETS.standard_6;

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
let NOTES = NOTES_SHARP;
const NUM_FRETS = 24;
const EXERCISE_TIME = 60; // seconds

// Fret markers positions (standard guitar inlays)
const FRET_MARKERS = {
    3: 'dot', 5: 'dot', 7: 'dot', 9: 'dot',
    12: 'double-dot', 15: 'dot', 17: 'dot',
    19: 'dot', 21: 'dot', 24: 'double-dot'
};

// Game state
let gameState = {
    isPlaying: false,
    timeLeft: EXERCISE_TIME,
    score: 0,
    attempts: 0,
    currentNote: null,
    currentPositions: [],
    currentPosition: null, // For name_note mode
    timerInterval: null,
    drillMode: 'find_note', // find_note | name_note | find_all_instances
    fretStart: 0,
    fretEnd: 24,
    noteNaming: 'sharps' // sharps | flats
};

// Current quiz instance
let currentQuiz = null;

/**
 * Calculate the note at a specific fret on a guitar string
 * Uses chromatic scale to calculate note based on open string tuning
 * @param {number} stringIndex - Index of the string (0-5, where 0 is high E)
 * @param {number} fret - Fret number (0-24, where 0 is open string)
 * @returns {string} The note name (e.g., 'C', 'C#', 'D', etc.)
 */
function getNoteAtFret(stringIndex, fret) {
    const string = STRINGS[stringIndex];
    // Always use sharps for calculation since tuning is defined with sharp note names
    const openNoteIndex = NOTES_SHARP.indexOf(string.openNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    // Return the note in the current display notation (sharps or flats)
    return NOTES[noteIndex];
}

// Initialize the fretboard
function initFretboard() {
    const container = document.getElementById('stringsContainer');
    const markersContainer = document.getElementById('fretMarkers');
    
    // Create strings
    STRINGS.forEach((string, stringIndex) => {
        const stringDiv = document.createElement('div');
        stringDiv.className = 'string';
        
        const stringLine = document.createElement('div');
        stringLine.className = 'string-line';
        stringDiv.appendChild(stringLine);
        
        const label = document.createElement('div');
        label.className = 'string-label';
        label.textContent = string.name;
        stringDiv.appendChild(label);
        
        const fretPositions = document.createElement('div');
        fretPositions.className = 'fret-positions';
        
        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const fretDiv = document.createElement('div');
            fretDiv.className = 'fret';
            
            const notePos = document.createElement('div');
            notePos.className = 'note-position';
            notePos.dataset.string = stringIndex;
            notePos.dataset.fret = fret;
            notePos.dataset.note = getNoteAtFret(stringIndex, fret);
            notePos.addEventListener('click', handleNoteClick);
            
            fretDiv.appendChild(notePos);
            fretPositions.appendChild(fretDiv);
        }
        
        stringDiv.appendChild(fretPositions);
        container.appendChild(stringDiv);
    });
    
    // Create fret markers
    for (let fret = 0; fret <= NUM_FRETS; fret++) {
        const marker = document.createElement('div');
        marker.className = 'fret-marker';
        if (FRET_MARKERS[fret]) {
            marker.classList.add(FRET_MARKERS[fret]);
        }
        marker.textContent = fret;
        markersContainer.appendChild(marker);
    }
}

// Get random note
function getRandomNote() {
    return NOTES[Math.floor(Math.random() * NOTES.length)];
}

// Show feedback
function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = `${gameState.score}/${gameState.attempts}`;
}

// Update timer display
function updateTimer() {
    document.getElementById('timer').textContent = gameState.timeLeft;
}

// Start exercise
function startExercise() {
    gameState.isPlaying = true;
    gameState.timeLeft = EXERCISE_TIME;
    gameState.score = 0;
    gameState.attempts = 0;
    
    document.getElementById('startBtn').disabled = true;
    updateScore();
    updateTimer();
    
    // Initialize quiz
    initializeQuiz();
    startNewRound();
    
    // Start timer
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            endExercise();
        }
    }, 1000);
}

// End exercise
function endExercise() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('prompt').textContent = 'Exercise Complete!';
    
    // Clear all highlights including region highlighting
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('correct', 'incorrect', 'region-highlight');
    });
    
    // Show game over screen
    showGameOver();
}

// Show game over screen
function showGameOver() {
    const accuracy = gameState.attempts > 0 
        ? Math.round((gameState.score / gameState.attempts) * 100) 
        : 0;
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
        <div class="game-over-content">
            <h2>Exercise Complete!</h2>
            <div class="final-score">${gameState.score}/${gameState.attempts}</div>
            <p>Accuracy: ${accuracy}%</p>
            <p>Time: ${EXERCISE_TIME} seconds</p>
            <button class="start-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(gameOverDiv);
    
    // Remove on click outside
    gameOverDiv.addEventListener('click', (e) => {
        if (e.target === gameOverDiv) {
            gameOverDiv.remove();
        }
    });
}

// Reset exercise
function resetExercise() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.isPlaying = false;
    gameState.timeLeft = EXERCISE_TIME;
    gameState.score = 0;
    gameState.attempts = 0;
    gameState.currentNote = null;
    
    if (currentQuiz && currentQuiz.reset) {
        currentQuiz.reset();
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('prompt').textContent = 'Click "Start Exercise" to begin!';
    document.getElementById('submitBtn').style.display = 'none';
    
    updateScore();
    updateTimer();
    
    // Clear all highlights including region highlighting
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('correct', 'incorrect', 'active', 'selected', 'region-highlight');
    });
    
    // Hide note buttons if in name_note mode
    document.getElementById('noteButtons').style.display = 'none';
}

// Get random position within fret range
function getRandomPosition() {
    const validPositions = [];
    STRINGS.forEach((string, stringIndex) => {
        for (let fret = gameState.fretStart; fret <= gameState.fretEnd; fret++) {
            validPositions.push({ string: stringIndex, fret: fret });
        }
    });
    
    // Fallback to open position if no valid positions (shouldn't happen in normal use)
    if (validPositions.length === 0) {
        return { string: 0, fret: 0 };
    }
    
    return validPositions[Math.floor(Math.random() * validPositions.length)];
}

// Handle tuning change
function handleTuningChange() {
    const tuning = document.getElementById('tuningPreset').value;
    STRINGS = TUNING_PRESETS[tuning];
    
    // Rebuild fretboard
    document.getElementById('stringsContainer').innerHTML = '';
    document.getElementById('fretMarkers').innerHTML = '';
    initFretboard();
    
    // Reset if not playing
    if (!gameState.isPlaying) {
        resetExercise();
    }
}

// Handle note naming change
function handleNoteNamingChange() {
    const naming = document.getElementById('noteNaming').value;
    gameState.noteNaming = naming;
    NOTES = (naming === 'sharps') ? NOTES_SHARP : NOTES_FLAT;
    
    // Update note buttons if in name_note mode
    if (gameState.drillMode === 'name_note') {
        createNoteButtons();
    }
    
    // Rebuild fretboard to update note data attributes
    document.getElementById('stringsContainer').innerHTML = '';
    document.getElementById('fretMarkers').innerHTML = '';
    initFretboard();
}

// Handle fret range change
function handleFretRangeChange() {
    gameState.fretStart = parseInt(document.getElementById('fretStart').value);
    gameState.fretEnd = parseInt(document.getElementById('fretEnd').value);
    
    // Validate range
    if (gameState.fretStart > gameState.fretEnd) {
        [gameState.fretStart, gameState.fretEnd] = [gameState.fretEnd, gameState.fretStart];
        document.getElementById('fretStart').value = gameState.fretStart;
        document.getElementById('fretEnd').value = gameState.fretEnd;
    }
}

// Handle drill mode change
function handleDrillModeChange() {
    gameState.drillMode = document.getElementById('drillMode').value;
    
    if (gameState.drillMode === 'name_note') {
        createNoteButtons();
    } else {
        document.getElementById('noteButtons').style.display = 'none';
    }
    
    if (!gameState.isPlaying) {
        document.getElementById('prompt').textContent = 'Click "Start Exercise" to begin!';
    }
}

// Create note buttons for name_note mode
function createNoteButtons() {
    const container = document.getElementById('noteButtons');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    NOTES.forEach(note => {
        const btn = document.createElement('button');
        btn.className = 'note-btn';
        btn.textContent = note;
        btn.dataset.note = note;
        btn.addEventListener('click', handleNoteButtonClick);
        container.appendChild(btn);
    });
}

// Handle note button click (for name_note mode)
function handleNoteButtonClick(event) {
    if (!gameState.isPlaying || gameState.drillMode !== 'name_note') return;
    
    const selectedNote = event.target.dataset.note;
    const correctNote = getNoteAtFret(gameState.currentPosition.string, gameState.currentPosition.fret);
    
    gameState.attempts++;
    
    // Clear previous button states
    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct-answer', 'incorrect-answer');
    });
    
    if (selectedNote === correctNote) {
        gameState.score++;
        event.target.classList.add('correct-answer');
        showFeedback('Correct! ✓', 'correct');
        
        // Start new round after delay
        setTimeout(() => {
            startNewRoundNameNote();
        }, 1000);
    } else {
        event.target.classList.add('incorrect-answer');
        showFeedback('Try Again! ✗', 'incorrect');
        
        // Clear incorrect highlight after delay
        setTimeout(() => {
            event.target.classList.remove('incorrect-answer');
        }, 500);
    }
    
    updateScore();
}

// Start new round for name_note mode
function startNewRoundNameNote() {
    // Clear previous highlights
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('correct', 'incorrect', 'active');
    });
    
    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct-answer', 'incorrect-answer');
    });
    
    // Get random position
    gameState.currentPosition = getRandomPosition();
    const note = getNoteAtFret(gameState.currentPosition.string, gameState.currentPosition.fret);
    
    // Highlight the position
    const element = document.querySelector(
        `.note-position[data-string="${gameState.currentPosition.string}"][data-fret="${gameState.currentPosition.fret}"]`
    );
    if (element) {
        element.classList.add('active');
    }
    
    // Update prompt
    document.getElementById('prompt').textContent = `What note is highlighted?`;
}

// Update startNewRound to respect fret range
function startNewRound() {
    // Clear previous highlights
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('correct', 'incorrect', 'active', 'selected');
    });
    
    // Use quiz system
    if (currentQuiz) {
        currentQuiz.startQuestion();
    }
}

// Update handleNoteClick to work with quiz types
function handleNoteClick(event) {
    if (!gameState.isPlaying) return;
    
    const clickedString = parseInt(event.target.dataset.string);
    const clickedFret = parseInt(event.target.dataset.fret);
    const clickedNote = event.target.dataset.note;
    
    // Check if click is within fret range
    if (clickedFret < gameState.fretStart || clickedFret > gameState.fretEnd) {
        return; // Ignore clicks outside range
    }
    
    // Delegate to quiz type
    if (currentQuiz) {
        currentQuiz.handleInput({
            string: clickedString,
            fret: clickedFret,
            note: clickedNote,
            element: event.target
        });
    }
}

// Quiz callback functions
function createQuizCallbacks() {
    return {
        onCorrect: (input) => {
            gameState.score++;
            gameState.attempts++;
            
            if (input.element) {
                input.element.classList.add('correct');
            }
            
            showFeedback('Correct! ✓', 'correct');
            
            // Highlight all correct positions briefly
            gameState.currentPositions.forEach(pos => {
                const element = document.querySelector(
                    `.note-position[data-string="${pos.string}"][data-fret="${pos.fret}"]`
                );
                if (element) {
                    element.classList.add('correct');
                }
            });
            
            updateScore();
            
            // Clear highlights after delay (quiz will start new question)
            setTimeout(() => {
                document.querySelectorAll('.note-position').forEach(pos => {
                    pos.classList.remove('correct', 'incorrect', 'selected');
                });
            }, 1000);
        },
        
        onIncorrect: (input) => {
            gameState.attempts++;
            
            if (input.element) {
                input.element.classList.add('incorrect');
                setTimeout(() => {
                    input.element.classList.remove('incorrect');
                }, 500);
            }
            
            showFeedback('Try Again! ✗', 'incorrect');
            updateScore();
        },
        
        updatePrompt: (text) => {
            document.getElementById('prompt').textContent = text;
        },
        
        updateUI: () => {
            updateQuizUI();
        }
    };
}

// Update region highlighting based on fret range
function updateRegionHighlighting() {
    // Apply region highlighting only in find_all_instances mode when playing
    const shouldHighlight = gameState.isPlaying && gameState.drillMode === 'find_all_instances';
    
    document.querySelectorAll('.note-position').forEach(pos => {
        const fret = parseInt(pos.dataset.fret);
        const inRange = fret >= gameState.fretStart && fret <= gameState.fretEnd;
        
        if (shouldHighlight && inRange) {
            pos.classList.add('region-highlight');
        } else {
            pos.classList.remove('region-highlight');
        }
    });
}

// Update UI based on current quiz type
function updateQuizUI() {
    // Clear all highlights
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('active', 'selected');
    });
    
    // Update region highlighting
    updateRegionHighlighting();
    
    // Update based on drill mode
    if (gameState.drillMode === 'name_note' && gameState.currentPosition) {
        // Highlight the current position in name_note mode
        const element = document.querySelector(
            `.note-position[data-string="${gameState.currentPosition.string}"][data-fret="${gameState.currentPosition.fret}"]`
        );
        if (element) {
            element.classList.add('active');
        }
    } else if (gameState.drillMode === 'find_all_instances' && currentQuiz) {
        // Show selected positions in find_all_instances mode
        STRINGS.forEach((string, stringIndex) => {
            for (let fret = 0; fret <= NUM_FRETS; fret++) {
                const element = document.querySelector(
                    `.note-position[data-string="${stringIndex}"][data-fret="${fret}"]`
                );
                if (element && currentQuiz.isPositionSelected && currentQuiz.isPositionSelected(stringIndex, fret)) {
                    element.classList.add('selected');
                }
            }
        });
    }
    
    // Update submit button visibility
    const submitBtn = document.getElementById('submitBtn');
    if (gameState.drillMode === 'find_all_instances' && currentQuiz && currentQuiz.getUIElements) {
        const uiElements = currentQuiz.getUIElements();
        if (uiElements && uiElements.submitButton) {
            submitBtn.style.display = uiElements.submitButton.visible ? 'inline-block' : 'none';
            submitBtn.disabled = !uiElements.submitButton.enabled;
        }
    } else {
        submitBtn.style.display = 'none';
    }
}

// Initialize quiz instance
function initializeQuiz() {
    const callbacks = createQuizCallbacks();
    currentQuiz = QuizFactory.createQuiz(gameState.drillMode, gameState, callbacks);
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', startExercise);
document.getElementById('resetBtn').addEventListener('click', resetExercise);
document.getElementById('submitBtn').addEventListener('click', () => {
    if (currentQuiz && currentQuiz.handleInput) {
        currentQuiz.handleInput({ submit: true });
    }
});
document.getElementById('tuningPreset').addEventListener('change', handleTuningChange);
document.getElementById('noteNaming').addEventListener('change', handleNoteNamingChange);
document.getElementById('fretStart').addEventListener('change', handleFretRangeChange);
document.getElementById('fretEnd').addEventListener('change', handleFretRangeChange);
document.getElementById('drillMode').addEventListener('change', handleDrillModeChange);

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initFretboard();
    // Load settings from form
    handleFretRangeChange();
});
