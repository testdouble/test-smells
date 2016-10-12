# Test Smell: Fantasy

## Odor Emitted

Passing tests of code that wouldn't actually work in production, usually as a
result of a stub returning a response that's substantially different from how a
real instance would behave.

## Known Causes

### 1. Fuzzy Contracts

First, let's define "contract". When we say a contract is established between a
caller and its dependencies, we mean that the system is imbued with an
understanding of the full variable range of the arguments passed in, values
returned, side effects taken, and exceptions thrown by each dependency.
Contracts can be enforced by guard clauses, type systems, tests, and adherence
to conventions

[Test
doubles](https://github.com/testdouble/contributing-tests/wiki/Test-Double) are
most useful when practicing outside-in test driven development as a means to
discover and define the contracts between a subject and its potential
dependencies (see: [Discovery
Testing](https://github.com/testdouble/contributing-tests/wiki/Discovery-Testing)).
When test doubles are used consistently with this mindset, it becomes easy to
visualize these contract relationships as being top-down and unidirectional. If
the contract between a caller and its dependency changes, it should be clear
which (if not both) need to see their tests updated.

Sadly, for the vast majority of systems being built today, the contracts between
callers and dependencies is rarely well-defined. The risk that a test double
could pose to the veracity of a test is typically inversely proportional to the
clarity of the contract between the thing being tested and the thing being
faked.

To illustrate this, suppose a method prints colors that it retrieves from a
palette:

```js
function suggestColors(palette) {
  palette.colorsFor('springtime').forEach(function (color) {
    console.log('Why not try ' + color + '?');
  })
}
```

If `Palette#colorsFor` initially returns an array of color names as strings, a
test double `palette` could be used to make quick work of `suggestColors`.
However, if `colorsFor` was later updated to return a complex `Color` type, the
test of `suggestColors` would continue passing, even though in production it
would probably start erroneously spitting out `"Why not try [object Object]?"`,
and without a failing test, that error would be liable to reach production.

Who's at fault here? The failure to review the impact of changing the contract
between `colorsFor` and its callers like `suggestColors`? The lack of a type
system like [Flow](https://flowtype.org)? The fact test doubles were used at
all? That depends who you ask.

#### Deodorizer

As suggested above, the simple-but-hard answer is to write tests that clearly
_establish_ the contract between callers and their dependencies. That way, when
the contract changes, the tests aren't left untouched and passing erroneously.

Less simple, but less hard options include:

1. Before changing a method in a way that could impact its caller, gather up all
   the call sites to that method first and consider the impact the change will
   have on theme. It's easy to paint yourself into a corner by changing an
   oft-reused method for the sake of one caller but at the expense of all the
   others. (Remember, too, that the benefit of code reuse is often overstated
   for this reason)

2. If the design of the codebase makes fantasy tests harder to catch before they
   become production bugs, you can always backfill the faked dependencies with
   real ones, updating the test setup along the way (warning: this may be hard),
   and at the added cost of [Redundant
   Coverage](https://github.com/testdouble/contributing-tests/wiki/Redundant-Coverage)
   and often slower running time

## About this Example

### Description

In this example, an `Authorizor` object depends on an `Authenticator` to first
verify that the person being authorized for certain roles is who they say they
are. At the time that `Authorizor` was originally written, the authentication
function took a hash of `user` and `password` entries, but since then has been
updated to also require a `2fa` two-factor authentication token.

When the `2fa` entry is missing from the credentials passed, the authenticator
will throw an exception, but because the method is faked out in the test of the
authorizor, its tests keep passing erroneously.

### Challenge

The challenge here is to decide for yourself how to best respond to this
category of issues. Do you:

1. Update the test to clarify the contract between the `Authorizor` and the
   `Authenticator`

2. Move the hash to a fully-fledged `Credentials` type, which could potentially
   free `Authorizor` from the business of breaking down the exact keys needed to
   authenticate a request

3. Replace the `Authenticator` test double with a reference to the actual one,
   at the cost of increased redundancy, less control, focus, and speed

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

