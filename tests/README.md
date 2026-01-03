# Guitar Fretboard Tests

Comprehensive test suite for the guitar fretboard learning application.

## Overview

This directory contains unit tests for the core functionality of the guitar fretboard application, ensuring that note calculations, tuning systems, and game logic work correctly.

## Running Tests

### Browser-Based Test Runner

1. Start a local web server in the project root:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000/tests/
   ```

3. Click the **"▶️ Run Tests"** button to execute all tests

### Test Output

The test runner displays:
- ✅ Green checkmarks for passing tests
- ❌ Red X marks for failing tests
- Test summary showing passed/failed/total counts

## Test Coverage

The test suite includes **36 tests** covering:

### Guitar Configuration (6 tests)
- Tuning preset validation
- String count verification
- Open note correctness for each tuning

### Note System (6 tests)
- Chromatic scale completeness
- Sharp and flat notation
- Note naming consistency

### getNoteAtFret() Function (10 tests)
- Note calculation accuracy across all frets
- Octave wrapping (12th, 24th frets)
- Different tunings (Standard, Drop D, 7-string)
- Sharp vs. flat notation handling

### Game State (4 tests)
- Initial state validation
- Default settings verification
- Drill mode configuration

### Constants (4 tests)
- Fret count verification
- Exercise time settings
- Fret marker positions

### Edge Cases (3 tests)
- Chromatic scale wrapping
- Beyond 24 frets calculation
- All semitone coverage

### Tuning Validation (3 tests)
- Octave range validation
- String property completeness
- Logical octave ordering

## Test Framework

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
