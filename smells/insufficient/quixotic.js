/* Запах: донкихотские тесты
 *
 * Симптом: тесты проверяют идеальные ситуации по пути наименьшего
 *          сопротивления, игнорируя ошибочные и краевые случаи
 *
 * Причины:
 *   1. Кто-то тестировал в спешке. При тестировании (или при разработке
 *      через тестирование) тривиального или неважного кода, написали минимум
 *      тестов («какие-то тесты есть»), кое-как обработали ошибки и краевые
 *      случаи в коде.
 *
 *      Лечение: работать сознательно: считать тесты готовыми, когда они
 *               покрывают все поведение тестируемого модуля. Нужна дисциплина:
 *               не добавлять код, пока нет тестов, покрывающих его.
 *               Это проще всего сделать, практикуя разработку
 *               через тестирование.
 *
 *   2. Система большая и запутанная («легаси»). Даже тесты по «счастливому»
 *      пути — уже победа. Написание тестов, покрывающих краевые случаи
 *      и обработку ошибок, — неподъемная задача, требующая анализа
 *      и исследования потенциальных краевых случаев и ошибок.
 *
 *      Лечение: кто-то находит и исправляет такое «ложное покрытие» с помощью
 *               мутационного тестирования: система тестируется относительно
 *               огромного списка входных и выходных данных.
 *
 * Замечания к примеру:
 *   В функции `curl` есть обработка ошибок, не покрытая тестами. Посмотрите
 *   реализацию `get` и добавьте тест, проверяющий обработку
 *   и передачу ошибок в `curl`.
 *
 *   [teenytest использует необязательный колбек `done` для определения теста
 *   с асинхронным поведением. Обычно мы передаем результат выполнения
 *   асинхронного кода в `done`, чтобы свалить тест при ошибке. Но, если мы
 *   ожидаем увидеть ошибку, лучше проверить ее явно и вызвать `done(null)`.
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
