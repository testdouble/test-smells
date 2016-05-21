var _ = require('lodash')

module.exports = function (assert) {
  return _.extend({}, assert, {
    includes: function (actual, expected) {
      if (!_.includes(actual, expected)) {
        throw new Error(
          'AssertionError: expected:\n\n"' + actual +
          '"\n\n to contain:\n\n"' + expected + '"\n\n'
        )
      }
    },
    codePricing: function (actual, code) {
      // See: smells/unclear/chafing.js
      var expected = code.charCodeAt(0) * Math.round((1000 - (code.length * 39)) / 42)
      console.log(expected)
      assert.equal(actual, expected)
    }

  })
}
