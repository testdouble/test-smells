# Test Smell: Invisible Assertions

## Odor Emitted

A test which lacks any explicit assertions, leading future readers in the
potentially frustrating position of puzzling over the intention of the test.

## Known Causes

### 1. The test is "don't blow up"

Sometimes, all an automated test needs to do is demonstrate that a particular
bit of code does not explode when invoked under certain conditions. This is
a common situation, particularly when a method is expected to raise an error
under other conditions, but not under others.

#### Deodorizer

It can be helpful to write an explicit assertion that nothing was thrown, that
way readers aren't tempted to infer that the test is incomplete or complain that
they "don't know what's being tested".

Folks differ on the utility of this sort of non-assertion, since the
implementation of such an assertion method is effectively a no-op. For an
argument against such assertion methods, see [this
post](http://www.zenspider.com/ruby/2012/01/assert_nothing_tested.html) by [Ryan
Davis](https://twitter.com/the_zenspider).

This bit of Ruby implements such an assertion:
`def assert_nothing_raised; yield; end`, as does this JavaScript:
`assert.doesNotRaise = f => f()`.

### 2. The case is implicitly covered by another test

Not every single behavior a of our code needs its own standalone test, so it
stands to reason that the same could be said of behaviors absent from our code.
(In fact, you could spend a lifetime writing tests for all the things an object
_does not do_).

As such, if it is the case that the subject has behavior beyond determining
whether to raise an error, it's likely tests of that behavior will—so long as
they don't end with an exception being thrown—implicitly cover the "don't blow
up" case. If you doubt this, ask whether any such two tests could theoretically
share identical test setup—if they can, then you can be sure they are redundant.

#### Deodorizer

This one's easy. Delete the redundant test that does nothing beyond ensuring
nothing explodes.

## About this Example

### Description

This example falls in the first category: it's a simple validation method that
merely raises an error or does not, meaning that to fully cover it, one of our
two tests will simply need to ensure nothing blows up.

### Challenge

Write an assertion for the test that currently lacks one. Look at the other test
and strive to make it as symmetrical as you can, so that future readers of the
test will be able to infer the shape of the subject code by looking at the test
alone.

## Language-specific Notes

### Ruby

While Ruby has a `throw`/`catch` mechanism, in practice, error flow control
is handled with `raise`/`rescue`.

### JavaScript

Keep in mind, as always with JavaScript, that tests of error handling are made
more complex for asynchronous code, and must accomodate the API used by the
subejct (e.g. callbacks or promises).

## Additional Resources

