# Test Smell: Long

## Odor Emitted

A test method is so long that it's testing multiple things.

## Known Causes

### 1. Failure to appreciate Arrange-Act-Assert

The concept of each test having three discrete "phases" (often called
[Arrange-Act-Assert](https://github.com/testdouble/contributing-tests/wiki/Arrange-Act-Assert))
is very helpeful for crafting consistent, readable tests. Put simply, each test
should first set up its state ("Arrange"), then invoke the behavior under test
("Act"), and finally verify it does what was expected ("Assert"). Test
libraries of all kinds, whether in an xUnit or a BDD style give users
organizational mechanisms to discriminate one test from another, so a single
cycle of arrange-act-assert is generally considered to be the most readable (and
from a reporting & debugging perspective, useful) heuristic to determine when
one test should end another should start

Sadly, this meme isn't ubiquitously known, and many tests out there will simply
ramble on arbitrarily, for lack of a clear governing principle for what really
makes a test.

#### Deodorizer

To clear up this smell, identify each cycle of discrete set-up, invocation, and
expctation steps in a test and extract it into a standalone test of its own.
This may be complicated if the setup is tangled (e.g. in an
"Arrange-arrange-arrange, act-act, assert-asert-assert" pattern). In such a
case, it may make sense to instead identify the responsibilities being asserted
in the long test, name new tests around those things, and then write fresh tests
that target each facet of the subject on its own.

### 2. Multi-step integration testing

This smell is also common when writing "automation" tests, like a test that
opens a browser window and then takes a long series of actions. These tests are
often written with the same testing libraries being used for a project's unit
tests, and as a result the rampant violation of arrange-act-assert can stick out
as awkward. However, the alternative of carving up each action into a separate
test is unlikely to be practical because the amount of pre-requisite setup for
each observation would dramatically increase the test suite's run-time.

#### Deodorizer

First, it's important to keep in mind that automation tests that bob and weave
throughout the system are fundamentally different from tests that invoke a pure
function and evaluate its result. It's perfectly okay that such a test takes a
number of actions, so long as all the actions are necessary to evaluate that the
system is working.

One thing to keep in mind is that there may be an impedance mismatch between the
testing API being used and the way the automation script will flow. I've often
seen teams struggle with how to organize RSpec or Mocha tests of browser
automation, and sometimes found that it's actually preferable to write entirely
custom, standalone scripts for each of a project's smoke tests, in the interest
of linear clarity and clearer debugging.

After all, what makes a test a test is our decision to look to a bit of code for
confirmation that some other code is behaving as we expect. Whether that test
reside inside an API provided to us by a capital-T Testing Framework is
inconsequential.

## About this Example

### Description

At a glance, it's clear that this example of a long test—a stateful `Stack`
data structure—exhibits the first root cause discussed above: a lack of an
appreciation for arrange-act-assert.

### Challenge

Split the test into separate test methods for each of the things being tested.
Consider whether anything the stack does was missed by the test, or whether any
of the resulting tests might be unnecessary (receiving indirect coverage through
the others). These are questions that are harder to answer when a single test
method is written to fully cover a subject.

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

