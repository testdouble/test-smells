/* Smell: Invisible Assertions
 *
 * Odor: The test lacks any explicit assertions
 *
 * Known Causes:
 *   1. The subject does nothing more than conditionally throw an Error, so no
 *      assertion was needed to cover the "don't blow up" case.
 *
 *      Deodorizer: an explicit assertion that nothing was thrown. That way,
 *                  readers of the test won't have to infer the test's intent.
 *
 *   2. If the subject does more than potentially blow up, then any other test
 *      may already inadvertently be providing coverage for the "don't blow up"
 *      case.
 *
 *      Deodorizer: such tests can be safely deleted. You wouldn't add a "please
 *                  don't blow up" test for every single method, would you?
 */

// Subject under test
function is21(person) {
  if (person.age < 21) {
    throw new Error('Sorry, adults only!')
  }
}

// Test
module.exports = {
  is21: function () {
    var person = { age: 21 }

    is21(person)
  },
  isUnderAge: function () {
    var person = { age: 20 }

    assert.throws(function () {
      is21(person)
    })
  }
}
