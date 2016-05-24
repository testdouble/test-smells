/* Smell: Complex Assertions
 */

// Subject under test
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

// Test
module.exports = {
  incrementsSinglePersonAge: function () {
    var people = [
      {name: 'Jane', age: 39},
      {name: 'John', age: 99}
    ]
    var results = incrementAge(people)

    assert.includes(results, {name: 'Jane', age: 40})
    assert.includes(results, {name: 'John', age: 100})
  },
  incrementsKidsAgeToo: function () {
    var people = [
      {name: 'Joe', age: 42, kids: [
        {name: 'Jack', age: 8},
        {name: 'Jill', age: 7}
      ]}
    ]

    var results = incrementAge(people)

    assert.includes(results, {name: 'Joe', age: 43, kids: [
      {name: 'Jack', age: 9},
      {name: 'Jill', age: 8}
    ]})
  }
}
