# Test Smell: Surreal

## Odor Emitted

A test whose use of test doubles is so confusing, it's hard to tell what the
test is even doing at run-time.

## Known Causes

### 1. Haphazard mocking

There isn't much to be said here that hasn't already been said in [Contaminated
Test Subject](../contaminated-test-subject) [Fantasy](../fantasy) or [Mockers
Without Borders](../mockers-without-borders). This smell stands apart from those
in its sheer chaotic qualities. There's nothing quite as frustrating as looking
at a passing test result and failing to see how it could possibly add up, only
to realize that an easy-to-miss mock configuration or fake data fixture has
compromised the veracity of the test in subtle and surprising ways.

#### Deodorizer

Be consistent and conservative in your use of test doubles. Whenever you replace
a real thing with a fake thing, especially in a way that might come as
surprising to a future reader, do your best to make it big and visible within
the body of the test, and not hidden in a setup hook, test helper, or distant
fixture or factory file.

## About this Example

### Description

This example's subject sums the weight of the clothes passed to it. It's a
pretty simple method, with a couple wrinkles. First, each `Clothing` object's
weight is determined by its size, type, and wetness as determined by a `Factors`
object. Next, the weight of each of the three `Clothes` objects passed to the
subject has been faked in different ways:

1. A global stub override of the weight factor of "S" size clothes
2. A stub override of the `weight` method of a particular large jacket instance
3. A non-`Clothes` object that's preconfigured to respond with a fixed weight

The test asserts that the result equals 26. What does that 26 really mean? Not
much. It just happens to be the cumulation of what was real and what was fake in
this example.

### Challenge

Restore some clarity to this test by removing all the test doubles and calling
through to the actual `Factors` object. While it may be interesting to debate
the merits of faking that `Factors` type, this test is so deep into the
rabbit hole of irrelevance, that it's probably best to first shore things up and
verify what the subject would actually return when called under realistic
conditions.

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

