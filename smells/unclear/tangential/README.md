# Test Smell: Tangential

## Odor Emitted

The subject and its test claim to be focused on something, but the bulk of their
complexity is focused on a different (often subordinate) responsibility.

## Known Causes

### 1. Mixed levels of abstraction

Usually, when a test gets derailed, it's because its subject has too. Like so
many design smells, it's easier to detect this in the test ("boy, we're writing
a lot of tests about phone numbers in this general validator object"). Often
what that test smell is indicating is that the subject is operating with mixed
levels of abstraction.

The phrase "to mix levels of abstraction" is often tossed about without
sufficient context. Often, it refers to code that blends operations on primitives
with calls to more complex objects. More generally, it can refer to code for
which some components are very concrete or rudimentary and others are
significantly more abstract and sophisticated.

To use a business analogy, consider how unusual it would be for a mailroom
assistant to be called up to a an executive meeting in the boardroom for their
input. Or how out-of-sorts such an executive might be when asked to sort and
direct inbound mail.

Or, consider this over-simplified example of a validator object:

``` ruby
def validate(thing)
  case thing.type
  when :string
    StringValidator.new(thing).valid?
  when :age
    AgeValidator.new(thing).valid?
  when :gender
    true
  when :phone
    north_american = /^\(?([2-9][0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    japanese = /^0\d{2}-\d{4}-\d{4}$/
    intl_japanese = /^011-81-\d{2}-\d{4}-\d{4}$/
    # 44 more lines of phone-related details
  end
end
```

Clearly, the single responsibility of validate ought to be "figure out the type
of thing we're validating and then quickly hand things off to a validator object
tailored for that type", but for whatever reason when phone numbers were
implemented, it was all done right in place. This is a clear example of mixing
the level of abstraction of each branch; from the perspective of the other
validators, the `:phone` branch is awkwardly deep in the weeds.

#### Deodorizer

On a case-by-case basis, if this is spotted after the fact, the remediation is
straightforward enough: spin the offending code into a new unit, port over the
tangential tests to target that unit, effectively decluttering the subject's
test.

More broadly, if this keeps happening, it may be a sign that the team is
practicing [Detroit-school
TDD](https://github.com/testdouble/contributing-tests/wiki/Detroit-school-TDD)
and isn't refactoring aggressively enough as they iterate. (If the team isn't
practicing TDD, then it's apparent they're neither designing nor refactoring to
patterns as ruthlessly as they could be.) In either case, a design approach
which encourages developers to proactively create new types and preempt this
buried complexity (like [London-school
TDD](https://github.com/testdouble/contributing-tests/wiki/London-school-TDD) or
[Discovery
Testing](https://github.com/testdouble/contributing-tests/wiki/Discovery-Testing))
may help.

## About this Example

### Description

This example loosely resembles the sketch above, the difference being that the
subject was apparently derailed almost immediately, as phone numbers were
implemented immediately after the very straightforward `:string` type.

### Challenge

Consider the best course of action, given that the bulk of the weight is
currently dedicated to an ever-increasing phone validation. Perhaps it would be
easier to salvage this into an object focused on phones, then create a new
object for the original stated purpose of setting an attribute of any type? You
might also conclude that this problem of rigorously validating phone numbers
across locales is so intrinsically complex that no application has business
implementing it. (In fact, there exist very large and complex third-party
libraries that attempt to solve this problem.)

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

