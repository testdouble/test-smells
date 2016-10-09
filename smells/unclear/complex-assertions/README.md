# Test Smell: Complex Assertions

## Odor Emitted

The assertions in a test require many lines of code to implement.

At first blush, since test-scoped logic is typically itself untested, this can
be risky. Additionally, multi-line assertions are typically harder to
read—both in terms of what they're doing and what they intend to say about
the subject's behavior.

## Known Causes

### 1. Partial Assertions

Sometimes, our subject only operates on a subset of the inputs it receives &
output it returns. To illustrate, imagine a large configuration object passed
into a method, where the subject's responsibility is to tack on additional
properties (without concern for the rest). In cases like this, it may seem
reasonable to only assert the value of a subset of the properties of the object
returned by the subject.

This can cause real issues in two ways, discussed below:

First, whenever the assertion is of a return value is incomplete, it's possible
that the un-asserted aspect of that value doesn't actually comport with our
assumptions, as seen below:

```js
function addAge(hugeConfig, age) {
  hugeConfig.age = age
  return hugeConfig
}
```

An assertion of the above that only checked the `age` property of the return
value would seem pretty reasonable. But what if the subject was changed to
mistakenly return `{age: age}`? Such a test wouldn't catch that issue.

Second, when asserting a subset of an object, custom or one-off comparison logic
is usually necessary (as shown in this repo's example for this smell). That
logic may be as simple as cherry-picking the properties one does want to assert
and then performing equality assertions against them. This can lead to
incidentally lengthy tests, in which asserting a single user-relevant fact (i.e.
that a property is set to the correct value) takes two or three lines of code.

#### Deodorizer

The advice we'd give for both cases is the same, and comes in two stages:

First, if at all possible, assert the entire object—ideally, by limiting the
scope of the larger object being operated on. In the example above, passing an
actual `hugeObject` with dozens of properties isn't adding any value to the test
(in fact, it's more likely to [throw future readers off the
trail](https://github.com/contributing-tests/wiki/Meaningless-Test-Data).
Instead, consider passing in `addAge({otherStuff: 'pants'}, 17)` and then
asserting that the combined object equals `{otherStuff: 'pants', age: 17}`, so
that the test is unambiguous, complete, and as terse as possible.

Second, if it's not practical to assert the entire value (suppose it's of a type
that's incidentally complex and out of your control), consider leveraging
(whether by an assertion library or one's own test helper) a custom assertion
that can express that the actual value "includes" a tree of expected values
(e.g. `assert(expected).contains({fridge: {freezer: ['ice', 'cookies']}})`).
That way, the assertion can at least be terse enough to fit one line, and the
reader isn't left to wonder as to the author's intention.

### 2. The code is doing too much

The subject may be doing a lot, typically by returning a value but also having
one to several intended side effects. The subject in such a case is very likely
in violation of [Command-query
separation](https://en.wikipedia.org/wiki/Command–query_separation), and the
complexity of the test's assertions is providing us feedback of that design
smell in our subject code.

#### Deodorizer

The best answer here is to understand whether (and if so, why) the subject
violates command-query separation and how to split up its responsibilities. Most
often, we will push each of the responsibilities down into new, more focused
units of functionality, leaving the subject with the single remaining
responsibility of coordinating the invocation of those newly-minted units.

In cases where CQS is not being violated, or such a refactor doesn't present
itself as an option, some steps may be taken to make the test more clear. For
instance, if a single test method contains a long block of assertions at the
end, the test may prove more readable if the assertions were split into separate
tests (in a BDD-style testing library, perhaps as separate `it` blocks).

## About this Example

### Description

This example is given a complex object and the subject then attempts to
increment the age of all the people in a deeply nested object representing a
family tree (perhaps for a simulation in which years pass). The issue with this
test's assertions is that they're manually plucking out primitives to assert
instead of relying on a more rugged utility to compare either deep
property-equality or partial inclusion.

There's also the added wrinkle that the arrays involved are shuffled by the
subject.

### Challenge

Based on the known causes for this smell described above, what cause do you
think this example is presenting?

If you feel the subject is doing too much, perhaps you could try to split the
responsibilities up into smaller functions, which would in turn yield simpler
assertions.

If you feel the subject is sufficiently straightforward, then perhaps you could
write a custom assertion method to get each assertion down to one line.

## Language-specific Notes

### Ruby

The biggest offenders of this test smell in Ruby tend to be configuration
objects, multi-stage data transformations, and API wrappers that use Hashie. In
each case, storing data values in custom types can often make the "shape" of the
data more obvious and its assertions more straightforward than it would be as a
series of nested hashes and arrays.

### JavaScript

This is a problem that especially plagues JavaScript programs that implement a
design meme like "middleware" or multi-stage event/action handlers. In both
cases, user functions tend to receive a mutable object that each handler
function is free to read and modify and is more-or-less global for the lifecycle
of the activity (e.g. an HTTP request or a UI event).

Considering this test smell is an opportunity to also consider ways of
implementing these types of functions in a more narrowly-focused, pure way.

## Additional Resources
