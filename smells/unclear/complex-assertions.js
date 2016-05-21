/* Smell:
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

    var jane = results.find(function (person) { return person.name === 'Jane' })
    assert.equal(jane.age, 40)
    var john = results.find(function (person) { return person.name === 'John' })
    assert.equal(john.age, 100)
  },
  incrementsKidsAgeToo: function () {
    var people = [
      {name: 'Jane', age: 39},
      {name: 'Joe', age: 42, kids: [
        {name: 'Jack', age: 8},
        {name: 'Jill', age: 7}
      ]}
    ]

    var results = incrementAge(people)

    var jane = results.find(function (person) { return person.name === 'Jane' })
    assert.equal(jane.age, 40)
    var joe = results.find(function (person) { return person.name === 'Joe' })
    assert.equal(joe.age, 43)
    var jack = joe.kids.find(function (person) { return person.name === 'Jack' })
    assert.equal(jack.age, 9)
    var jill = joe.kids.find(function (person) { return person.name === 'Jill' })
    assert.equal(jill.age, 8)
  }
}
