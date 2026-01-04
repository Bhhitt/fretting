// Quiz Types Tests
// Tests for the new quiz type system and Find All Instances mode

function runQuizTypesTests() {
    const test = new TestRunner();

    test.describe('Quiz Type System', () => {
        test.it('QuizFactory should create FindNoteQuiz', () => {
            const mockGameState = { drillMode: 'find_note', fretStart: 0, fretEnd: 24 };
            const mockCallbacks = { onCorrect: () => {}, onIncorrect: () => {}, updatePrompt: () => {}, updateUI: () => {} };
            
            const quiz = QuizFactory.createQuiz('find_note', mockGameState, mockCallbacks);
            test.assert(quiz instanceof FindNoteQuiz, 'Should create FindNoteQuiz instance');
        });

        test.it('QuizFactory should create NameNoteQuiz', () => {
            const mockGameState = { drillMode: 'name_note', fretStart: 0, fretEnd: 24 };
            const mockCallbacks = { onCorrect: () => {}, onIncorrect: () => {}, updatePrompt: () => {}, updateUI: () => {} };
            
            const quiz = QuizFactory.createQuiz('name_note', mockGameState, mockCallbacks);
            test.assert(quiz instanceof NameNoteQuiz, 'Should create NameNoteQuiz instance');
        });

        test.it('QuizFactory should create FindAllInstancesQuiz', () => {
            const mockGameState = { drillMode: 'find_all_instances', fretStart: 0, fretEnd: 24 };
            const mockCallbacks = { onCorrect: () => {}, onIncorrect: () => {}, updatePrompt: () => {}, updateUI: () => {} };
            
            const quiz = QuizFactory.createQuiz('find_all_instances', mockGameState, mockCallbacks);
            test.assert(quiz instanceof FindAllInstancesQuiz, 'Should create FindAllInstancesQuiz instance');
        });

        test.it('QuizFactory should return supported modes', () => {
            const modes = QuizFactory.getSupportedModes();
            test.assertEqual(modes.length, 3, 'Should have 3 supported modes');
            test.assertArrayIncludes(modes.map(m => m.value), 'find_note', 'Should include find_note');
            test.assertArrayIncludes(modes.map(m => m.value), 'name_note', 'Should include name_note');
            test.assertArrayIncludes(modes.map(m => m.value), 'find_all_instances', 'Should include find_all_instances');
        });
    });

    test.describe('FindAllInstancesQuiz', () => {
        let quiz, mockGameState, promptText, uiUpdateCount;

        // Setup before each test
        function setup() {
            promptText = '';
            uiUpdateCount = 0;
            mockGameState = {
                currentNote: null,
                currentPositions: [],
                fretStart: 0,
                fretEnd: 24,
                drillMode: 'find_all_instances',
                useRandomRange: true // Default to enabled
            };
            const mockCallbacks = {
                onCorrect: () => {},
                onIncorrect: () => {},
                updatePrompt: (text) => { promptText = text; },
                updateUI: () => { uiUpdateCount++; }
            };
            quiz = new FindAllInstancesQuiz(mockGameState, mockCallbacks);
        }

        test.it('should initialize with empty selected positions', () => {
            setup();
            test.assertEqual(quiz.selectedPositions.size, 0, 'Should start with no selections');
        });

        test.it('should start a new question with a random note', () => {
            setup();
            quiz.startQuestion();
            test.assert(mockGameState.currentNote !== null, 'Should set current note');
            test.assertArrayIncludes(NOTES, mockGameState.currentNote, 'Current note should be valid');
        });

        test.it('should find all positions of the note across entire fretboard', () => {
            setup();
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            mockGameState.currentNote = 'C';
            
            // Manually trigger position finding
            mockGameState.currentPositions = [];
            STRINGS.forEach((string, stringIndex) => {
                for (let fret = mockGameState.fretStart; fret <= mockGameState.fretEnd; fret++) {
                    if (getNoteAtFret(stringIndex, fret) === 'C') {
                        mockGameState.currentPositions.push({ string: stringIndex, fret: fret });
                    }
                }
            });
            
            test.assertGreaterThan(mockGameState.currentPositions.length, 0, 'Should find at least one C note');
            test.assertLessThanOrEqual(mockGameState.currentPositions.length, 30, 'Should not exceed maximum possible positions');
        });

        test.it('should respect fret range when finding positions', () => {
            setup();
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            mockGameState.fretStart = 5;
            mockGameState.fretEnd = 10;
            mockGameState.currentNote = 'A';
            
            mockGameState.currentPositions = [];
            STRINGS.forEach((string, stringIndex) => {
                for (let fret = mockGameState.fretStart; fret <= mockGameState.fretEnd; fret++) {
                    if (getNoteAtFret(stringIndex, fret) === 'A') {
                        mockGameState.currentPositions.push({ string: stringIndex, fret: fret });
                    }
                }
            });
            
            // Verify all positions are within range
            mockGameState.currentPositions.forEach(pos => {
                test.assert(pos.fret >= 5 && pos.fret <= 10, `Fret ${pos.fret} should be between 5 and 10`);
            });
        });

        test.it('should toggle selection when clicking a position', () => {
            setup();
            quiz.handleInput({ string: 3, fret: 5 });
            test.assertEqual(quiz.selectedPositions.size, 1, 'Should select position');
            
            quiz.handleInput({ string: 3, fret: 5 });
            test.assertEqual(quiz.selectedPositions.size, 0, 'Should deselect position');
        });

        test.it('should track multiple selections', () => {
            setup();
            quiz.handleInput({ string: 0, fret: 5 });
            quiz.handleInput({ string: 1, fret: 10 });
            quiz.handleInput({ string: 2, fret: 15 });
            
            test.assertEqual(quiz.selectedPositions.size, 3, 'Should track 3 selections');
        });

        test.it('isPositionSelected should return correct state', () => {
            setup();
            quiz.handleInput({ string: 2, fret: 7 });
            
            test.assert(quiz.isPositionSelected(2, 7), 'Should return true for selected position');
            test.assert(!quiz.isPositionSelected(2, 8), 'Should return false for unselected position');
        });

        test.it('checkAnswer should return correct for perfect answer', () => {
            setup();
            mockGameState.currentPositions = [
                { string: 0, fret: 5 },
                { string: 1, fret: 10 }
            ];
            
            quiz.selectedPositions.add('0-5');
            quiz.selectedPositions.add('1-10');
            
            const result = quiz.checkAnswer();
            test.assert(result.correct, 'Should be correct when all positions selected');
            test.assertEqual(result.accuracy, 1, 'Accuracy should be 100%');
        });

        test.it('checkAnswer should return incorrect for partial answer', () => {
            setup();
            mockGameState.currentPositions = [
                { string: 0, fret: 5 },
                { string: 1, fret: 10 },
                { string: 2, fret: 15 }
            ];
            
            quiz.selectedPositions.add('0-5');
            quiz.selectedPositions.add('1-10');
            // Missing string: 2, fret: 15
            
            const result = quiz.checkAnswer();
            test.assert(!result.correct, 'Should be incorrect when positions missing');
            test.assert(result.accuracy < 1, 'Accuracy should be less than 100%');
        });

        test.it('checkAnswer should detect incorrect selections', () => {
            setup();
            mockGameState.currentPositions = [
                { string: 0, fret: 5 }
            ];
            
            quiz.selectedPositions.add('0-5');
            quiz.selectedPositions.add('1-10'); // Incorrect selection
            
            const result = quiz.checkAnswer();
            test.assert(!result.correct, 'Should be incorrect when wrong positions selected');
            test.assertEqual(result.incorrect.length, 1, 'Should identify one incorrect selection');
        });

        test.it('getUIElements should return submit button configuration', () => {
            setup();
            const uiElements = quiz.getUIElements();
            
            test.assert(uiElements.submitButton, 'Should have submitButton configuration');
            test.assertEqual(uiElements.submitButton.text, 'Submit Answer', 'Should have correct button text');
            test.assert(uiElements.submitButton.visible, 'Submit button should be visible');
        });

        test.it('submit button should be disabled when no selections', () => {
            setup();
            const uiElements = quiz.getUIElements();
            
            test.assert(!uiElements.submitButton.enabled, 'Submit button should be disabled with no selections');
        });

        test.it('submit button should be enabled with selections', () => {
            setup();
            quiz.handleInput({ string: 0, fret: 5 });
            
            const uiElements = quiz.getUIElements();
            test.assert(uiElements.submitButton.enabled, 'Submit button should be enabled with selections');
        });

        test.it('reset should clear all state', () => {
            setup();
            quiz.handleInput({ string: 0, fret: 5 });
            mockGameState.currentNote = 'D';
            mockGameState.currentPositions = [{ string: 0, fret: 5 }];
            
            quiz.reset();
            
            test.assertEqual(quiz.selectedPositions.size, 0, 'Should clear selections');
            test.assertEqual(mockGameState.currentNote, null, 'Should clear current note');
            test.assertEqual(mockGameState.currentPositions.length, 0, 'Should clear current positions');
        });

        test.it('should update prompt with fret range text', () => {
            setup();
            mockGameState.fretStart = 4;
            mockGameState.fretEnd = 8;
            
            quiz.startQuestion();
            
            // With random ranges, the prompt should show "between frets"
            test.assert(promptText.includes('between frets'), 'Prompt should mention fret range');
            // The range should be within the allowed range
            const match = promptText.match(/between frets (\d+)-(\d+)/);
            if (match) {
                const start = parseInt(match[1]);
                const end = parseInt(match[2]);
                test.assert(start >= 4 && end <= 8, 'Generated range should be within allowed range');
            }
        });

        test.it('should generate random fret ranges for each question', () => {
            setup();
            mockGameState.fretStart = 0;
            mockGameState.fretEnd = 24;
            mockGameState.useRandomRange = true; // Enable random ranges
            
            // Start multiple questions and check if ranges vary
            const ranges = [];
            for (let i = 0; i < 20; i++) { // Increased iterations for better reliability
                quiz.startQuestion();
                ranges.push({ start: quiz.questionFretStart, end: quiz.questionFretEnd });
            }
            
            // Check that at least some ranges are different (with 20 attempts, very likely)
            const uniqueRanges = new Set(ranges.map(r => `${r.start}-${r.end}`));
            test.assert(uniqueRanges.size > 1, 'Should generate varied random ranges');
        });

        test.it('should respect user-defined fret range boundaries', () => {
            setup();
            mockGameState.fretStart = 5;
            mockGameState.fretEnd = 15;
            
            // Test multiple times to ensure consistency
            for (let i = 0; i < 20; i++) {
                quiz.startQuestion();
                test.assert(quiz.questionFretStart >= 5, `Question start ${quiz.questionFretStart} should be >= 5`);
                test.assert(quiz.questionFretEnd <= 15, `Question end ${quiz.questionFretEnd} should be <= 15`);
                test.assert(quiz.questionFretStart <= quiz.questionFretEnd, 'Start should be <= end');
            }
        });

        test.it('should use entire range when user range is small', () => {
            setup();
            mockGameState.fretStart = 3;
            mockGameState.fretEnd = 7; // Only 5 frets
            mockGameState.useRandomRange = true;
            
            quiz.startQuestion();
            
            // When range is 5 or fewer frets, should use the entire range
            test.assertEqual(quiz.questionFretStart, 3, 'Should use full start');
            test.assertEqual(quiz.questionFretEnd, 7, 'Should use full end');
        });

        test.it('should use full fret range when random mode is disabled', () => {
            setup();
            mockGameState.fretStart = 0;
            mockGameState.fretEnd = 24;
            mockGameState.useRandomRange = false; // Disable random ranges
            
            quiz.startQuestion();
            
            // Should use the full user-defined range
            test.assertEqual(quiz.questionFretStart, 0, 'Should use user start');
            test.assertEqual(quiz.questionFretEnd, 24, 'Should use user end');
        });
    });

    return test.printSummary();
}

// Run tests if in browser
if (typeof window !== 'undefined') {
    window.runQuizTypesTests = runQuizTypesTests;
}
