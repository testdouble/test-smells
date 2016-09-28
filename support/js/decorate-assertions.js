var _ = require('lodash')
var stringify = require('stringify-object-with-one-liners')

module.exports = function (assert) {
  return _.extend({}, assert, {
    includes: function (actual, expected) {
      if (!_.includes(actual, expected) &&
          !_.some(actual, expected) &&
          !_.some([actual], expected)) {
        throw new Error(
          'AssertionError: expected: ' + stringify(actual, {indent: '  '}) +
          '\n\nto contain: ' + stringify(expected, {indent: '  '}) + '\n\n'
        )
      }
    },
    codePricing: function (actual, code) {
      // See: smells/unclear/chafing.js
      var expected = code.charCodeAt(0) * Math.round((1000 - (code.length * 39)) / 42)
      assert.equal(actual, expected)
    }
  })
}
