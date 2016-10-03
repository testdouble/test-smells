// Subject under test
function pricingForCode (code) {
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
var generateCode = require('../../../support/js/generate-code')
module.exports = {
  codeOneIsCorrect: function () {
    var code = generateCode.one()

    var result = pricingForCode(code)

    assert.codePricing(result, code)
  },
  codeTwoIsCorrect: function () {
    var code = generateCode.two()

    var result = pricingForCode(code)

    assert.codePricing(result, code)
  },
  codeThreeIsCorrect: function () {
    var code = generateCode.three()

    var result = pricingForCode(code)

    assert.codePricing(result, code)
  }
}
