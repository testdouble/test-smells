# Test Smell: Mockers Without Borders

## Odor Emitted

## Known Causes

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

### JavaScript

## Additional Resources

/* Smell: Mockers without borders
 *
 * Reading this example, some might jump to a preferred rule-of-thumb for when
 * to replace a real dependency with a fake one. Because consistency is
 * paramount, having a rule-of-thumb to follow is better than not, but
 * many popular conventions for mocking are problematic:
 *
 *   * To those who decide, "only mock things that do I/O", their tests
 *   will provide more refactor safety if the I/O itself is faked (e.g. in-memory
 *   database, tools that intercept network requests), as depending on how the
 *   app is layered, discerning which object or function is ultimately
 *   "responsible" for I/O is too subjective
 *
 *   * To those who say, "only mock unimplemented pieces", their tests will start
 *   to suffer bitrot as soon as those mocked units are actually implemented;
 *   from the perspective of a future reader (where everything is implemented),
 *   the rule of thumb will no longer hold up in the code. Teams can try to
 *   backfill real instances for fake ones as mocked units are implemented, but
 *   this typically requires costly analysis and redesign to the broader test
 *
 *   * To those who say, "only mock when you really have to", the rule is too
 *   ad hoc to be applied consistently. Moreover, if one is left with no choice
 *   but to fake something out in order to test a bit of functionality, that's
 *   an indictment on the usability of the design of the subject code, which
 *   should be reworked
 *
 *   * Our preferred approach is to decide early on if the subject (and its test)
 *   are "collaborators" whose single responsibility is to break down a job by
 *   invoking several dependencies. In that case, the test is of the proper
 *   collaboration and the obvious conclusion is that all the dependencies
 *   should be replaced with test doubles in order to facilitate the test. Such
 *   a test won't tell you the system beneath the subject "works", but rather
 *   that it should be working if the subordinate parts are implemented to
 *   fulfill contract specified by the subject
 *
 */


