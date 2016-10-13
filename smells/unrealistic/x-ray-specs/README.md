# Test Smell: X Ray Specs

## Odor Emitted

A test that accesses or edits private, internal state of the subject that it
shouldn't logically be privy to.

## Known Causes

### 1. Tangling logic & data

As frustrating as tests like this can be, their chief driver is often a lack of
any other mechanism by which to exercise the subject. The traditional way
object-oriented programming is taught often encourages developers to not only
associate application logic with long-lived working state, but to encapsulate
that data behind minimal public APIs.

What happens when the minimal public APIs for accessing that data don't leave
enough latitude for tests to control or inspect the system's state?

1. You could add the accessor functions your tests need (at the expense of
   criticism of changing the design just to make things more testable).

2. You could access the intended-to-be-private state directly, coupling your
   tests to an implementation detail and constraining future maintainers'
   ability to aggressively refactor it

3. You could challenge whether the subject needs to own that data to begin with

#### Deodorizer

The clearest path forward we've found is behind door #3 identified above. By
separating application state from the functions that define our business logic,
just about any subject will become more testable. One avenue: introduce a
data-centric object that the subject could depend on and which could be more
properly controlled by the test. Another approach: pass in more of the data the
logic needs to perform its task, and provide more informative return values
instead of persisting the state elsewhere.

This approach doesn't just lead to more testable code, it also fosters a clearer
separation of concerns.

## About this Example

### Description

In this example, you can see the test is routinely exploiting its ability
to access private variables on the subject to do its assertions (when the
prudent thing to do would be to design a public API so that the behavior
of the subject could be asserted without looking at its internal state).
However, the last test requirement takes this to a new extreme: intentionally
mucking with the state of the subject's cache of approved seat changes to
ensure that the subject isn't making an approval call unnecessarily. It makes
sense within the context of the test (where the author is already comfortable
with accessing the subject's internal state), but upon introspection a better
strategy would be to test whether the interaction between `SeatMap` and the
approval API takes place in a more direct, less ambiguous way.

### Challenge

Attempt to rework this test in two phases:

1. First, get the test resituated such that it does not directly access the
   private approval data
2. Extract (or eliminate) the responsibility of maintaining the approvals state
   from the subject, using the refactored tests for regression safety to the
   extent possible

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
