# Test Smell: Mockers Without Borders

## Odor Emitted

Tests demonstrate little rhyme or reason for whether a given test ought to fake
a particular dependency or call through to the real thing.

## Known Causes

### 1. Lack of planning

Sadly, the popularity of mocking frameworks as convenient testing tools has
dramatically outpaced general understanding of their purpose. As a result, most
teams lack a set of clear and consistent heuristics for when and how to use test
doubles in their tests.

When methods are mocked out arbitrarily, or only once things become painful, it
creates tremendous pain for future maintainers of the test, who are liable to
ask:

1. What was the intended value of this test?
2. Is the test's arbitrary use of test doubles undercutting that value?
3. If this test fails due to a change, how will we tell whether that constitutes
a true or false negative?

In addition to arbitrarily choosing whether to stub method responses, a test
author might choose to verify that a particular call was made, even in cases
where the subject's return value could be asserted instead. The flexibility of
test double libraries can, in the absence of planning, result in tests that tie
themselves into knots—it's not uncommon to see mocks that return mocks, stubs
that are redundantly verified, etc.

#### Deodorizer

The best disinfectant for arbitrary test double abuse is to formulate a
plan—literally any plan—governing their use in a codebase. Even if the team
lands on a suboptimal approach, having a consistent rule to point to can
safeguard the team against the accumulation of inconsistent, confused tests.

### 2. Poor planning

Sadly, even for teams with established opinions about when and how to use test
doubles, most common rules of thumb aren't very well-considered, and can lead to
pain down the road. Here are a few popular test double plans we see teams adopt
that each carry significant downsides:

* Teams that decide "only mock things that do I/O" - this is actually a really
  good strategy when it amounts to taking control of the data interfaces (e.g.
  databases, HTTP APIs, etc.) with tools like in-memory databases,
  artificial API servers, and the like. However, when the team decides to mock
  objects and methods using a mocking library, then the line between "what
  counts as I/O" typically becomes blurry and subjective. It can be easy to
  misplace the goalpost, raising questions like, "do we fake the database
  adapter or the query objects that interface with it?" In general, taking
  control of test data with a controlled data source is a more durable strategy
  than faking internal objects and methods that supply or transmit data on
  behalf of your domain logic

* Teams that decide to "only mock unimplemented pieces" - their tests will start
  to suffer bitrot as soon as those mocked units are actually implemented.
  From the perspective of a future reader (where everything is implemented),
  the presence of any mocks at all will look erroneous. It would feel as if the
  prior maintainer had punted to them the laborious chore of backfilling real
  instances for fake ones.

* Teams that decide to "only mock as a last resort" - this isn't much of a rule
  as all, because it's so subjective as to be impossible to apply consistently.
  Moreover, if one is left with no choice but to fake something out in order to
  test a bit of functionality, that's an indictment on the usability of the
  design of the subject code, which should be reworked

#### Deodorizer

Our preferred approach is to only use test doubles in codebases where we've
decided to invest in an outside-in test-driven development workflow, like
[Discovery
Testing](https://github.com/testdouble/contributing-tests/wiki/Discovery-Testing).

When practicing outside-in TDD, we decide early on if the subject (and its test)
are "collaborators" whose single responsibility is to break down a job by
invoking several dependencies. In that case, the test's focus should be on
aiding the design and verification of that collaboration relationship. When using
test doubles to guide the contracts between the caller and its dependencies, all
those dependencies are replaced with fakes, the test becomes a sounding board
for the nascent contracts, and the unit is "done" when the test passes (despite
the fact that the dependencies beneath it won't exist yet.

Workflows like this one don't tell you whether the system beneath the subject
"works", but rather that it _should_ work if the subordinate parts are
correctly implemented to fulfill contract specified by the subject.

For more commentary on when we recommend using test doubles, check out this
chapter of the
[testdouble.js](https://github.com/testdouble/testdouble.js/blob/master/docs/2-howto-purpose.md#purpose)
docs.

## About this Example

### Description

This example's subject method is pretty straightforward in that it depends on
four other functions to do its work: one to fetch transactions, a couple more to
convert those transactions to purchase orders, and one to submit those purchase
orders.

What's less straightforward is what its test chooses to keep real and to keep
fake. The task of fetching transactions is faked, but the responsibility of
grouping those transactions is still real. Likewise, the function to convert
transactions into purchase orders is called through to, but the `submit` method
is faked out. The test's sole assertion is that `submit` is called with those
purchase orders.

### Challenge

This test's intent is a little unclear due to the inconsistency in what was left
real and what was faked.

Does the author intend us to implement `fetch` and `submit` and then remove the
test doubles from the calling test? If so, why bother with the test in this
intermediate state?

The inconsistency also might leave you uneasy with the verification of the call
to `submit`—is it really the case that the author is specifying that `submit`
should be a void function with no measurable return value, or were they trying
to get to a passing test, and verifying the method was invoked was the simplest
way?

Your challenge in this example is to make this test's use of test doubles by
whatever means you think is most appropriate, even if it means removing them
entirely.

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
