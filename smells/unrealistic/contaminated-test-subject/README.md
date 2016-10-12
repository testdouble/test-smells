# Test Smell: Contaminated Test Subject

## Odor Emitted

A test somehow morphs its subject into something less realistic for its own
purposes and without regard for the resulting erosion in our confidence that the
test ensures the subject's behavior under real-world conditions.

## Known Causes

### 1. Very large objects

Suppose you have a very large, stateful object that has 15 different instance
variables and 45 methods which could be categorized into 6 mostly-unrelated
clusters of responsibility: initialization, validation, associations,
lifecycle hooks, database queries, and business logic.

In testing just one responsibility of that object, aspects of the other 5
responsibilities may need to be appeased in order to exercise the functionality
you want to test. But what if that appeasement takes 20 lines of repetitive,
slow-to-run set-up code? In such a case, simply stubbing out the offending
methods on the subject might be significantly easier than testing the object
under more realistic conditions.

It's via this sort of rationale that we often find tests of large objects that
turn their subject into swiss cheese—faking so many aspects of the object that
no one can be sure if the tests have any meaningful regression value at all.

#### Deodorizer

The simple-but-hard answer is: stop writing really large stateful objects. By
splitting up an object into more focused responsibilities, one will lessen the
impulse to fake parts of it as if to beat it into submission.

Some easier-and-incremental approaches:

* If the driver for this smell is redundant test setup, consider writing
  separate tests tailored for each of the responsibilities of the subject; that
  way, whatever setup is needed can at least be shared among them. Moreover,
  this may chart where the fault lines between those responsibilities lie and
  help you plot a course for splitting the object up later

* If the object is beyond saving, stem the bleeding by refusing to make any more
  additions to it. Instead, implement additional functionality in separate, new
  units of code which receive the large object as a parameter and work around
  it. That way, you may be able to continue being productive in the system
  without exacerbating the problems posed by the large object

### 2. Insufficient appreciation for functional purity

Neither our communicated discourse nor most of our programming languages have a
good way of broadcasting whether a function is
[pure](https://en.wikipedia.org/wiki/Pure_function) or not. Is a particular
function free of references to state outside it? Does the function mutate state
in addition to whatever value it returns?

The answers to these questions determines whether it's "safe" to fake anything
about the arguments passed to the function or the broader system state.
Moreover, impure functions are more likely than pure ones to encourage us to
fake stuff out (i.e. they _do_ depend on broader state that's hard to set up).

These are often devilishly hard to answer questions even upon detailed analysis
of code, and as a result, teams that lack a conventional way to promote pure
functions or (at the very least) communicate which functions are pure and which
are not, are most at risk of running afoul of Contaminated Test Subject.

#### Deodorizer

The best way to start is to begin discerning which functions your team tends to
write that are pure, which are impure, and what patterns might underpin each
circumstance. Next, consider others' heuristic approaches for how to sequester
pure functions apart from impure ones. Gary Bernhardt's
[Boundaries](https://www.destroyallsoftware.com/talks/boundaries) talk is a
great start. For a longer burn about using outside-in TDD, to arrive at clearer
functional patterns, consider this [screencast series on Discovery
Testing](http://blog.testdouble.com/posts/2015-09-10-how-i-use-test-doubles.html).

## About this Example

### Description

This example is short-and-sweet, so the fact the subject is being contaminated
by the test may appear a bit contrived (though you'd be surprised how quickly
this anti-pattern can be habituated on teams). If I were to stumble upon this
test, I'd assume that the author started faking subject methods because time was
involved (and as operating system state, time is obviously hard to control for).

The subject determines whether a `SavingsBond` has matured or not (to the point
of being worth its stated value) and, if not, returns the prorated premature
value of the bond.

The first test validates behavior of a matured bond, but instead of controlling
for time some other way, it pokes a hole in the subject's `mature?` method. The
second test overrides the same method as well as the subject's internal value of
the current day (to get control over the prorated value).

### Challenge

Rework the test and subject to obviate the desire to mutate the subject from
the test. Several approaches stand out:

1. Using a tool like [timecop](https://github.com/travisjeffery/timecop) or
   [timekeeper](https://github.com/vesln/timekeeper) to control for time more
   broadly

2. Loosen the test's grip on time by writing the test's expectations relative to
   the current system time, as opposed to a fixed moment

3. Recognize time as a sort of third party dependency and write a little custom
   adapter function that returns the current time and call that from your
   subject instead. Then, in the test, fake that current-time-returning
   dependency instead of the subject itself

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

