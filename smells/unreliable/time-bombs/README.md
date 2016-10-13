# Test Smell: Time Bombs

## Odor Emitted

Tests that fail due to ever-so-slightly different time values, during certain
days of the week or month, or when a long-running time-sensitive test
straddles two hours, days, weeks, months, or years and the code can't handle it.

## Known Causes

### 1. Time comparisons

In most runtimes, the internal representation of time is more detailed than what
is printed when you format the time as a string. As a result, it's not uncommon
for two times that look equivalent to actually differ slightly. If your tests
are very fast, this may not present itself as a real issue at the time the test
is authored (on, say, a fast development machine). However, these minor
oversights tend to first present themselves when running on slower hardware in
continuous integration, where it's harder to debug and reproduce an erratic test
whose failure partly depends on the speed of the system.

Additionally, as a system gets larger, existing tests tend to get slower. It's
not uncommon for years-old tests to start breaking only once the overall suite
(or its setup) has crossed a certain threshold.

#### Deodorizer

Audit all your time comparisons, particularly assertions, to make sure that
you're either comparing objects by reference or asserting that two times are
within a known and acceptable delta of one another (say, a millisecond).

### 2. Time zones

It's not uncommon for new projects to be started by a team that's all located
within a single time zone. If the application domain or test data is at all tied
to a certain time zone, it's possible that new team members (or CI servers)
operating in a different time zone may not be able to run the tests. In the
past, I've joined client teams where the first week or two of my time was lost
to legacy test cleanup just so I could run the tests locally from US eastern
time.

#### Deodorizer

If the business only exists in a particular time zone, you could consider fixing
to it. Otherwise, try to be conscientious about the time of the operating
system, the language runtime configuration, the data stores you use, and the
locale of the user agent in your test. It's a lot to keep track of, but if you
don't know what time zone everything is set to, it can result in very
hard-to-debug failures.

### 3. Business time

Sometimes, business applications intentionally behave differently on certain
days of the week or times of day. Tests that are going to cover both branches
need to cover this difference, and only testing one path that covers the 9-to-5
Monday-to-Friday branch is probably both insufficient and liable to fail often.

#### Deodorizer

Usually, it's necessary to simply control the system time in cases like this.
Like always, a more isolated unit test will be easier to control than testing
this sort of functionality through a more fully-integrated stack where time
would need to be controlled in more places to avoid confusing mismatches.

## About this Example

### Description

Because of poor date management, the example test will fail erratically in
two ways:

* The first test will fail when the system time increments the millisecond
  between the `beforeEach` and the end of the first test (which may be between
  1% and 20% of the time in my experience)

* The second test will fail on Fridays, Saturdays, and Sundays, as those
  will include a weekend day for which the wages earn time-and-a-half. Take it
  easy and just run your build on Monday through Thursday!

### Challenge

Resolve both erratic failures. Consider the best strategy for dealing with time
when a method is _supposed_ to behave differently at certain times rather than
others (i.e. where setting variables relative to the current time won't do).

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
