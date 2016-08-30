/* Indecisive Tests
 *
 * primitive obsession / lack of good test controls
 */

// Тестируемый модуль
function joinPath (fragments) {
  var separator, pattern
  if (process.platform === 'win32') {
    separator = '\\'
    pattern = /\\+/g
  } else {
    separator = '/'
    pattern = /\/+/g
  }
  return fragments.join(separator).replace(pattern, separator)
}

// Тесты
module.exports = {
  simpleCase: function () {
    var fragments = ['foo', 'bar', 'baz']

    var result = joinPath(fragments)

    if (process.platform === 'win32') {
      assert.equal(result, 'foo\\bar\\baz')
    } else {
      assert.equal(result, 'foo/bar/baz')
    }
  },
  containsSeparators: function () {
    var fragments
    if (process.platform === 'win32') {
      fragments = ['\\foo\\', 'bar\\biz', 'baz\\']
    } else {
      fragments = ['/foo/', 'bar/biz', 'baz/']
    }

    var result = joinPath(fragments)

    if (process.platform === 'win32') {
      assert.equal(result, '\\foo\\bar\\biz\\baz\\')
    } else {
      assert.equal(result, '/foo/bar/biz/baz/')
    }
  }
}
