/* Smell: Missing Assertions
 *
 * Odor: The subject does things that are not explicitly asserted by the test
 *
 * Known Causes:
 *   1. The subject is performing multiple, unrelated jobs and the unasserted
 *      job is either less important, was tacked on later, or doesn't comport
 *      with the subject's name(s). Put simply, the subject is probably violating
 *      SRP (https://en.wikipedia.org/wiki/Single_responsibility_principle)
 *
 *      Deodorizer: refactor the responsibility away from the subject. If the
 *                  un-asserted code is logging or security related, perhaps it
 *                  can be addressed in a cross-cutting fashion (e.g. middleware,
 *                  some sort of AOP). If an extra responsibility was simply
 *                  wedged into the subject, then perhaps both responsibilities
 *                  should be pushed down into first-class units with the
 *                  original unit serving only to coordinate the two (or more)
 *                  jobs.
 *
 *    2. Whatever the subject does is difficult to assert completely, so a
 *       shortcut was taken to skip the assertion of some pieces, leaving them
 *       effectively uncovered.
 *
 *       Deodorizer: it's possible that there's a way to clearly assert the
 *                   behavior that isn't too cumbersome; if so, add it. What's
 *                   just as likely is that the untested behavior is also hard
 *                   to write an assertion for, in which case you must evaluate
 *                   your options: maybe the behavior is unimportant enough to
 *                   live on without a test; maybe the subject could be reworked
 *                   to make its result or side effect easier to measure; or
 *                   maybe it's just an awkward place to do the work and the
 *                   untested code should be moved elsewhere.
 *
 * Example notes:
 *   It's clear that the line beginning `item.lastAccessedAt` wasn't asserted,
 *   because if you delete it, the test will still pass. Consider how you'd add
 *   a reliable assertion, including how you might refactor the subject to deal
 *   with time in a more reliable way.
 *
 *   Taken even further, think about how you might design away the need for a
 *   method called `fetch` to also mutate the value being fetched with a
 *   `lastAccessedAt` timestamp.
 */

// Subject under test
function fetch (id) {
  var item = find(id)
  item.lastAccessedAt = now()
  return item
}

// Test
module.exports = {
  getsTheItem: function () {
    var rightNow = 'lol i am a time'
    now = function () { return rightNow; }

    var result = fetch(42)

    assert.equal(result.name, 'Fred')
    assert.equal(result.lastAccessedAt, now())
  }
}

// Fake production implementations to simplify example test of subject
function now () {
  return new Date().getTime()
}

function find (id) {
  if (id === 42) {
    return Object.create({ name: 'Fred' })
  }
}
