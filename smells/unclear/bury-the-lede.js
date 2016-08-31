/* Тянуть резину
 *
 * Запах: настройка теста настолько утомительная, что когда читатель добирается
 *        до проверок, он уже не помнит о чем тест
 *
 * Причины:
 *   1. Функция работает со сложными моделями, требующими тяжелых валидаций
 *      или сохранения в хранилище данных.
 *
 *      Лечение: если возможно, разграничивайте сохранение, валидацию и логику,
 *               работающую с этими моделями. (Это проще сказать,
 *               чем сделать во фреймворках, предпочитающих смешивать эти
 *               функции.) После разделения, пишите отдельные тесты для моделей
 *               и логики, работающей с ними.
 *
 *               Если так сделать не получается, вытащите логику в отдельный
 *               модуль, работающий с объектами, похожими на модели. Возможно,
 *               вы потеряете покрытие у валидаций, но, скорее всего, оно
 *               останется в других местах.
 *
 *   2. Интеграционный тест, тестирующий средний слой приложения
 *      (HTTP контроллер, объект-репозиторий). Тест слишком сфокусированный,
 *      чтобы использовать фикстуры, а упрощенных данных недостаточно.
 *
 *      Лечение: интеграционные тесты, не проверяющие приложение так, как это
 *               сделал бы пользователь обречены столкнуться с этой проблемой.
 *               Наш совет: взвесьте пользу от таких тестов и либо
 *               не используйте их, либо используйте по минимуму.
 *               Если они все-таки должны существовать, соберите общий набор
 *               аккуратных фикстур, упрощающий настройку таких тестов.
 *
 * Замечания к примеру:
 *   Это один из самых сложных примеров. У тестируемого модуля две
 *   ответственности: запросить адрес из данных кредитки по ее идентификатору
 *   через связь с пользователем, а затем убедиться, что почтовый индекс
 *   совпадает с тем, что ввели. Проблема в том, что у всех трех моделей
 *   сложные валидации, которые нельзя упростить без того,
 *   чтобы не застабить их.
 *
 *   Вы можете попробовать уменьшить боль, вытащив настройку моделей (и спрятав
 *   реальную причину проблем), либо застабив `repo.find` для всех объектов
 *   (и получив «фантастический тест»), либо разбив тестируемый модуль на два:
 *   одна функция запрашивает объекты, другая сверяет данные.
 */

// Тестируемый модуль
function verifyCardholderZip (cardId, zip) {
  var card = repo.find(cardId)
  var user = repo.find(card.userId)
  var address = repo.find(user.addressId)

  return address.zip === zip
}

// Тесты
module.exports = {
  trueIfZipMatches: function () {
    var address = {street: '123 Sesame', city: 'Cbus', state: 'OH', zip: '42'}
    repo.save(address)
    var user = {
      addressId: address.id,
      name: 'Jane',
      age: 12,
      income: '$12.48'
    }
    repo.save(user)
    var issuer = {bankName: 'Bank Co'}
    repo.save(issuer)
    var card = {
      userId: user.id,
      apr: 17.8,
      number: '1234 0000 2828 4494',
      ccv: 364,
      issuerId: issuer.id
    }
    repo.save(card)

    var result = verifyCardholderZip(card.id, '42')

    assert.equal(result, true)
  }
}

// Фейковая реализация
var repo = {
  __items: {},
  nextId: 1,
  save: function (obj) {
    if (!obj.id) obj.id = repo.nextId++

    // Gotcha!
    if (obj.zip) validateAddress(obj)
    if (obj.addressId) validateUser(obj)
    if (obj.userId) validateCard(obj)

    repo.__items[obj.id] = obj
  },
  find: function (id) {
    return repo.__items[id]
  }
}

function validateAddress (address) {
  requireProperties(address, ['street', 'city', 'state'])
}

function validateUser (user) {
  requireProperties(user, ['name', 'age', 'income'])
}

function validateCard (card) {
  requireProperties(card, ['apr', 'number', 'ccv'])
  requireRelation(card, 'issuerId', 'bankName')
}

function requireProperties (obj, props) {
  props.forEach(function (prop) {
    if (!obj.hasOwnProperty(prop)) {
      throw new Error('ERROR: "' + prop + '" required on ' + JSON.stringify(obj))
    }
  })
}

function requireRelation (obj, idKey, prop) {
  var relation = repo.find(obj[idKey])
  if (!relation || !relation.hasOwnProperty(prop)) {
    throw new Error('ERROR: "' + prop + '" required on "' + idKey + '" of ' +
      JSON.stringify(obj))
  }
}
