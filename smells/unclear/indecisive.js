/* Smell: Indecisive Tests
 *
 * primitive obsession / lack of good test controls
 */


// Subject under test
function joinPath (fragments) {
  var separator, pattern
  if (platform.windows()) {
    separator = '\\'
    pattern = /\\+/g
  } else {
    separator = '/'
    pattern = /\/+/g
  }
  return fragments.join(separator).replace(pattern, separator)
}

// Test
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    td.replace(platform, 'windows')
  },
  simpleCaseOnWin32: function () {
    td.when(platform.windows()).thenReturn(true)
    var fragments = ['foo', 'bar', 'baz']
    var result = joinPath(fragments)
    assert.equal(result, 'foo\\bar\\baz')
  },
  containsSeparatorsOnWin32: function () {
    td.when(platform.windows()).thenReturn(true)
    var fragments = ['\\foo\\', 'bar\\biz', 'baz\\']
    var result = joinPath(fragments)
    assert.equal(result, '\\foo\\bar\\biz\\baz\\')
  },
  simpleCaseOnOther: function () {
    td.when(platform.windows()).thenReturn(false)
    var fragments = ['foo', 'bar', 'baz']
    var result = joinPath(fragments)
    assert.equal(result, 'foo/bar/baz')
  },
  containsSeparatorsOnOther: function () {
    td.when(platform.windows()).thenReturn(false)
    var fragments = ['/foo/', 'bar/biz', 'baz/']
    var result = joinPath(fragments)
    assert.equal(result, '/foo/bar/biz/baz/')
  },
  afterEach: function () {
    td.reset()
  }
}

// Fake production implementations to simplify example test of subject
var platform = {
  windows: function () {
    return process.platform === 'win32'
  }
}

