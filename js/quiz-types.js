/**
 * Quiz Types Module
 * 
 * This module implements different quiz types using a factory pattern for clean separation of concerns.
 * Each quiz type implements a common interface for consistent behavior.
 */

/**
 * Base Quiz Type Interface
 * All quiz types should implement these methods
 */
class QuizType {
    constructor(gameState, callbacks) {
        this.gameState = gameState;
        this.callbacks = callbacks; // { onCorrect, onIncorrect, updatePrompt, updateUI }
    }

    /**
     * Start a new question
     */
    startQuestion() {
        throw new Error('startQuestion() must be implemented');
    }

    /**
     * Handle user interaction (click on fretboard or button)
     */
    handleInput(input) {
        throw new Error('handleInput() must be implemented');
    }

    /**
     * Check if the current answer is correct
     */
    checkAnswer() {
        throw new Error('checkAnswer() must be implemented');
    }

    /**
     * Reset quiz state
     */
    reset() {
        throw new Error('reset() must be implemented');
    }

    /**
     * Get quiz-specific UI elements
     */
    getUIElements() {
        return null;
    }
}

/**
 * Find Note Quiz
 * User clicks a single position on the fretboard to find the prompted note
 */
class FindNoteQuiz extends QuizType {
    startQuestion() {
        // Pick a random note
        this.gameState.currentNote = NOTES[Math.floor(Math.random() * NOTES.length)];
        
        // Find all positions of this note within the fret range
        this.gameState.currentPositions = [];
        STRINGS.forEach((string, stringIndex) => {
            for (let fret = this.gameState.fretStart; fret <= this.gameState.fretEnd; fret++) {
                if (getNoteAtFret(stringIndex, fret) === this.gameState.currentNote) {
                    this.gameState.currentPositions.push({ string: stringIndex, fret: fret });
                }
            }
        });

        this.callbacks.updatePrompt(`Find: ${this.gameState.currentNote}`);
    }

    handleInput(input) {
        const { string, fret, note } = input;
        
        if (note === this.gameState.currentNote) {
            this.callbacks.onCorrect(input);
            this.startQuestion(); // Move to next question
        } else {
            this.callbacks.onIncorrect(input);
        }
    }

    checkAnswer() {
        // Not used in this mode - checking happens on input
        return false;
    }

    reset() {
        this.gameState.currentNote = null;
        this.gameState.currentPositions = [];
    }
}

/**
 * Name Note Quiz
 * User identifies a highlighted position by clicking the correct note button
 */
class NameNoteQuiz extends QuizType {
    startQuestion() {
        // Get random position within fret range
        const position = this.getRandomPosition();
        this.gameState.currentPosition = position;
        this.gameState.currentNote = getNoteAtFret(position.string, position.fret);

        // Highlight the position
        this.callbacks.updateUI();
        this.callbacks.updatePrompt('What note is highlighted?');
    }

    handleInput(input) {
        const { note } = input;
        
        if (note === this.gameState.currentNote) {
            this.callbacks.onCorrect(input);
            this.startQuestion(); // Move to next question
        } else {
            this.callbacks.onIncorrect(input);
        }
    }

    getRandomPosition() {
        const validPositions = [];
        STRINGS.forEach((string, stringIndex) => {
            for (let fret = this.gameState.fretStart; fret <= this.gameState.fretEnd; fret++) {
                validPositions.push({ string: stringIndex, fret: fret });
            }
        });
        
        if (validPositions.length === 0) {
            return { string: 0, fret: 0 };
        }
        
        return validPositions[Math.floor(Math.random() * validPositions.length)];
    }

    checkAnswer() {
        // Not used in this mode - checking happens on input
        return false;
    }

    reset() {
        this.gameState.currentNote = null;
        this.gameState.currentPosition = null;
    }
}

/**
 * Find All Instances Quiz
 * User must select ALL positions of a specific note on the fretboard
 */
class FindAllInstancesQuiz extends QuizType {
    constructor(gameState, callbacks) {
        super(gameState, callbacks);
        this.selectedPositions = new Set(); // Set of "string-fret" keys
        this.submitted = false;
        this.questionFretStart = gameState.fretStart;
        this.questionFretEnd = gameState.fretEnd;
    }

    /**
     * Generate a random fret range for the question
     * Returns a range of 3-8 frets within the overall allowed range
     */
    generateRandomFretRange() {
        const userFretStart = this.gameState.fretStart;
        const userFretEnd = this.gameState.fretEnd;
        const totalFrets = userFretEnd - userFretStart + 1;
        
        // If user range is small (5 frets or less), use the entire range
        if (totalFrets <= 5) {
            return { start: userFretStart, end: userFretEnd };
        }
        
        // Generate a random range size between 3 and 8 frets
        const minRangeSize = 3;
        const maxRangeSize = Math.min(8, totalFrets);
        const rangeSize = Math.floor(Math.random() * (maxRangeSize - minRangeSize + 1)) + minRangeSize;
        
        // Pick a random starting position within the allowed range
        const maxStartFret = userFretEnd - rangeSize + 1;
        const startFret = Math.floor(Math.random() * (maxStartFret - userFretStart + 1)) + userFretStart;
        const endFret = startFret + rangeSize - 1;
        
        return { start: startFret, end: endFret };
    }

    startQuestion() {
        // Generate a random fret range for this question (if enabled)
        if (this.gameState.useRandomRange) {
            const range = this.generateRandomFretRange();
            this.questionFretStart = range.start;
            this.questionFretEnd = range.end;
        } else {
            // Use the full user-defined range
            this.questionFretStart = this.gameState.fretStart;
            this.questionFretEnd = this.gameState.fretEnd;
        }
        
        // Pick a random note
        this.gameState.currentNote = NOTES[Math.floor(Math.random() * NOTES.length)];
        
        // Find all positions of this note within the question's fret range
        this.gameState.currentPositions = [];
        STRINGS.forEach((string, stringIndex) => {
            for (let fret = this.questionFretStart; fret <= this.questionFretEnd; fret++) {
                if (getNoteAtFret(stringIndex, fret) === this.gameState.currentNote) {
                    this.gameState.currentPositions.push({ string: stringIndex, fret: fret });
                }
            }
        });

        this.selectedPositions.clear();
        this.submitted = false;
        
        const rangeText = `between frets ${this.questionFretStart}-${this.questionFretEnd}`;
        
        this.callbacks.updatePrompt(`Select ALL ${this.gameState.currentNote} notes ${rangeText}`);
        this.callbacks.updateUI();
    }

    handleInput(input) {
        if (this.submitted) return; // Don't allow changes after submission

        const { string, fret, submit } = input;

        if (submit) {
            // Submit answer for checking
            this.submitAnswer();
            return;
        }

        // Toggle selection
        const key = `${string}-${fret}`;
        if (this.selectedPositions.has(key)) {
            this.selectedPositions.delete(key);
        } else {
            this.selectedPositions.add(key);
        }

        this.callbacks.updateUI();
    }

    submitAnswer() {
        this.submitted = true;
        const result = this.checkAnswer();
        
        if (result.correct) {
            this.callbacks.onCorrect({ 
                positions: Array.from(this.selectedPositions),
                accuracy: result.accuracy 
            });
            // Start new question after a delay
            setTimeout(() => {
                this.startQuestion();
            }, 300);
        } else {
            this.callbacks.onIncorrect({ 
                positions: Array.from(this.selectedPositions),
                accuracy: result.accuracy,
                missed: result.missed,
                incorrect: result.incorrect
            });
            // Allow retry
            setTimeout(() => {
                this.submitted = false;
                this.callbacks.updateUI();
            }, 2000);
        }
    }

    checkAnswer() {
        // Build set of correct positions
        const correctSet = new Set(
            this.gameState.currentPositions.map(p => `${p.string}-${p.fret}`)
        );

        // Calculate accuracy metrics
        const correctlySelected = Array.from(this.selectedPositions).filter(
            key => correctSet.has(key)
        ).length;
        
        const missed = this.gameState.currentPositions.filter(
            p => !this.selectedPositions.has(`${p.string}-${p.fret}`)
        );
        
        const incorrect = Array.from(this.selectedPositions).filter(
            key => !correctSet.has(key)
        );

        const accuracy = correctlySelected / this.gameState.currentPositions.length;
        const perfect = missed.length === 0 && incorrect.length === 0;

        return {
            correct: perfect,
            accuracy: accuracy,
            missed: missed,
            incorrect: incorrect
        };
    }

    isPositionSelected(string, fret) {
        return this.selectedPositions.has(`${string}-${fret}`);
    }

    reset() {
        this.gameState.currentNote = null;
        this.gameState.currentPositions = [];
        this.selectedPositions.clear();
        this.submitted = false;
    }

    getUIElements() {
        // Return submit button configuration
        return {
            submitButton: {
                text: 'Submit Answer',
                visible: true,
                enabled: this.selectedPositions.size > 0 && !this.submitted
            }
        };
    }
}

/**
 * Quiz Type Factory
 * Creates appropriate quiz type based on drill mode
 */
class QuizFactory {
    static createQuiz(drillMode, gameState, callbacks) {
        switch (drillMode) {
            case 'find_note':
                return new FindNoteQuiz(gameState, callbacks);
            case 'name_note':
                return new NameNoteQuiz(gameState, callbacks);
            case 'find_all_instances':
                return new FindAllInstancesQuiz(gameState, callbacks);
            default:
                throw new Error(`Unknown drill mode: ${drillMode}`);
        }
    }

    static getSupportedModes() {
        return [
            { value: 'find_note', label: 'Find Note' },
            { value: 'name_note', label: 'Name Note' },
            { value: 'find_all_instances', label: 'Find All Instances' }
        ];
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizType, FindNoteQuiz, NameNoteQuiz, FindAllInstancesQuiz, QuizFactory };
}
