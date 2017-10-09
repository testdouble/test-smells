# Test Smell: 7 Layer Testing

## Odor Emitted

Numerous tests depend on the functionality of a single unit, typically
incidentally. A single change in the code often breaks many tests in the build.
Often exhibits itself when a team finds that even trivial changes to a system
results in exorbitant effort to get back to a green build.

## Known Causes

### 1. Layered Application Architecture & Frameworks

If you're not familiar with the term "layered architecture", consider as an
example the case of a server-side MVC app (e.g. using Rails) with a router which
dispatches requests to a controller, which in turn calls models and/or service
objects, which finally renders an HTML template.

In the service of implementing a typical feature, each layer is implemented with
a bit of custom code. The benefit of a layered architecture is that small,
focused units are preordained as a default starting point (ensuring those units
stay small is an exercise for the reader).

Most teams with robust test suites and high code coverage will create a
symmetrical test for each unit of code in their system. Got a `FooController`?
Then you'll need a `FooControllerTest`. `FooRouter`? `FooRouterTest`. And if
you're not writing a `FooModelTest` of your `FooModel` then you're just not
serious.

Because most developers will provide actual instances of the objects which
represent the layers beneath the subject under test (or, in the case of Rails,
have these auto-loaded on the developer's behalf), this habit can have serious
and lasting consequences on the long-term viability of the application's test
suite(s).

By way of this redundant code coverage, the deeper the layer in which a change to
the system is made, the more tests above it will break. Worse, those tests will
be by their nature more integrated and slower than the lower-order tests. Even
more insidiously, this phenomenon tends not to cause much worry until the test
suite takes long enough that developers fall out of the habit of running it
locally. At that point, we've seen a number of team whose test suites had served
them relatively well hit a sudden inflection point at which a half-day story can
consume several days of test cleanup.

#### Deodorizer

There are no easy solutions to this problem once it's been inflicted on a test
suite. More cavalier-minded developers will encourage the team to start deleting
more integrated tests (perhaps eliminating the middle layers, keeping the
lower-order and the most integrated tests). This would certainly reduce the
build albatross, but it's important to keep in mind that our tests are
hopelessly tangled with the design of our systems: each of those layers probably
contains branching logic, and the fact we had a symmetrical layer for each test
encouraged us to introduce that complexity at every layer of the application.

More complex, but safer options also exist, such as:

1. Analyze the middle-tier tests and see whether there's an opportunity to
   replace the dependency on lower layers with test doubles that sufficiently
   exercise the behavior of _only_ that layer

2. Start keeping track of the number of build failures caused by middle-tier
   tests that indicated actual bugs (i.e. the code would not work in production)
   as opposed to out-of-date tests (i.e. a test depended incidentally on a
   change elsewhere). If a test repeatedly fails, but never actually catch a
   bug, consider bucketing it into a test suite that runs less often than the
   other tests and/or target it for deletion

### 2. Detroit-school TDD & High code-reuse

Teams that practice [Detroit-school
TDD](https://github.com/testdouble/contributing-tests/wiki/Detroit-school-TDD)
are especially at-risk of seeing this test smell in their systems. Because
Detroit-school TDD favors bottom-up design of domain objects, it isn't uncommon
to see so-called "God objects" emerge naturally in the most critical corners of
the application which are reused to tremendous extent. This is compounded by the
objective in Detroit-school TDD to minimize one's reliance on test doubles,
ensuring that any high-reuse code paths will also tend to be massively
redundantly covered by tests.

#### Deodorizer

Teams that practice Detroit-school TDD have found the most success avoiding this
test smell by relaxing their notion that every file listing must have a
symmetrical test. This does have some frustrating implications, not the least of
which being that discovering which test covers which units of code is less
discoverable (forcing teams to lean more heavily on code coverage reports).

## About this Example

### Description

This example of a simple financial aggregation (by transaction, day, month, and
year) represents a custom layered domain model as described in the first root
cause above.

### Challenge

Suppose your product owner approaches you and sheepishly admits that their
requirements were all-wrong. As it turns out, you're not supposed to round
transaction profit at all! Test-drive the change to the method that computes
transaction profit and then deal with the aftermath.

Regarding the narrative above, use your best judgment. Are some of the tests
unnecessary? Would using a test double for the lower layers be appropriate? Is
this, despite the pain of change, yet the "right" way to do things? This may be
an interesting discussion to have on your team.

## Language-specific Notes

### Ruby

Any experienced Ruby on Rails developer should be able to spot this pattern from
a mile away. If there's a single phenomenon that pushed people who were
otherwise very excited about TDD away from rigorous testing, this may have been
it.

### JavaScript

The crippling pain of slow tests yielding unworkable feedback loops for the sake
of one's own productivity is mercifully foreign to most JavaScript developers.
However, as Node.js has become more popular, more and more backend JavaScript
apps have found themselves saddled with highly-integrated slow test suites.
Oddly enough, a lot of the literature on how to deal with slow tests that can be
found in the Ruby community is becoming more and more relevant.

## Additional Resources
