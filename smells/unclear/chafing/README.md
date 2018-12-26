# Test Smell: Chafing

## Odor Emitted

A test in which the author attempts to eliminate as much textual
duplication as possible, even if the indirection it introduces confuses
future readers of the intention and behavior of the test.

## Known Causes

### 1. DRY Dogma

Seeing duplication makes most developers uncomfortable, in part because DRY
("Don't repeat yourself") has become a ubiquitous guiding principle of design.
So when a developer sees duplication in a test, their kneejerk reaction may be
to DRY it up by extracting out test helpers.

#### Deodorizer

Because it can be a slog just to get tests working, it's easy to forget that
test frameworks don't exist to make it _possible_ to exercise your code and
observe its behavior. The vast majority of work that goes into designing a test
framework goes into enabling developers to express their intentions to future
readers through assertion message and predictably consistent APIs.

A certain amount of textual duplication may be necessary in order for tests
to tell a complete and coherent story of how they use the subject. If the
repetition distracts from that story, first ask if the design of the subject
could be reworked to mitigate it. Next, ask if the test would be more or less
clear if the duplicated test setup or assertion logic was extracted. If the
duplication is making the story less clear, inline the abstraction so that the
test can stand on its own to explain how it exercises the subject, even if it's
an ugly story to tell.

### 2. Test Support via Indirection

When more than a handful of tests all have to do the same difficult thing, we
tend to extract that pain into some kind of supportive tool: maybe something to
perform data setup/teardown, or a custom assertion to handle a common case.
These are often great tools to have, but they all come at the cost of
indirection. Developers will need to open a third file listing (in addition to
the test and its subject) in order to get a full picture of the test.

In particular, many test suites maintain external data fixtures and factories
for conveniently creating a standard set of models when integration testing.
This approach often solves the immediate pain of tests with too much setup, but
can quickly become dumping grounds — as more tests rely on them, more complexity
is added. Moreover, the contract between the test and the subject becomes
obscured; no one can ever simplify these abstractions without breaking a bunch
of tests in a hard-to-understand way.

#### Deodorizer

Before embracing any test-scoped abstraction that will be shared across tests,
make sure that the root cause isn't a fixable issue in the subject's design
and weigh the benefits against the risks that those tests' story will be
dilluted.


## About this Example

### Description

The test-scoped abstractions in the example test (both the code "generation"
methods and the custom code pricing assertion method) obscure the story the test
could be telling about what the pricing method does. Surely, at the time of its
writing, whoever "DRYed up" the code generation into a fixture and the
expectation into a custom assertion method was able to keep all of this in their
head. However, as time goes on, expecting future maintainers of a test to
juggle any more than two file listings at a time is unrealistic. Just as a
business contract becomes orders of magnitude more complex when there are more
than two parties at the table, so does the contract between a test and its
subject become unclear when some behavior is encoded in a third (much less
fourth) file listing. Sometimes, that trade-off is worth it, but certainly not
in this case.

Moreover, the typical roles we'd expect of tests and code are reversed! Note
that the assertion contains the more important calculation whereas the subject
pricing method unintelligently keys off discrete data via branching to arrive at
a result. Normally, you'd expect the exact opposite! Perhaps aggressive
extraction made that oddity less clear to one of the test's authors. Maybe after
inlining these test abstractions, we'll see an opportunity to improve the design
of the subject.

### Challenge

Your challenge in this example: first, inline the earnest test-scoped
abstractions. Next, consider the assertion logic that generates the code, and
consider reversing the relationship: granting that behavior to the subject and
testing it with the examples currently embedded in the production code. Perhaps
additional test examples will be necessarily to fully cover this behavior, or
perhaps once you've reversed the two, it will be possible to pare it down
while still satisfying the previously existing examples.

Which approach makes sense here? Which makes more sense generally? Can you think
of a time you were burned by indirection in a test helper?

## Language-specific Notes

### Ruby

Ruby's testing tools tend to be of the clever sort that make this kind of
test-scoped indirection very attractive-seeming. VCR has us saving fixtures from
HTTP responses, which sometimes obscure the intention of the test. Rails has us
crafting database fixtures that are typically not explained within each and
every test. Database factory gems like factory_girl and machinist, meanwhile,
have led some teams to amass large regimes of nuanced, brittle model setup code.

If this is a lesson you've already learned well, it's somewhat likely you've got
experience on Ruby on Rails projects.

### JavaScript

Front-end JavaScript apps sometimes suffer this problem in the form of HTML
fixtures, which are saved based on some known application state and slowly get
tweaked and added-to until it's impossible to understand how a test works until
you've analyzed the (possibly large and reused) HTML fixture, too.

## Additional Resources

