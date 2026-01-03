// Simple Test Framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    describe(suiteName, fn) {
        console.log(`\n📦 ${suiteName}`);
        fn();
    }

    it(testName, fn) {
        try {
            fn();
            this.results.push({ name: testName, passed: true });
            console.log(`  ✅ ${testName}`);
        } catch (error) {
            this.results.push({ name: testName, passed: false, error: error.message });
            console.error(`  ❌ ${testName}`);
            console.error(`     ${error.message}`);
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    }

    assertDeepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
    }

    assertArrayIncludes(array, value, message) {
        if (!array.includes(value)) {
            throw new Error(message || `Expected array to include ${value}`);
        }
    }

    assertGreaterThan(actual, expected, message) {
        if (actual <= expected) {
            throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
        }
    }

    assertLessThanOrEqual(actual, expected, message) {
        if (actual > expected) {
            throw new Error(message || `Expected ${actual} to be less than or equal to ${expected}`);
        }
    }

    printSummary() {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;

        console.log('\n' + '='.repeat(50));
        console.log(`📊 Test Summary: ${passed}/${total} passed`);
        if (failed > 0) {
            console.log(`❌ Failed tests: ${failed}`);
        }
        console.log('='.repeat(50));

        return { passed, failed, total };
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestRunner;
}
