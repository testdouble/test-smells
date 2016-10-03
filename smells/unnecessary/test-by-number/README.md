# Test Smell: Test By Number

## Odor Emitted

## Known Causes

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

/* Smell: Test By Number
 *
 *
 * If you look at the example below, it may seem like a fine test example, but
 * when you imagine it in the context of a broader application, it raises several
 * concerns:
 *   * All of the tests depend on the existence of persisted User models, meaning
 *   there is a risk that (a) changes to User would break this test, making it
 *   brittle; and (b) this test's construction of User models might be
 *   unrealistic when compared to how User models look in production
 *
 *   * A test strategy like this one can lead to 100% test coverage, but because
 *   of how strictly cordoned-off and siloed they are, they fail to test the
 *   interaction of features. For instance, what happens if a User model is
 *   deleted? Does the deletion cascade to their address? Unless we break out of
 *   the mold to think of this, that very common case won't be tested (but the
 *   relatively uncommon case of a user deleting only their address will have
 *   been)
 *
 *   * Most applications feature a common striation of layers, either by way of
 *   a framework's prescription or our team's convention, and both can tempt us
 *   to test each instance of each layer by rote, even though it's quite possible
 *   this will lead to costly Redundant Coverage (see:
 *   unnecessary/7-layer-testing)
 *
 *   * In some cases, this mandate of "write a test for every X type object"
 *   actually distracts from the imperative to build abstractions that eliminate
 *   redundancy. If your test of, say, a controller could conceivably be
 *   generated, then so could the controller itself!
 */


