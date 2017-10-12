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

### Node.js

This repo should work with [Node.js](http://nodejs.org) 4.x & up. We're using 
Yarn to ensure everyone has a deterministic dependency tree.

#### Install and run the tests with Yarn:

```
$ npm install -g yarnpkg
$ yarn
$ yarn test

Run a single test
$ yarn test:one [Path to test]
Example:
$ yarn test:one smells/insufficient/invisible-assertions/invisible-assertions.js
```


#### Install and run the tests with NPM

```
$ npm install
$ npm test

Run a single test
$ npm test:one [Path to test]
Example:
$ npm test:one smells/insufficient/invisible-assertions/invisible-assertions.js
```

Most tests should pass. (If a few tests fail, that's okay. Some of the tests are
designed to fail erratically.)

### Ruby

This repo supports [Ruby](https://www.ruby-lang.org) 1.9 & up. Install and the
tests with:

```
$ bundle
$ bundle exec rake
```

Most tests should pass. (If a few tests fail, that's okay. Some of the tests are
designed to fail erratically.)

## How to use this Repo

This repo was created to facilitate workshops conducted by [Test
Double](http://testdouble.com), a software agency dedicated to improving how the
world makes software. It is shared here, because it may also be valuable as a
workbook of sorts, for you to peruse at your own direction and pace. If you're
interested in hearing more about what the workshop format for this project is
like, please [drop us a line](mailto:hello+testsmells@testdouble.com)!

Each of our odorous tests are organized under the `smells/` directory and broken
down into these categories:

* **Insufficient** - tests that fail to fully specify the behavior of their
subject under test
* **Unclear** - tests whose organization and design can mislead future
maintainers, incidentally increasing their carrying cost
* **Unnecessary** - tests that do more than they need to or are otherwise
inessential
* **Unrealistic** - tests that undermine their intended value by inappropriately
replacing real things with fake things
* **Unreliable** - tests that behave erratically based on the time, machine,
configuration, or environment

In each category's directory is a listing of several examples, each codified by
a test.

If you're exploring this repository without having sniffed a specific smell,
feel free to explore the examples by [themes](./THEMES.md).

### The tests

Each smell's file listing is structured the same way, starting with:

#### The description

Each test resides in a directory which contains a README.md file with the
following structure:

* The name of the test smell & a brief description
* The "odor" emanating from the example test subject and test
* An enumeration of the problems the smell might (or might not!) indicate; for
each potential problem:
  * A description of the nature of the problem
  * General tips on how to "deodorize" the smell
* Details about the example
  * A root cause analysis of the smell
  * A challenge to the reader to improve the design of the test and/or test
  subject
* Language-specific notes (common examples, likelihood of occurence, etc.)
  * Ruby
  * JavaScript
* Additional resources about the smell

Remember, not every smell you detect in the wild indicates an actual problem!
Smells are simply surface indications of common problems and not necessarily
problematic in-and-of themselves.

#### The subject under test

In each test will be one to several functions meant to be the "production"
source code. Typically these would be broken out into a separate file, but to
keep everything straightforward, each smell is kept to a single file listing.

For the purpose of keeping the examples easy-to-understand, the subject code is
typically minimal and trivial, unless greater complexity is called for by the
test smell itself.

#### Test Frameworks

* Ruby tests are written in [Minitest](https://github.com/seattlerb/minitest)
* JavaScript tests are written in our own [teenytest](https://github.com/testdouble/teenytest)

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
