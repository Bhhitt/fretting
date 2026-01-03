# Guitar Fretboard Tests

Comprehensive test suite for the guitar fretboard learning application.

## Overview

This directory contains unit tests for the core functionality of the guitar fretboard application, ensuring that note calculations, tuning systems, game logic, and quiz types work correctly.

## Running Tests

### Browser-Based Test Runner

1. Start a local web server in the project root:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000/tests/all-tests.html
   ```

3. Click the **"▶️ Run All Tests"** button to execute all tests

### Test Output

The test runner displays:
- ✅ Green checkmarks for passing tests
- ❌ Red X marks for failing tests
- Test summary showing passed/failed/total counts

## Test Coverage

The test suite includes **56 tests** covering:

### App Logic Tests (36 tests)

**Guitar Configuration (6 tests)**
- Tuning preset validation
- String count verification
- Open note correctness for each tuning

**Note System (6 tests)**
- Chromatic scale completeness
- Sharp and flat notation
- Note naming consistency

**getNoteAtFret() Function (10 tests)**
- Note calculation accuracy across all frets
- Octave wrapping (12th, 24th frets)
- Different tunings (Standard, Drop D, 7-string)
- Sharp vs. flat notation handling

**Game State (4 tests)**
- Initial state validation
- Default settings verification
- Drill mode configuration

**Constants (4 tests)**
- Fret count verification
- Exercise time settings
- Fret marker positions

**Edge Cases (3 tests)**
- Chromatic scale wrapping
- Beyond 24 frets calculation
- All semitone coverage

**Tuning Validation (3 tests)**
- Octave range validation
- String property completeness
- Logical octave ordering

### Quiz Types Tests (20 tests)

**Quiz Type System (4 tests)**
- Factory pattern creation of quiz instances
- Supported mode enumeration

**FindAllInstancesQuiz (16 tests)**
- Selection/deselection mechanics
- Multi-select tracking
- Position detection
- Answer validation (perfect, partial, incorrect)
- Fret range restrictions
- Submit button state management
- Prompt generation
- State reset functionality

## Test Files

- `all-tests.html` - Combined test runner for all test suites
- `index.html` - Original app logic test runner
- `test-framework.js` - Lightweight testing framework
- `app.test.js` - Test suite for application logic (36 tests)
- `quiz-types.test.js` - Test suite for quiz type system (20 tests)
- `README.md` - This file

The tests use a custom lightweight testing framework (`test-framework.js`) with the following features:

- `describe(suiteName, fn)` - Group related tests
- `it(testName, fn)` - Define individual tests
- `assert(condition, message)` - Basic assertions
- `assertEqual(actual, expected, message)` - Equality checks
- `assertDeepEqual(actual, expected, message)` - Deep object/array comparison
- `assertArrayIncludes(array, value, message)` - Array membership
- `assertGreaterThan(actual, expected, message)` - Numeric comparisons
- `assertLessThanOrEqual(actual, expected, message)` - Numeric comparisons

## Files

- `index.html` - Browser-based test runner with UI
- `test-framework.js` - Lightweight testing framework
- `app.test.js` - Test suite for application logic
- `README.md` - This file

## Adding New Tests

To add new tests, edit `app.test.js`:

```javascript
test.describe('Your Test Suite', () => {
    test.it('should do something', () => {
        const result = yourFunction();
        test.assertEqual(result, expectedValue, 'Optional message');
    });
});
```

## Current Status

**All 36 tests passing ✅**

The test suite validates:
- ✅ Correct note calculation across all strings and frets
- ✅ Proper handling of multiple tunings
- ✅ Sharp and flat notation switching
- ✅ Game state initialization
- ✅ Edge cases and boundary conditions
- ✅ Data structure validation

## Future Enhancements

Potential additions to the test suite:
- UI interaction tests
- Timer functionality tests
- Score calculation tests
- Settings persistence tests
- Drill mode behavior tests
- Error handling tests
