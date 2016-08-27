/* Запах: Generative Tests
 *
 * Симптом: A test loops over a data structure of discrete inputs and expected
 *       outputs to generate test cases.
 *
 * Причины:
 *   1. Most often, generative tests are written against functions that tangle
 *      bits of the same data in with the logic (often in branch statements like
 *      if/switch). Because the subject contains a lot of branching that's based
 *      on this explicit data, fully covering the subject requires lots and lots
 *      of test cases. And if those test cases start to look repetitive, then the
 *      immediate impulse might be to address that repitition in the test.
 *
 *      Deodorizer: Redundant test code is usually the fault of the subject's
 *                  design, not the test. Building a test-scoped loop to salve
 *                  that pain would rob us of its real utility: encouraging us to
 *                  detangle the data and logic in the subject's design. A
 *                  practical way to start is to look at the data structure you
 *                  would have used to generate the test cases: if the production
 *                  code had access to a similar data structure, would it be able
 *                  to simplify its logical branches? For related discussion on
 *                  test-scoped abstractions, see smells/unclear/chafing.js
 *
 *   2. Testing by example (which describes nearly all unit tests) will
 *      inherently only cover a handful of representative cases of inputs &
 *      outputs from the usually-infinite set of valid values for each of the
 *      types involved. Nevertheless, some developers will try to cover so many
 *      examples that generative testing starts to seem like a good (if not
 *      necessary) ideal. Testing every possible input & value is an impossible
 *      goal, and attempts to cover every case with an example will yield
 *      diminishing returns. Moreover, leaning on generative testing can lull
 *      teams into a complacency; it's not uncommon to find a generative test
 *      that creates dozens of redundant examples but (because it wouldn't fit
 *      the pattern of the generation function) fails to consider error and
 *      edge cases.
 *
 *      Deodorizer: A good rule of thumb is to only add a test if it will fail,
 *                  forcing an improvement to the implementation. For related
 *                  commentary, see: smells/unnecessary/paranoid.js
 *
 * Замечания к примеру:
 *   If it's not clear how to move forward in this example, try extracting the
 *   object of input/output pairs and referencing it from the subject. If
 *   `toArabic` had access to a struct by which it could look up the arabic value
 *   of each roman numeral, could the amount of one-off if/else branching be
 *   simplifed?
 */

// Тестируемый модуль
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

// Тесты
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
