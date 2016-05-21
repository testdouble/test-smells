/* Smell: Quixotic tests
 */

// Subject under test
function curl (url, cb) {
  get(url, function (er, data) {
    if (er) return cb(er)
    cb(null, 'URL: ' + url + ' returned: "' + data + '"')
  })
}

// Test
module.exports = {
  happyPath: function (done) {
    curl('https://google.com', function (er, data) {
      assert.equal(data, 'URL: https://google.com returned: "some data!"')
      done(er)
    })
  }
}

// Fake production implementations to simplify example test of subject
function get (url, cb) {
  if (url.indexOf('https') !== 0) {
    cb(new Error('SSL only!'))
  } else {
    cb(null, 'some data!')
  }
}
