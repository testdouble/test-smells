// Subject under test
function is21 (person) {
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
