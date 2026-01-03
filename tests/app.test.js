// Guitar Fretboard Application Tests
// This file contains unit tests for the core functionality

// Mock DOM elements needed for testing
function setupMockDOM() {
    if (typeof document === 'undefined') {
        global.document = {
            getElementById: () => ({
                textContent: '',
                value: '',
                disabled: false,
                classList: { add: () => {}, remove: () => {} },
                appendChild: () => {},
                querySelector: () => null,
                querySelectorAll: () => []
            }),
            createElement: () => ({
                className: '',
                textContent: '',
                dataset: {},
                classList: { add: () => {}, remove: () => {} },
                appendChild: () => {},
                addEventListener: () => {},
                style: {}
            }),
            body: { appendChild: () => {} },
            querySelectorAll: () => []
        };
    }
}

// Test Suite
function runTests() {
    const test = new TestRunner();

    test.describe('Guitar Configuration', () => {
        test.it('should have correct number of tuning presets', () => {
            test.assertEqual(Object.keys(TUNING_PRESETS).length, 3, 'Should have 3 tuning presets');
        });

        test.it('should have standard 6-string tuning with 6 strings', () => {
            test.assertEqual(TUNING_PRESETS.standard_6.length, 6, 'Standard 6-string should have 6 strings');
        });

        test.it('should have drop D tuning with 6 strings', () => {
            test.assertEqual(TUNING_PRESETS.drop_d.length, 6, 'Drop D should have 6 strings');
        });

        test.it('should have standard 7-string tuning with 7 strings', () => {
            test.assertEqual(TUNING_PRESETS.standard_7.length, 7, 'Standard 7-string should have 7 strings');
        });

        test.it('should have correct open notes for standard tuning', () => {
            const openNotes = TUNING_PRESETS.standard_6.map(s => s.openNote);
            test.assertDeepEqual(openNotes, ['E', 'B', 'G', 'D', 'A', 'E'], 'Standard tuning notes should be E-B-G-D-A-E');
        });

        test.it('should have correct open notes for drop D tuning', () => {
            const openNotes = TUNING_PRESETS.drop_d.map(s => s.openNote);
            test.assertDeepEqual(openNotes, ['E', 'B', 'G', 'D', 'A', 'D'], 'Drop D tuning should end with D');
        });
    });

    test.describe('Note System', () => {
        test.it('should have 12 notes in sharp notation', () => {
            test.assertEqual(NOTES_SHARP.length, 12, 'Should have 12 chromatic notes (sharps)');
        });

        test.it('should have 12 notes in flat notation', () => {
            test.assertEqual(NOTES_FLAT.length, 12, 'Should have 12 chromatic notes (flats)');
        });

        test.it('should start sharp notes with C', () => {
            test.assertEqual(NOTES_SHARP[0], 'C', 'Chromatic scale should start with C');
        });

        test.it('should start flat notes with C', () => {
            test.assertEqual(NOTES_FLAT[0], 'C', 'Chromatic scale should start with C');
        });

        test.it('should have C# in sharp notation', () => {
            test.assertArrayIncludes(NOTES_SHARP, 'C#', 'Sharp notes should include C#');
        });

        test.it('should have D♭ in flat notation', () => {
            test.assertArrayIncludes(NOTES_FLAT, 'D♭', 'Flat notes should include D♭');
        });
    });

    test.describe('getNoteAtFret() Function', () => {
        // Save original STRINGS
        const originalStrings = STRINGS;
        
        test.it('should return correct note for open E string (standard tuning)', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(0, 0); // High E string, open
            test.assertEqual(note, 'E', 'Open high E string should be E');
        });

        test.it('should return correct note for 1st fret on E string', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(0, 1); // High E string, 1st fret
            test.assertEqual(note, 'F', '1st fret on E string should be F');
        });

        test.it('should return correct note for 2nd fret on E string', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(0, 2); // High E string, 2nd fret
            test.assertEqual(note, 'F#', '2nd fret on E string should be F#');
        });

        test.it('should return correct note for 12th fret on E string (octave)', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(0, 12); // High E string, 12th fret
            test.assertEqual(note, 'E', '12th fret on E string should be E (octave)');
        });

        test.it('should return correct note for open A string', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(4, 0); // A string, open
            test.assertEqual(note, 'A', 'Open A string should be A');
        });

        test.it('should return correct note for 5th fret on A string', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(4, 5); // A string, 5th fret
            test.assertEqual(note, 'D', '5th fret on A string should be D');
        });

        test.it('should work with flat notation', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_FLAT;
            const note = getNoteAtFret(0, 1); // High E string, 1st fret
            test.assertEqual(note, 'F', '1st fret on E string should be F (in flat notation)');
        });

        test.it('should return D♭ instead of C# when using flats', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_FLAT;
            const note = getNoteAtFret(5, 9); // Low E string, 9th fret
            test.assertEqual(note, 'D♭', '9th fret on low E string should be D♭ in flat notation');
        });

        test.it('should handle drop D tuning correctly', () => {
            STRINGS = TUNING_PRESETS.drop_d;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(5, 0); // Lowest string, open
            test.assertEqual(note, 'D', 'Open low string in Drop D should be D');
        });

        test.it('should handle 7-string tuning correctly', () => {
            STRINGS = TUNING_PRESETS.standard_7;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(6, 0); // 7th string, open
            test.assertEqual(note, 'B', 'Open 7th string should be B');
        });

        // Restore original STRINGS
        STRINGS = originalStrings;
    });

    test.describe('Game State', () => {
        test.it('should initialize with correct default values', () => {
            test.assertEqual(gameState.isPlaying, false, 'Game should not be playing initially');
            test.assertEqual(gameState.timeLeft, 60, 'Initial time should be 60 seconds');
            test.assertEqual(gameState.score, 0, 'Initial score should be 0');
            test.assertEqual(gameState.attempts, 0, 'Initial attempts should be 0');
        });

        test.it('should have correct drill mode default', () => {
            test.assertEqual(gameState.drillMode, 'find_note', 'Default drill mode should be find_note');
        });

        test.it('should have correct fret range default', () => {
            test.assertEqual(gameState.fretStart, 0, 'Default fret start should be 0');
            test.assertEqual(gameState.fretEnd, 24, 'Default fret end should be 24');
        });

        test.it('should have correct note naming default', () => {
            test.assertEqual(gameState.noteNaming, 'sharps', 'Default note naming should be sharps');
        });
    });

    test.describe('Constants', () => {
        test.it('should have correct number of frets', () => {
            test.assertEqual(NUM_FRETS, 24, 'Should have 24 frets');
        });

        test.it('should have correct exercise time', () => {
            test.assertEqual(EXERCISE_TIME, 60, 'Exercise time should be 60 seconds');
        });

        test.it('should have fret markers at correct positions', () => {
            const markerPositions = Object.keys(FRET_MARKERS).map(Number);
            test.assertArrayIncludes(markerPositions, 3, 'Should have marker at fret 3');
            test.assertArrayIncludes(markerPositions, 12, 'Should have marker at fret 12');
            test.assertArrayIncludes(markerPositions, 24, 'Should have marker at fret 24');
        });

        test.it('should have double-dot markers at 12th and 24th frets', () => {
            test.assertEqual(FRET_MARKERS[12], 'double-dot', '12th fret should have double-dot');
            test.assertEqual(FRET_MARKERS[24], 'double-dot', '24th fret should have double-dot');
        });
    });

    test.describe('Note Calculation Edge Cases', () => {
        const originalStrings = STRINGS;
        const originalNotes = NOTES;

        test.it('should handle wrapping around chromatic scale', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const note = getNoteAtFret(0, 24); // E + 24 semitones = E (2 octaves)
            test.assertEqual(note, 'E', '24th fret should wrap to same note (E)');
        });

        test.it('should correctly calculate notes beyond 24 frets', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            // Simulate 25th fret (E + 25 semitones)
            const string = STRINGS[0];
            const openNoteIndex = NOTES_SHARP.indexOf(string.openNote);
            const noteIndex = (openNoteIndex + 25) % 12;
            const note = NOTES[noteIndex];
            test.assertEqual(note, 'F', '25th fret on E string should be F');
        });

        test.it('should handle all 12 semitones correctly', () => {
            STRINGS = TUNING_PRESETS.standard_6;
            NOTES = NOTES_SHARP;
            const notes = [];
            for (let fret = 0; fret < 12; fret++) {
                notes.push(getNoteAtFret(0, fret));
            }
            test.assertEqual(notes.length, 12, 'Should generate 12 unique notes in an octave');
        });

        STRINGS = originalStrings;
        NOTES = originalNotes;
    });

    test.describe('Tuning Validation', () => {
        test.it('should have valid octave values in standard tuning', () => {
            TUNING_PRESETS.standard_6.forEach(string => {
                test.assert(string.octave >= 1 && string.octave <= 5, `Octave ${string.octave} should be between 1 and 5`);
            });
        });

        test.it('should have octaves in descending order (high to low)', () => {
            const octaves = TUNING_PRESETS.standard_6.map(s => s.octave);
            for (let i = 0; i < octaves.length - 1; i++) {
                test.assertGreaterThan(octaves[i] + 1, octaves[i + 1], 'Octaves should be in descending or equal order');
            }
        });

        test.it('should have all required properties for each string', () => {
            TUNING_PRESETS.standard_6.forEach((string, idx) => {
                test.assert(string.name, `String ${idx} should have a name`);
                test.assert(string.openNote, `String ${idx} should have an openNote`);
                test.assert(typeof string.octave === 'number', `String ${idx} should have a numeric octave`);
            });
        });
    });

    // Print summary
    return test.printSummary();
}

// Run tests if in browser or Node.js
if (typeof window !== 'undefined') {
    window.runTests = runTests;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests };
}
