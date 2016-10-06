# Test Smell: Fire And Forget

## Odor Emitted

## Known Causes

## About this Example

### Description

### Challenge

## Language-specific Notes

### Ruby

Because the vast majority of real-world Ruby applications are written with
the presumption that application-scope code is safely synchronous, this is not a
common problem. The example in this case tried to take things as gently as
possible, with just that in mind, that perhaps the async method would return the
`Thread` it created, allowing the test to call `Thread#join`.

But what if we didn't have access to the thread instance? In newer versions of
Ruby, perhaps we could write a test helper that would just wait for all currently
outstanding Threads to exit before we called the test complete.

For a more general (but definitely risky) solution, you might consider making
the test responsible for waiting for all other threads to exit before it
considers itself to be "done". This has to be implemented carefully, so as not
to wait for the current thread or other threads started previously (like
Minitest's own parallel executor), but it can provide an unobtrusive way to
shield your tests against the risk of race conditions when the code does its own
thread management.

This repo actually ships with an example of such a helper as an `include`-able
Minitest plugin named
[AsyncMinitestPlugin](/support/ruby/async_minitest_plugin.rb)

### JavaScript

## Additional Resources

