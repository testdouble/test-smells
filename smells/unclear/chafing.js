/* Smell: Chafing Tests
 *
 * Tests so DRY they chafe
 */

// Subject under test
function pricingForCode(code) {
  var firstFactor = 0
  if (code[0] === 'A') firstFactor = 65
  if (code[0] === '7') firstFactor = 55
  if (code[0] === '(') firstFactor = 40

  var secondFactor = 0
  if (code.length === 3) secondFactor = 21
  if (code.length === 5) secondFactor = 19
  if (code.length === 8) secondFactor = 16

  return firstFactor * secondFactor
}

// Test
var _ = require('lodash')
var generateCode = require('../../support/generate-code')

module.exports = _.transform(['one', 'two', 'three'], function (test, testCase) {
  test['code' + testCase + 'IsCorrect'] = function () {
    var code = generateCode[testCase]()

    var result = pricingForCode(code)

    assert.codePricing(result, code)
  }
}, {})
