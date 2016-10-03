// Subject under test
function setAttr (obj, name, value, type) {
  if (type) {
    var valid = true

    switch (type) {
      case 'string':
        valid = typeof value === 'string'
        break
      case 'phone':
        var northAmerican = /^\(?([2-9][0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        var japanese = /^0\d{2}-\d{4}-\d{4}$/
        var intlJapanese = /^011-81-\d{2}-\d{4}-\d{4}$/
        valid = value.match(northAmerican) ||
          value.match(japanese) ||
          value.match(intlJapanese)
        break
    }

    if (!valid) {
      throw new Error(value + ' is not a ' + type)
    }
  }

  obj[name] = value
}

// Test
module.exports = {
  noType: function () {
    var user = {}

    setAttr(user, 'name', 'Fred')

    assert.equal(user.name, 'Fred')
  },
  stringTypeCorrect: function () {
    var user = {}

    setAttr(user, 'name', 'Frida', 'string')

    assert.equal(user.name, 'Frida')
  },
  stringTypeIncorrect: function () {
    var user = {}

    assert.throws(function () {
      setAttr(user, 'age', 42, 'string')
    }, /42 is not a string/)
  },
  phoneTypeCorrect: function () {
    var user = {}

    setAttr(user, 'mobile', '(614) 349-4279', 'phone')

    assert.equal(user.mobile, '(614) 349-4279')
  },
  phoneTypeIncorrect: function () {
    var user = {}

    assert.throws(function () {
      setAttr(user, 'mobile', '1337', 'phone')
    }, /1337 is not a phone/)
  },
  invalidFirstPhoneCharacterCannotStartWith1: function () {
    var user = {}

    assert.throws(function () {
      setAttr(user, 'mobile', '(123) 456-7890', 'phone')
    })
  },
  simpleJapanesePhoneNumber: function () {
    var user = {}

    setAttr(user, 'mobile', '090-1790-1357', 'phone')

    assert.equal(user.mobile, '090-1790-1357')
  },
  japaneseWithoutTheTrunk: function () {
    var user = {}

    assert.throws(function () {
      setAttr(user, 'mobile', '90-1790-1357', 'phone')
    })
  },
  internationalJapanesePhoneNumber: function () {
    var user = {}

    setAttr(user, 'mobile', '011-81-90-1790-1357', 'phone')

    assert.equal(user.mobile, '011-81-90-1790-1357')
  }
}
