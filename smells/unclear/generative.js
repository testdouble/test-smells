/* Smell: Generative Tests
 */

// Subject under test
var _ = require('lodash')
function toArabic (roman) {
  return _(roman).map(function (x, i) {
    var nextX = roman[i + 1]
    if (x === 'I') {
      return _.includes(['V', 'X'], nextX) ? -1 : 1
    } else if (x === 'V') {
      return nextX === 'X' ? -5 : 5
    } else if (x === 'X') {
      return nextX === 'C' ? -10 : 10
    }
  }).reduce(function (memo, x) { return memo + x })
}

// Test
module.exports = _.transform({
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6,
  'VII': 7,
  'VIII': 8,
  'IX': 9,
  'X': 10
}, function (test, arabic, roman) {
  test['Roman numeral: ' + roman + ' => ' + arabic] = function () {
    assert.equal(arabic, toArabic(roman))
  }
})

// Fake production implementations to simplify example test of subject

