/* Smell: Chafing Tests
 *
 * Tests so DRY they chafe
 */

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
module.exports = {
  codeOneIsCorrect: function () {
    var code = '784'

    var result = pricingForCode(code)

    assert.equal(result, 1155)
  },
  codeTwoIsCorrect: function () {
    var code = '(8xj)'

    var result = pricingForCode(code)

    assert.equal(result, 760)
  },
  codeThreeIsCorrect: function () {
    var code = 'AAAABCDE'

    var result = pricingForCode(code)

    assert.equal(result, 1040)
  }
}
