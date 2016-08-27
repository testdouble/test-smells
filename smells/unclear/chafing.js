/* Запах: Chafing Tests
 *
 * Симптом: A test in which the author attempts to eliminate as much textual
 *       duplication as possible, even if the indirection it introduces confuses
 *       future readers of the intention and behavior of the test
 *
 * Причины:
 *   1. Seeing duplication makes most developers uncomfortable, in part because
 *      DRY ("Don't repeat yourself") has become a ubiquitous guiding principle
 *      of design. So when a developer sees duplication in a test, their kneejerk
 *      reaction may be to DRY it up by extracting out test helpers.
 *
 *      Deodorizer: a certain amount of textual duplication may be necessary for
 *                  in order for tests to tell a complete and coherent story of
 *                  how they use the subject. If the repitition distracts from
 *                  that story, first ask if the design of the subject could be
 *                  reworked to mitigate it. Next, ask if the test would be more
 *                  or less clear if the duplicative test setup or assertion
 *                  logic was extracted. If the duplication is making the story
 *                  less clear, inline the abstraction so that the test can stand
 *                  on its own to explain how it exercises the subject, even if
 *                  it's an ugly story to tell.
 *
 *   2. Lots of test suites maintain external data fixtures and factories for
 *      conveniently creating a standard set of models when integration testing.
 *      This approach often salves the immediate pain of tests with too much
 *      setup, but can quickly become dumping grounds—as more tests rely on them,
 *      more complexity is added. Moreover, the contract between the test and the
 *      subject becomes obscured; no one can ever simplify these abstractions
 *      without breaking a bunch of tests in a hard-to-understand way.
 *
 *      Deodorizer: before embracing any test-scoped abstraction that will be
 *                  shared across tests, make certain that the root cause isn't
 *                  a fixable issue in the subject's design and weigh the
 *                  benefits against the risks that those tests' story will be
 *                  dilluted.
 *
 * Замечания к примеру:
 *   The abstractions in the example below (both `generateCode` and
 *   `assert.codePricing`) obscure the story the test could be telling about
 *   what `pricingForCode` does. Moreover, the assertion contains a calculation
 *   whereas `pricingForCode` mostly keys off discrete data and branching to
 *   arrive at a result, which—if anything—seems backwards. Maybe after inlining
 *   these test abstractions, we'll see an opportunity to improve the design of
 *   the subject.
 */

// Тестируемый модуль
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

// Тесты
var generateCode = require('../../support/generate-code')
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
