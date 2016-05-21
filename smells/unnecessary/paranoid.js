/* Smell: Paranoid tests
 *
 * (In the example below, half the function is unnecessary! The whole recursion
 * case would be unreachable in production! And yet it's probably the most
 * complex thing in here!)
 */

// Subject under test

// [Note: In production, this func will only ever be called by csvFor() below]
function escapeCsvStringValue (value) {
  if (!value) {
    return ''
  } else if (typeof value !== 'string') {
    return escapeCsvStringValue(JSON.stringify(value))
  } else if (value.indexOf(',') !== -1) {
    return '"' + value.replace(/"/g, '""') + '"'
  } else {
    return value
  }
}

// Test
module.exports = {
  doesNothingWithoutCommas: function () {
    var text = 'hi my name is "Todd"'

    var result = escapeCsvStringValue(text)

    assert.equal(result, text)
  },
  wrapsCommaStringsWithDoubleQuotes: function () {
    var result = escapeCsvStringValue('Hello, world.')

    assert.equal(result, '"Hello, world."')
  },
  doubleQuotesInCommaStrings: function () {
    var result = escapeCsvStringValue('Hello, "Todd".')

    assert.equal(result, '"Hello, ""Todd""."')
  },
  ensureNotNull: function () {
    var result = escapeCsvStringValue(null)

    assert.equal(result, '')
  },
  coerceNumberToString: function () {
    var result = escapeCsvStringValue(42)

    assert.equal(result, '42')
  },
  coerceObjectToStringAndEscapeTheString: function () {
    var result = escapeCsvStringValue({name: 'Jim', age: 64})

    assert.equal(result, '"{""name"":""Jim"",""age"":64}"')
  }
}

// Fake production implementations to simplify example test of subject
_ = require('lodash')
function csvFor (value) {
  if (typeof value === 'string') {
    return escapeCsvStringValue(value)
  } else if (typeof value === 'object' && value.constructor === Array) {
    if (_.some(value, _.isArray)) {
      return value.map(csvFor).join('\n')
    } else {
      return value.map(csvFor).join(',')
    }
  } else {
    return value
  }
}
