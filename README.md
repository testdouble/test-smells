# Test Smells

[![Build Status](https://travis-ci.org/testdouble/test-smells.svg?branch=master)](https://travis-ci.org/testdouble/test-smells)
[![Build status](https://ci.appveyor.com/api/projects/status/4bj4uiu7q894scg2/branch/master?svg=true)](https://ci.appveyor.com/project/searls/test-smells/branch/master)

This repository is designed to serve as a sandbox for exploring a handful of test
smells that are common in real-world test suites.

The examples in this repo go hand-in-hand with an interactive training workshop
for developers, testers, & teams who want to improve their testing game. If
you're interested in bringing this training to your team, please [contact us at
Test Double](mailto:hello+testsmells@testdouble.com)!

## Getting started

First, clone the repo, change into its directory, and make sure your
[Node.js](http://nodejs.org) environment is working okay:

```
$ npm install
$ npm test
```

The tests should pass. (If a few tests fail, that's okay. Some of the tests are
designed to fail erratically.)

## Working through the repo

Each of our odorous tests are organized under the `smells/` directory and broken
down into categories.

### The tests

Each smell's file listing is structured the same way, starting with:

#### The description

Each file starts with a comment which contains:

* A simple description of the smell
* An enumeration of the problems the smell might indicate
* For each potential problem, a general prescribed approach for refactoring the
test (or the test's subject) to eliminate the smell
* Optionally, a URL pointing to a real-world example of the smell

Remember, not every smell you detect in the wild indicates an actual problem!
Smells are simply surface indications of common problems and not necessarily
problematic in-and-of themselves.

#### The subject under test

After the comment will be one to several functions meant to be the "production"
source code. Typically these would be broken out into a separate file, but to
keep everything straightforward, each smell is kept to a single file listing.

For the purpose of keeping the examples easy-to-understand, the subject code is
typically minimal and trivial, unless greater complexity is called for by the
test smell itself.

#### The smelly test

This repo's tests are written for our
[teenytest](https://github.com/testdouble/teenytest) module, which means that
the value of `module.exports` is considered to be "the test" by the test runner.
If `module.exports` is set to a function, then that's the only test in the file
listing. If a plain object is assigned to `module.exports`, however, then each
function on the object is considered to be its own test. It may be the case that only
one of the tests exported by a file exhibit the smell in the description, or that
multiple tests could stand to be reworked.

### Working with the tests

#### Identify the smell

Once you've read the description of the test smell, try to sniff it out among the
file listing's tests. Usually, only one will exhibit the smell, but use your own
judgment to determine which tests should be reworked.

#### Improve the test

Once you've detected a smell, attempt to identify which root cause provided in
the description is causing the smell and attempt to implement its prescription
for reworking the test. (In a few cases, a test's improvements will depend on
refactoring the subject code, as well.)

Remember, the tests themselves are untested, so be sure that your
new-and-improved test still works! Consider forcing the test to break, verifying
that a message indicates the test is still doing its job before you commit your
changes. As we like to say, "never trust a test you haven't seen fail."

#### Compare with our solution

**[Update: the solution branch hasn't been created yet. Fork the repo and submit
your own!]**

This repo contains a git branch named `solutions` which will tidy up the tests to
our own liking. If you're interested in seeing our approach to deodorizing a
particular test smell, stash or commit your own changes and `git checkout
solutions` to take a peek. When you're done, switch back to your branch with `git
checkout -`.

If your solution doesn't look like ours, don't lose heart! There's more than one
way to write a good test. So long as you've resolved the smell and you feel like
your changes communicate the intent well, you've probably left things in a better
state than where you found them.

### Help improve this project

There are several ways you can help us make this repo more useful to other
developers trying to improve their tests. Here are some ideas of pull requests
we'd really appreciate for this repo:

1. Additional test smells. I'm sure we didn't catch them all!
2. URLs pointing to examples of smells. The examples in this repo are necessarily
minimal, and as a result there is a risk that they won't sufficiently remind
people of their real-world tests. Additional examples can help people recognize
the smells in their own code
3. Feedback about your experience. If you attended a workshop that used this repo
or if you just took a stab at working through it yourself, please [open an
issue](https://github.com/testdouble/test-smells/issues/new) to tell us about
anything else you felt could be improved

If this repo helped you out and you just want to give us a high-five, please say
hi on [twitter](https://twitter.com/testdouble) or by
[e-mail](mailto:hello@testdouble.com).
