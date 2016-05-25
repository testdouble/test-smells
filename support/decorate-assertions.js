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
    }

  })
}
