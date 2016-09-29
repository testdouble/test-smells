# Test Smell: Missing Assertions

## Odor Emitted

The subject includes behavior which is not asserted by the test, whether
implicitly or explicitly.

## Known Causes

### 1. The subject has too many jobs

It's easy to justify the time it takes to write a test for the most important
thing a piece of code does, but it's harder to rationalize the time investment
of explicitly testing less critical aspects.

In cases like this, the subject is probably violating the [Single Responsibility
Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
More concretely, when a single unit is saddled with multiple concerns, it often
negatively impacts its tests. Because the secondary and tertiary behavior isn't
the subject's focus, it may never seem worthwhile to invest the time to test
that additional behavior. However, if that behavior were extracted into its own
first-class unit, then the absence of a test listing would be conspicuous, and
we'd probably decide it deserves a test. Additionally, unless that secondary
behavior includes logical branches (e.g. `if`/`else`), the lack of assertions
won't show up in a code coverage report.

Put another way, violating SRP subtly incentivizes us to insufficiently test
our code, which is sadly ironic, since those units are the ones that typically
need the most robust testing.

#### Deodorizer

Extract the additional behavior from the subject into its own first class unit,
and have the subject depend on it. This has a couple interesting ramifications:

* If the subject would then contain a mix of its own logic and delegation, it may be
cleaner for a new [collaborator](https://github.com/testdouble/contributing-tests/wiki/Collaborator-Object)
object whose "single responsibility" would be to call each subordinate unit
needed to accomplish the task at hand
* If the behavior is a so-called [cross-cutting
concern](https://en.wikipedia.org/wiki/Cross-cutting_concern) (e.g. logging,
authorization), then it may be possible to extract the behavior into an
intelligent component that does not depend on each unit to  explicitly invoke it

### 2. A sufficient assertion would be difficult

Sometimes, it's really hard to fully assert everything our code is doing, so we
settle for only asserting some subset of its behavior. Maybe the subject builds
a very large response object with some properties that would be hard to control
with a test (e.g. times)

#### Deodorizer

As always with hard-to-test code, you have two options:

1. Make the code easier to test
2. Make the test easier to write

If Option #1 can be accomplished in a way that increases its own readability,
then that is generally preferable, but if making the subject more testable comes
at the cost of additional indirection or abstraction (with no other benefit), it
would be fair to others to criticize that the code's quality is being sacrificed
for the sake of testing.

In this case, Option #2 is often necessary. Perhaps a tool like
[timecop](https://github.com/travisjeffery/timecop) could increase the test's
control of the subject's environment. Or maybe a more intelligent assertion that
allowed for deeply-nested comparisons to have one-off comparators for specific
properties, like this one might:

```js
assert.fancyEqual(result, {
  name: 'Jill',
  age: 29,
  createdAt: (actual) => new Date() - actual < 1000
})
```

## About this Example

### Description

This example exhibits a little of both of each root cause described above.

This method's purpose is to fetch an item from a database and is named `fetch`,
so a test that proves it fetches items from the database is obviously necessary.
However, the method also updates the item with a timestamp of when it was
retrieved, but no test exists to cover that behavior. A fetch function that
mutates the retrieved item is a clear SRP, too.

Meanwhile, testing that the timestamp is exactly correct would not be possible
without controlling the runtime's clock, which is difficult without third-party
tools (and yet risky with them).

### Challenge

You have at least a couple options before you:

1. Separate the concerns so that the `fetch` method is no longer living a
double-life; you might end up with two units, or even three (in the case that you
choose to introduce a collaborator for the two of them
2. Add an additional test or an assertion to the existing test—your choice—which
makes sure the additional behavior is covered

## Language-specific Notes

### Ruby

As mentioned previously, [timecop](https://github.com/travisjeffery/timecop) is
a mature and useful tool available to Rubyists, but be mindful of its
limitations—particularly when the subject will be connecting to other processes
(timecop does not change the system time) or other machines (as it certainly
cannot affect those).

Additionally, timecop's travel methods are generally safer than its time-freezing
capabilities, as some Ruby libraries will have a good excuse to fail in bizarre
ways when the time never changes.

### JavaScript

While there is a [timecop.js](https://github.com/jamesarosen/Timecop.js) library,
it is not well-maintained. If you're writing for Node.js, you might consider
[timekeeper](https://github.com/vesln/timekeeper). Finally, feel free to treat
time APIs as you would any third-party API, by wrapping it in an adapter that you
own and then mocking that so you can control it. (More on this here:
[Don't Mock What You Don't Own](https://github.com/testdouble/contributing-tests/wiki/Don't-mock-what-you-don't-own)

## Additional Resources

