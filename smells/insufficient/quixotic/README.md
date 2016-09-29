# Test Smell: Quixotic

## Odor Emitted

A test that charts an idealistic path through the subject code, cherry-picking
inputs that provide minimum resistance (e.g. in test data setup), which may
result in missed test coverage in code that handle negative cases. Notably, this
is more likely to occur when those negative cases are also somehow complex, which
is precisely when good testing is important!

## Known Causes

### 1. Too few tests

Maybe you're testing in a hurry, or maybe your team only cares that something
"be tested" as opposed to being tested robustly. No matter the reason, many
developers write enough tests to be sure a unit works when it obviously ought to,
but when the going gets tough—like when multiple variables can combine for
surprising effect—edge cases go untested. It's even entirely possible for a
code coverage testing tool to report 100% test coverage and still have important
functionality that is not demanded by a test

#### Deodorizer

The easy solution is to write more tests! When practicing test-driven
development, this smell is an anti-pattern that suggests changes were made to the
subject without a test to first demand the change. When testing code
after-the-fact, it suggests someone may not have planned to write a test for
a certain case or may have failed to imagine the possibility of said case.

The harder solution is to recognize that an ommitted test is also an ommission of
the original author's intent. It's possible the test was ommitted for good
reason!

The most important thing for future maintainers is crystal clear intent: if a
test was intentionally omitted with some justification: leave behind a comment
to indicate it as such. Otherwise, any ommissions might be seen as potential
oversights, and the ambiguity that can arise may result in wasted analysis time
later.

By "analysis", I mean that a future maintainer would have to ascertain whether
the ommitted test is necessary. A dogmatic tester might just test for every case,
but that could come at the risk of explicitly testing cases that couldn't occur
in the context of the broader system. For instance, perhaps the rationalization
for omitting a test was "such a combination of variables would be rejected as
invalid produciton." If that were the case, a comment to that effect could spare
a future maintainer the grief of learning this after writing a localized test to
that effect.

### 2. Slow, overly-integrated tests

The only time testing experts typically recommend skimping on covering negative
cases is when the tests are expensive to write or expensive to run. When are
tests expensive to write and run? Why, when they're very integrated, of course!

If I'm reading tests in a codebase and seeing a theme of Quixotic,
happy-path-only testing, my first step will be to see how long it takes to run
an empty test in isolation within the suite. If it's slow, then it's likely that
cases are being ommitted because the time investment needed to cover every case
might have been higher than the benefit it would have provided.

#### Deodorizer

While focusing on happy-path testing through the system for integrated tests does
make sense, it shouldn't come at the expense of solid test coverage of each of
the system's component parts.

One approach—if the application lacks one—is to start a fresh test suite that
loads and tests each unit under test in isolation of the broader application.
From there, attempt to increase coverage via more isolated tests that can be
spared the complexity and performance costs associated with integration tests.

### 3. Poorly understood legacy code

The hallmark of legacy code is code that we don't understand well enough to
change with confidence. This often implies poor tests as much as it does poor
(or forgotten) design. However, when attempting to improve the cases that
a test covers, understanding the behavior of the subject is paramount.

This leads to an impasse, because writing additional tests requires tremendous
amounts of analysis to gain the requisite understanding of the code's behavior.

#### Deodorizer

Because most attempts to increase test coverage of legacy code are (or should be)
driven by a need to make changes to it, the kind of tests being written are
often best suited as so-called characterization tests. That is, tests that
exercise the legacy code as-is with whatever range of inputs and state one can,
and then assert whatever the result is.

Even still, characterization testing can be very time-consuming. One tool we've
written to help with this is called
[suture](https://github.com/testdouble/suture), a Ruby gem. We're currently
evaluating a port for JavaScript, as well.

## About this Example

### Description

This example defines a function that determines a score with which to weight how
prominently a particular hotel review should be shown on a travel site. It's
been complicated by a handful of specific conditions that have accreted over
time, often without an explicit test.

In particular, note that each case involving reviews that contain "obsceneties"
has gone untested, perhaps because of the additional setup that would be required
on the user object.

### Challenge

Add tests for the uncovered logic up to the point that each condition is
sufficiently covered, but only to the extent that each test is necessary. A
good exercise for verifying this is to—once you've finished writing your
tests—attempt to delete part of a line or boolean condition and verify that the
tests fail.

If you manage to update the test to fully-specify the method's behavior, then
take care to refactor the test to maximize readability (otherwise, it's likely
to get quite redundant and long)

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

