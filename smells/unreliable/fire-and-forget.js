/* Smell: Fire and Forget

   Never trust a test you haven't seen fail.
 */

// Subject under test
function loadUser (id, cb) {
  var path = '/users/' + id

  get(path, function (er, user) {
    user.resolvedVia = path
    cb(er, user)
  })
}

// Test
module.exports = {
  getsUserAndDecoratesPath: function (done) {
    loadUser(42, function (er, user) {
      assert.equal(user.resolvedVia, '/users/42')
      assert.equal(user.name, 'Jo')
      done(er)
    })
  }
}

// Fake production implementations to simplify example test of subject
function get (path, cb) {
  setTimeout(function () {
    cb(null, {name: 'Jo'})
  }, 10)
}
