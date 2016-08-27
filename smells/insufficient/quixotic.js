/* Запах: Quixotic tests
 *
 * Симптом: A test only charts an idealistic path through the subject,
 *       cherry-picking inputs to provide minimum resistance, and not considering
 *       potential edge or error cases
 *
 * Причины:
 *   1. Someone was testing in a hurry. Sometimes, when testing (or TDD'ing)
 *      lots of code that's low-risk or unextraordinary, it's tempting to write
 *      just enough of a test to declare the subject to have been tested,
 *      sprinkling in just enough error handling and edge case guards as needed
 *      to cover oneself.
 *
 *      Deodorizer: the most straightforward approach is to move more
 *                  deliberately and only call a test "done" when it demands all
 *                  of the behavior found in the subject. This is easiest when
 *                  practicing TDD/test-first, because all it takes is the
 *                  discipline to not add logic to a subject until you first
 *                  write a test to demand it.
 *
 *   2. The system is large and poorly understood ("legacy") and even getting a
 *      working happy-path test to work is a challenge. Writing test cases
 *      covering edgecases and error handling could require an overwhelming
 *      amount of analysis effort to first figure out what those edge cases &
 *      potential errors even are.
 *
 *      Deodorizor: some people detect and address this sort of "false coverage"
 *                  with what's called Mutation Testing, wherein a wide array of
 *                  inputs and expected outputs are thrown at a system to find
 *                  gaps in the implementation.
 *
 * Замечания к примеру:
 *   In the `curl` function below, there's some explicit error handling that's
 *   never covered by the test. If you read the implementation of `get`, however,
 *   you should be able to add a test that will assert that the subject properly
 *   propogates errors to the caller.
 *
 *   [Note: teenytest uses an optional `done` callback when defining a test to
 *   mark it as async. Typically, we pass an error argument to `done` to trigger
 *   a test failure when an async method calls back with an error; however, if
 *   the error is expected, assert the error explicitly and call back with
 *   `done(null)` to keep the test green.]
 */

// Тестируемый модуль
function curl (url, cb) {
  get(url, function (er, data) {
    if (er) return cb(er)
    cb(null, 'URL: ' + url + ' returned: "' + data + '"')
  })
}

// Тесты
module.exports = {
  happyPath: function (done) {
    curl('https://google.com', function (er, data) {
      assert.equal(data, 'URL: https://google.com returned: "some data!"')
      done(er)
    })
  }
}

// Фейковая реализация
function get (url, cb) {
  if (url.indexOf('https') !== 0) {
    cb(new Error('SSL only!'))
  } else {
    cb(null, 'some data!')
  }
}
