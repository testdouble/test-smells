# Test Smell: Generative

## Odor Emitted

A test loops over a data structure of discrete inputs and expected outputs to
generate test cases.

## Known Causes

### 1. Data tangled within logic

Most often, generative tests are written against functions that tangle bits of
the same data in with the logic (often in branch controls like if/switch).
Because the subject contains a lot of branching that's based on this embedded
data, fully covering the subject requires lots and lots of test cases. And if
those test cases start to look repetitive, then the immediate impulse might be
to address that repetition in the test.

#### Deodorizer

Redundant test code is usually the fault of the subject's design, not the test.
Building a test-scoped loop to salve that pain would rob us of its real utility:
encouraging us to detangle the data and logic in the subject's design. A
practical way to start is to look at the data structure you would have used to
generate the test cases: if the production code had access to a similar data
structure, would it be able to simplify its logical branches? For related
discussion on test-scoped abstractions, see [Chafing](../chafing).

### 2. More examples than necessary

Testing by example (which describes nearly all unit tests) will inherently only
cover a handful of representative cases of inputs & outputs from the
usually-infinite set of valid values for each of the types involved.
Nevertheless, some developers will try to cover so many examples that generative
testing starts to seem like a good (if not necessary) ideal. Testing every
possible input & value is an impossible goal, and attempts to cover every case
with an example will yield diminishing returns. Moreover, leaning on generative
testing can lull teams into a complacency; it's not uncommon to find a
generative test that creates dozens of redundant examples but (because it
wouldn't fit the pattern of the generation function) fails to consider error and
edge cases.

#### Deodorizer

A good rule of thumb is to only add a test if it will fail, forcing an
improvement to the implementation. When practicing any variety of test-first, if
an additional test doesn't immediately fail, the added cost of reading and
maintaining the test is likely to exced the utility of what's likely a redundant
example.

For related commentary, see [Paranoid](../../unnecessary/paranoid).

## About this Example

### Description

The roman numeral kata is an old stand-by in TDD circles. This implementation
clearly exhibits the root cause described above regarding data that's tangled up
with the implementation's logic, whereas the subject has been neatly DRYed up in
a way that has discriminated the data (examples of inputs & outputs) from the
behavior (the test method itself).

### Challenge

If it's not clear how to move forward in this example, try extracting the object
of input/output pairs and referencing it from the subject. If `toArabic` had
access to a struct by which it could look up the arabic value of each roman
numeral, could the amount of one-off if/else branching be simplifed?

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
