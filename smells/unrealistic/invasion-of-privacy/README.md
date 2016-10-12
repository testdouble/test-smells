# Test Smell: Invasion Of Privacy

## Odor Emitted

A test is written directly against a method that's intended to be a private
implementation detail of the subject.

## Known Causes

### 1. TATFT gone wrong

Lots of developers subscribe to some variety of
[TATFT](https://www.youtube.com/watch?v=LfmAzLAKKoc) inclination, which can—when
taken to the extreme—sometimes result in difficult-to-maintain tests. The
rationale goes: "there's a method called `do_private_stuff` and there's no test
method for it. It may have coverage through its caller, `do_public_stuff`, but
it really should have its own test."

It's important to remember that tests don't exist for their own sake. Tests exist
to give us sufficient confidence in the design and the behavior of our systems
that they can serve the purpose for which they're intended.

As such, adding a test for the sake of its own existence will lead to a
(potentially quite symmetrical and tidy-looking) rat's nest of hard-to-refactor
complexity. Each test suite should be designed to provide specific design &
regression value to a system's development, and include norms about when to
create (or skip) a new test. It's hard to imagine thoughtfully designing a test
suite that would call for testing private methods.

#### Deodorizer

This one's pretty easy: test through the public API instead. If it's really hard
to exercise everything in the private method through a test of the public API,
consider spinning it out into a first-class unit, but with added scrutiny that
everything inside the previously-private method is actually necessary (more on
that in the next known cause).

### 2. Test-after and unreachable complexity

One virtue of test-first workflows is that they tend to minimize unnecessary
code. If a test can't be written for a particular bit of behavior, then it's
unreachable and certainly must not be necessary! This is true to the extent that
each of our units exist in a vacuum, but the truth of the matter is that most of
our systems only have a handful of entry points and the vast majority of the
code we write will only ever be called from one or two places, internal to a
single application.

As a result, when we lean on tests to tell us whether a bit of code is
necessary, it's important to keep in mind that we risk favoring local optima for
global optima by saddling our units with complexity that looks good up close,
but would not actually be reachable by production.

Suppose you had this method:

```js
function setAttr (obj, attr, val) {
  if (!obj[attr]) return
  if (!val) return
  if (!attr) return
  obj[attr] = val
}
```

And suppose you had full test coverage to match.

But what if the only caller to `setAttr` was a method that already made sure
`attr` and `val` were truthy? In that case, those guard clauses would, from the
perspective of the broader system, be unreachable dead code. As a result, when
someone has the impulse to test a private method because of hard-to-test
behavior, it's too earnest of advice to respond, "oh, just spin it out into a
first-class object and test that," until you've validated that the code is in
fact necessary.

#### Deodorizer

This fact doesn't earn a lot of commentary, but adding unit tests after-the-fact
actually runs the risk of solidifying a team's commitment to potentially
unnecessary code. If a bit of behavior isn't necessary, but there's a test
for it, then a team is going to be even more reticent to challenge and delete
it ("surely whoever tested it knew why we needed it!").

When testing code that's already been written, the most reliable way to
determinine which tests cases are necessary is to first observe and verify their
behavior by exploratory testing the full system. If something is observed that
needs a test, you can be sure it's really necessary.

## About this Example

### Description

In the example below, the test of the private function drove out two
if-statements that are simultaneously unreachable in production (e.g. dead
code) that nevertheless have 100% code coverage (e.g. no one will ever feel safe
deleting them). See [Paranoid](../../unnecessary/paranoid).

Remember, privacy is not about what's technically reachable, it's merely a
communication method that enables authors to convey the intention of a bit of
behavior as an implementation detail, so that outside components (be they tests
or other objects) don't come to depend on it directly.

### Challenge

This challenge is two-fold:

1. Update each test to invoke the public API instead of the private method
2. Remove any unreachable complexity from the private method you can't reach via
   the public method

## Language-specific Notes

### Ruby

### JavaScript

Because it's hard to demonstrate changing the visibility of, say, an anonymous
function to one that's exported in a single file example, the following example
uses a `__` prefix to denote variables intended to be private from users of the
object.

## Additional Resources
