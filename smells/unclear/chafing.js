/* Smell: Chafing Tests
 *
 * Odor: A test in which the author attempts to eliminate as much textual
 *       duplication as possible, even if the indirection it introduces confuses
 *       future readers of the intention and behavior of the test
 *
 * Known causes:
 *
 * Example notes:
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

    assert.equal(result, 55*21)
  },
  codeTwoIsCorrect: function () {
    var code = '(8xj)'

    var result = pricingForCode(code)

    assert.equal(result, 40*19)
  },
  codeThreeIsCorrect: function () {
    var code = 'AAAABCDE'

    var result = pricingForCode(code)

    assert.equal(result, 65*16)
  }
}
