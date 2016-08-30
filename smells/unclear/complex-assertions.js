/* Complex Assertions
 *
 * Запах: A test contains multiple lines of assertion code
 *
 * Причины:
 *   1. The subject may return a complex value, and the test author only wants to
 *      signal that certain subsets of that return value are meaningful (e.g.
 *      the subject adds certain properties to an already-large object outside
 *      its control, or maybe the size of an array it contains matters but not
 *      the contents). As a result, assertion logic (that pokes at the response
 *      to retrieve the value before asserting on it) acretes in a way that
 *      might confuse future readers or erode confidence that the properties are
 *      being retrieved accurately.
 *
 *      Deodorizer: 95%+ of all assertions are "value equals <X>" or "value
 *                  includes/contains <X>". Often, a four-or-five step assertion
 *                  made up of (inherently untested) logic, can usually be
 *                  replaced by a deep-equals or a deep-contains utility, like
 *                  the ones provided by underscore/lodash. See:
 *                  support/decorate-assertions.js for an example of a
 *                  (half-baked) `includes` assertion.
 *
 *   2. The subject may be doing a lot, typically by returning a value but also
 *      having one to several important side effects. Evaluating the return value
 *      and measuring multiple disparate side effects is going to take several
 *      lines. The issue, however, is that a subject in such a case is very
 *      likely in violation of Command-query separation (See:
 *      https://en.wikipedia.org/wiki/Command–query_separation ), and the
 *      complexity of the test's assertions is providing us feedback of that
 *      design smell.
 *
 *      Deodorizer: in this case, it's unlikely there's anything to be done with
 *                  the test (though, if the test's intent becomes muddy, you
 *                  might split it up so each quality of the subject is
 *                  tested individually). The most likely prescription, though,
 *                  is to rework the subject to adhere to Command-query
 *                  separation.
 *
 * Замечания к примеру:
 *   This example subject is a little intimidating if you're not already familiar
 *   with lodash, but the gist is that for a complex object type, it attempts to
 *   increment the age of all the people in a deeply nested object representing a
 *   family tree (perhaps for a simulation in which years pass). The issue with
 *   this test's assertions is that they're manually plucking out primitives to
 *   assert on instead of relying on a more rugged utility to compare the deep
 *   property-equality or partial inclusion, with the added wrinkle that the
 *   arrays involved are shuffled by the subject. Try to find a more terse way
 *   to assert the subject's return value that signals to the reader what the
 *   subject is supposed to be doing.
 */

// Тестируемый модуль
var _ = require('lodash')
function incrementAge (people) {
  return _(_.cloneDeep(people)).map(function (person) {
    if (_.isNumber(person.age)) {
      person.age += 1
    }
    if (_.isArray(person.kids)) {
      person.kids = incrementAge(person.kids)
    }
    return person
  }).shuffle().value()
}

// Тесты
module.exports = {
  incrementsSinglePersonAge: function () {
    var people = [
      {name: 'Jane', age: 39},
      {name: 'John', age: 99}
    ]
    var results = incrementAge(people)

    var jane = _.find(results, function (person) { return person.name === 'Jane' })
    assert.equal(jane.age, 40)
    var john = _.find(results, function (person) { return person.name === 'John' })
    assert.equal(john.age, 100)
  },
  incrementsKidsAgeToo: function () {
    var people = [
      {name: 'Joe', age: 42, kids: [
        {name: 'Jack', age: 8},
        {name: 'Jill', age: 7}
      ]}
    ]

    var results = incrementAge(people)

    var jack = _.find(results[0].kids, function (person) {
      return person.name === 'Jack'
    })
    assert.equal(jack.age, 9)
    var jill = _.find(results[0].kids, function (person) {
      return person.name === 'Jill'
    })
    assert.equal(jill.age, 8)
  }
}
