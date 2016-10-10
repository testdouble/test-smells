# Test Smell: Paranoid

## Odor Emitted

A test (and as a result, its subject) covers edge cases that aren't actually
reachable by the production application.

## Known Causes

### 1. Local optima crowding out global optima

Most developers want to earnestly make each unit of code as robust and correct
as possible. Meanwhile, having a fresh bit of a code and a blank slate with
which to test it offers up infinite possibilities for the inputs & outputs that
the unit might conceivably need to handle.

The positive consequence of this is that good unit testing can encourage
developers to consider many corner cases that would be hard to see from a higher
vantage point. However, in cases where a higher-order object has already
accounted for, say, a particular class of inputs, it would be wasteful for
lower-order objects to redundantly guard against the same conditions. A unit
test may be able to exercise those conditions in the subject under test, but in
production, such guard closes may effectively be unreachable dead code!

#### Deodorizer

While it's a healthy question to ask at any point "is there anything else this
unit needs to do before I call it done and move on", it's important to also
consider the broader context in which the unit will be called. Most code we
write will only ever be invoked by a single caller, and considering edge cases
that said caller doesn't need to worry about is effectively to future-proof
the unit ([YAGNI](http://en.wikipedia.org/wiki/YAGNI)).

The best advice we have in this case is to simply remove the code that's
determined to be unreachable from production and its associated tests.

## About this Example

### Description

This example method attempts to escape values for use in a CSV marshalling
method, but its caller (located at the bottom of the listing) is already
assuring that the subject under test will only ever be called with a string.
Why, then, is the subject concerning itself with non-`String` inputs?
(Recursively, no less!)

### Challenge

The challenge here is to ensure the subject doesn't contain logic that wouldn't
be reachable by production if its `csvFor`/`csv_for` caller was the only thing
depending on it. If the condition checking to see if the input isn't a `String`
were removed, what tests would breaK? What would be the appropriate follow-up
action?

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
