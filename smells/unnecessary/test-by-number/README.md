# Test Smell: Test By Number

## Odor Emitted

Production code is tested consistently by rote, inadvertently suppressing
creativity in the design of both the tests and their subjects.

## Known Causes

### 1. Framework Adherence

I often joke that frameworks & test-driven development seek to solve the same
problem: encouraging understandable design & structure. The difference being
that TDD provides a workflow for arriving at custom designs, whereas frameworks
provide tools encouraging pre-fabritcated, consistent designs.

Usually, when using a framework, you're handed 5 to 10 classifications of units,
and often helpers, advice, or social mores about how each of those
classifications ought to be tested. The risk run by going down this path is that
once an application becomes sufficiently unique and complex, the relevance of
those buckets will also fade. It may be the case at the beginning of a project
that insisting every bit of code start its life in, say, a framework-blessed
"router" or "controller" or "action" is a huge boon to productivity. However, it
may eventually become the case that the same preconception can lead to major
blind spots that prevent teams from seeing opportunities to simplify their
applications and create gaps in their test strategy.

A simple example might be [Express.js route
handlers](https://expressjs.com/en/4x/api.html#router): I've seen several teams
successfully define all of their express route handlers as a chain of
promise-returning methods. They continued to specify a custom route handler
module by rote ("it's what you do!") and continued writing isolated tests of
each of those handlers at tremendous expense, even though the pattern they'd
enforced could have enabled to define all their routes as a data structure
(namely, an array of these promise-returning functions) and obviated the need
for dozens and dozens of tests in the process.

#### Deodorizer

The best way to build an allergy to Test By Number is to look at your
application's tests of non-pure functions with greater scrutiny. Often, it's the
case that we can manage 100% code coverage of impure functions—even ensuring
tests demand into existence all the behavior they contain—but still fail to
cover real-world edge cases based on the broader state of the system and how
those features might interact in practice.

Once you've picked out such a function, try creatively [exploratory
testing](https://en.wikipedia.org/wiki/Exploratory_testing) to look for
situations the sort of narrow focus described above may have missed. (Domains
that are really susceptible to this include role authorization, deletion of
entities with associations to other entities, and navigation). When these sorts
of edge cases are able to be identified, you have a few options to remediate the
risk of Test By Number:

1. Budget time each week for regular exploratory testing, acknowledging
   that automation is great for covering predictable cases but too costly for
   covering edge cases

2. Eliminate semi-integrated tests (e.g. router or controller tests) in favor of
   more fully-integrated tests that can better cover the interaction between
   your features

3. Run similarity analyses against your code to hunt for patterns that are
   followed to rigidly (in your tests or your subject code). Perhaps something
   you're doing by rote can be accomplished in a more dynamic fashion

## About this Example

### Description

If you look at this example, it may seem like a fine test example, but
when you imagine it in the context of a broader application, it raises several
concerns:

* All of the tests depend on the existence of persisted User models, meaning
  there is a risk that (a) changes to User would break this test, making it
  brittle; and (b) this test's construction of User models might be
  unrealistic when compared to how User models look in production

* A test strategy like this one can lead to 100% test coverage, but because
  of how strictly cordoned-off and siloed they are, they fail to test the
  interaction of features. For instance, what happens if a User model is
  deleted? Does the deletion cascade to their address? Unless we break out of
  the mold to think of this, that very common case won't be tested (but the
  relatively uncommon case of a user deleting only their address will have
  been)

* Most applications feature a common striation of layers, either by way of
  a framework's prescription or our team's convention, and both can tempt us
  to test each instance of each layer by rote, even though it's quite possible
  this will lead to costly Redundant Coverage (see:
  [7 Layer Testing](../7-layer-testing))

* In some cases, this mandate of "write a test for every X type object"
  actually distracts from the imperative to build abstractions that eliminate
  redundancy. If your test of some unit could conceivably be
  generated automatically, then the unit's behavior can probably be implemented
  dynamically.

### Challenge

Consider each of the concerns enumerated above and choose one to focus on as you
go about implementing a test for a `UserController` to sit alongside the
`AddressController`.

Loaded with all of this narrative in mind, some of the redundancy may become
immediately apparent, but that doesn't necessarily mean it's wrong—after all,
two basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
controllers ought to look pretty similar. Instead, consider the feature
interaction element. When you implement a `UserController#read` action, would
you know to check its addresses are fetched, too? When writing
`UserController#destroy`, would you have otherwise thought to delete its
associated addresses?

It's particuarly interesting as an exercise, because going from subordinate
model (`Address`) to its owner model (`User`) primes us to think about
`Address`-related edge cases. But in practice, we normally develop CRUD
resources in the opposite order, and without regard for the implications of the
models that came before us. This should give us pause about common framework
designs like this.

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources
