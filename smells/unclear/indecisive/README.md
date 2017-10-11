# Test Smell: Indecisive

## Odor Emitted

A test contains branching logic.

Of course, test-scoped logic is always risky, since it is itself untested. But
this smell portends some deeper issues worth discussing.

## Known Causes

### 1. The broader environment determines the correct test behavior

Sometimes, code ought to behave differently in different environments (e.g.
operating system, day of the week, varying values of `RAILS_ENV` or `NODE_ENV`).
Often, these environmental factors are beyond the immediate and easy control of
the test, so a test-scoped `if` statement is introduced to accommodate the
additional possible environmental states. So long as the tests are run in each
environment, sufficient coverage should be attained.

#### Deodorizer

In most cases, rather than introduce branching inside of a test, it's preferable
to write multiple tests—one for each known environmental state—and then to
toggle whether that test runs based on the environmental factor. This can
sometimes take a little research into your testing library of choice and how one
would conditionally skip or exclude tests.

In fact, this repository contains just such an example in this
[UnreliableMinitestPlugin](support/ruby/unreliable_minitest_plugin.rb) module,
which is used to skip certain tests in a CI environment so intentionally-erratic
tests don't break our build. The same sort of mechanism could be extended to any
other environment variable, operating system check, and so on.

### 2. The test lacks sufficient data control

One-off environmental concerns are by no means the only reason some tests
contain branching logic. More common (but often, more excusably) is branching in
tests to deal with one or more states that test data may be in when the test
runs.

Maybe, when writing an integration test, a list of invoices is usually
populated, and so a "New Invoice" button is off in the corner, but sometimes the
list is empty and so a different and more prominent "New Invoice" button is
displayed. In a case like this, it would make sense for the integration test to
navigate the page conditionally—that is, assuming the system's state _must_ be
so indeterminate given the constraints of the test suite.

#### Deodorizer

In short, the best way to minimize a harried mess of if-else logic in tests like
this is to establish firmer control of test data.

It can be appealing to start down the path of writing tests against deployed
systems in such a way as to not have to consider the complexity of database
scripts: the tests don't pay a speed penalty for data setup and teardown per se,
can be run against most running instances, and the system behavior observed is
sure to be more realistic.

However, this type of testing typically breaks down over time. First, the act of
"self-priming" the requisite data the test needs (i.e. testing "edit list item"
might require the automated test to use the system to first create a new user,
then sign in with that user, then create a new list) can become much more
time-consuming at runtime than a simple data dump as more tests are added.
Second, as the system becomes larger, more edge cases will be introduced, and—to
the extent they also increase the system's variability—tests that were once
straightforward will need to be revisited with brittle, poorly-understand
if-else concessions.

Often, "self-priming" tests like this can be converted to tests with stricter
test data control by taking a snapshot of the application's data in a relatively
simple state, then writing the necessary test helpers (whether before or after
each or all of the tests) to restore the application's data, so each test
operates from a known clean state.

## About this Example

### Description

This example exhibits the first root cause described above: due to differences
in how paths are expressed as strings in Windows & Unix, a path should be joined
differently, depending on which operating system the test is run under.

### Challenge

Remove all the `if` statements however you see fit!

Once you've identified your options, consider the impact of each of them. For
instance, perhaps you could simply normalize each actual and expected path using
a trusted method—that would remove the variability, but would it also introduce
a vector by which the tests could pass on both platforms even when the code
wasn't working?

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

