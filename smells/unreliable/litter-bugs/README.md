# Test Smell: Litter Bugs

## Odor Emitted

Each test has a side effect that persists between test cases, often resulting in
tests that depend on one another. This is often called "test pollution"

## Known Causes

The most common cause for Litter Bug tests is when we don't understand the
persisted consequences of calling our subject under test or (indirectly) its
dependencies. Perhaps a method the subject depends on memoizes (caches) its
results, which in turn couples each subsequent test to the behavior of the
first.

### Deodorizer

Many test runners support running test cases in a random order, which can
identify a test's dependence on test pollution as early as possible so it can be
corrected. If the test pollution is discovered late, it generally requires the
entire test be scrutinized and its expected results to be recalculated.
Typically, an `afterEach` hook is the appropriate place to clean up after the
persisted impact of the test

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

