# Test Smell: Bury The Lede

## Odor Emitted

A test's setup is so onerous that the reader forgets the purpose of the subject
by the time they reach the relevant invocation and assertion of the subject.

## Known Causes

### 1. Tangling logic with complex data

This happens most frequently when a function that performs a bit of logic depends
on complex model types, each required to be persisted in a data store and/or to
be heavily validated.

#### Deodorizer

Whenever possible, create boundaries in your application that allow you to
separate concerns like persistence and validation from the logic that depends on
the types of values defined by your system. (This is easier said than done,
especially when using a framework that favors mixing these concerns.) Once
separated, writing separate tests of the models and the logic that depends on
them will come more easily.

Assuming you can't rearchitect your system to make this sort of separation
possible, consider extracting the logic into first-class units that can consume
values that are merely shaped like or quack like actual models from your tests.
You might lose incidental coverage of things like model validation, but odds are
that'll be assured in dozens of other places.

### 2. Testing the middle of the Pyramid

It's possible that the test is highly-integrated, but written against a
middle-layer of the application (e.g. an HTTP controller or a repository object),
indicating that the needs of the test are too narrow to exploit more broad-based
data fixtures, but too broad to be able to leverage simplified data values.

Put a different way, it's very likely that this test resides somewhere in the
middle of the [Test
Pyramid](https://github.com/testdouble/contributing-tests/wiki/Testing-Pyramid).
Too integrated to write a simple unit test of anything approaching a pure
function, but too isolated-from-production to leverage the conveniences
available to us operationally when it comes to managing our data and other
application state. This is a veritable no man's land where tests suites have to
fend for themselves. (One point of interest: the vast majority of test tooling
also occupies the middle of the test pyramid, as if by necessity, because tools
to merely kinda-sorta set up an application wouldn't otherwise have had much
reason to exist.)

#### Deodorizer

Integrated tests that don't exercise the project in the same way a user does
(e.g. a browser test for a web app, an HTTP test of an HTTP API, a shell-out
for a CLI) are almost certainly doomed to encounter this problem, and the best
advice we can offer is to carefully scrutinize the value these tests provide
and default to minimizing or eliminating them. If they must exist, consider
building out a common set of (carefully groomed!) fixtures that can spare each
individual test of one-off setup distraction.

## About this Example

### Description

This is one of the more complex examples in the project. The subject's
responsibility is two-fold: query for an address from a credit card ID via its
shared relationship with the user model, and then make sure its ZIP code
matches the cardholder's manual input. The problem is that each of the three
models have validation requirements that can't be simplified without faking
them entirely.

### Challenge

Your challenge is to add a test for the negative case: that the subject will
return `false` when the looked-up ZIP code does not match the input.

Of course, the real challenge will be to figure out what to do about all that
test setup. One might imagine that the original test started as a simple three
lines, but the setup grew out of cruel necessity to get the requisite values to
validate such that the (not-being-tested-here) repository would accept them.

You might try to suppress the pain by extracting the model setup (at the risk
of sweeping the root cause under the rug), or stub the repo's `find` method for
all the various inputs it will receive (at the risk of creating a Fantasy
Test), or you might separate the subject in two: one function that queries
across relationships, and another that does the equality check (which seems
preferable).

## Language-specific Notes

### Ruby

It's likely that Ruby on Rails developers know this pain more intimately than
most others, because of how common it is to see ActiveRecord models loaded
chock full of application logic.

### JavaScript

## Additional Resources

