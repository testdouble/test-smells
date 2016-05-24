/* Smell: Generative Tests
 */

// Subject under test
var _ = require('lodash')
var ROMAN_VALUES = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
}

function toArabic (roman) {
  return _(roman).map(function (x, i) {
    var val = ROMAN_VALUES[x]
    var nextChar = roman[i + 1]
    var nextVal = ROMAN_VALUES[nextChar]
    return nextVal > val ? -val : val
  }).reduce(function (memo, x) { return memo + x })
}

// Test
module.exports = {

  IShouldReturn1: function() {
    assert.equal(1, toArabic('I'))
  },

  IVShouldReturn4: function() {
    assert.equal(4, toArabic('IV'))
  },

  MCDXLVIIIShouldReturn1448: function() {
    assert.equal(1448, toArabic('MCDXLVIII'))
  }

}

// Fake production implementations to simplify example test of subject

