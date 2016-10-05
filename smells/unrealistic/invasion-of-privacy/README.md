# Test Smell: Invasion Of Privacy

## Odor Emitted

## Known Causes

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

/* Smell: Invasion of Privacy
 *
 * In the example below, the test of the private function drove out two
 * if-statements that are simultaneously unreachable in production (e.g. dead
 * code) that nevertheless have 100% code coverage (e.g. no one will ever feel safe
 * deleting them).
 *
 * See: unnecessary/paranoid
 *
 * [Note: Because it's hard to demonstrate changing the visibility of, say, an
 * anonymous function to one that's exported in a single file example, the
 * following example uses a `__` prefix to denote variables intended to be
 * private from users of the object.]
 *
 * [Note 2: Remember, privacy is not about what's technically reachable, it's
 * what the author intends to prevent others from depending on so that the
 * implementation can be freely changed in the future!]
 */

