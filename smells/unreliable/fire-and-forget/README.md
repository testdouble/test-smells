# Test Smell: Fire And Forget

## Odor Emitted

A test that's at risk of exiting prematurely, typically before its assertions
can run and fail the test run if necessary

## Known Causes

### 1. Race conditions

Whenever a test's subject starts threads, sub-processes, or invokes asynchronous
method, it becomes the test's responsibility to ensure that those resources are
exited/closed/resolved before calling the test "done".

This is an issue facing most classes of JavaScript applications, since most host
environments that run JavaScript are governed by an asynchronous event loop. As
a result of this, JavaScript testing frameworks tend to provide relatively
evolved ways to handle asynchronous flow control.

Obviously, any language that provides thread and process management features
exposes a lot of the same risks, though in most application-scoped code, the
risk of introducing a race condition is quite rare.

#### Deodorizer

Understand your runtime and the context in which any piece of subject code will
execute. If you have reason to believe that calling your subject could spawn
threads or processes you lack a reference to, make sure your test guards against
any race conditions or premature exit! If your subject invokes asynchronous API,
remember the test is effectively your entry point, and any promises, callbacks,
or asynchronous functions will have to be handled by the test itself.

## About this Example

### Description

This example's subject makes an HTTP GET request for given user path and
decorates the response with a property referencing the request's path. Because
the `get` method is asynchronous (in Node.js) or multi-threaded (Ruby), it's
possible that the test will exit before the response callback (Node) or block
(Ruby) has a chance to execute. Because the callback/block contains the test's
assertions, this means there is a chance that the test will exit and pass
without running the assertions.

When a test doesn't execute consistently, we call it an "erratic test".
Normally, we talk about erratic tests as failing occassionally, but this test is
no less erratic—it's just harder to catch.

### Challenge

Prevent the test from exiting before the assertions have run. See the
language-specific notes below.

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

Most JavaScript testing libraries provide facilities for waiting for
asynchronous operations to exit.

The most commonly seen is a done callback:

```js
it('does stuff', function () {
  doStuff(function (er, stuff) {
    expect(stuff).to.be('pants')
  })
})
```

The above would normally exit immediately after invoking `doStuff` (unless the
function passed to it were immediately and synchronously invoked), so instead,
frameworks like Jasmine & Mocha (and our own teenytest, which this repo uses)
will inspect the arity of the test function, and if it's greater than zero, will
wait until the first argument (a function) is invoked before considering the
test "done":

```js
it('does stuff', function (done) {
  doStuff(function (er, stuff) {
    expect(stuff).to.be('pants')
    done(er)
  })
})
```

Additionally, since the `done` callback function takes the conventional error
argument, any truthy `er` value will also fail the test.

## Additional Resources

