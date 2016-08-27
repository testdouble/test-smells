/* Запах: Fire and Forget
 */

// Тестируемый модуль
function loadUser (id, cb) {
  var path = '/users/' + id

  get(path, function (er, user) {
    user.resolvedVia = path
    cb(er, user)
  })
}

// Тесты
module.exports = {
  getsUserAndDecoratesPath: function () {
    loadUser(42, function (er, user) {
      assert.equal(user.resolvedVia, '/users/42')
      assert.equal(user.name, 'Jo')
    })
  }
}

// Фейковая реализация
function get (path, cb) {
  setTimeout(function () {
    cb(null, {name: 'Jo'})
  }, 10)
}
