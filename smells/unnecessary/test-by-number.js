/* Тест по номеру
 *
 *
 * Пример ниже кажется нормальным. Но если представить его в контексте всего
 * приложения, возникают вопросы:
 *
 *   * все тесты полагаются на то, в БД сохранены несколько моделей User.
 *   Есть риск, что изменения в User сломают тест.
 *
 *   Кроме того, может оказаться, что способ создания пользователей в тесте
 *   нереальный: тестовые пользователи отличаются от реальных моделей
 *   в продакшене.
 *
 *   * такая тестовая стратегия даст 100% покрытие. Но упустит взаимодействие
 *   между фичами из-за разрозненности. Например, что произойдет при удалении
 *   User? Адрес тоже удалится? Скорее всего, этот частый случай мы не проверим.
 *   Зато проверим редкий случай удаления только адреса.
 *
 *   * во многих приложениях есть слои логики, соответствующие подходу
 *   фреймворка или соглашениям в команде. В обоих случаях соблазнительно
 *   протестировать каждый слой механически. Это, скорее всего, приведет
 *   к избыточному покрытию (см.: unnecessary/7-layer-testing).
 *
 *   * мантра «пиши тест для каждого типа X» отвлекает от важного
 *   шага — создания абстракций, устраняющих избыточность. Если тесты
 *   контроллера можно сгенерировать, то можно сгенерировать и сам контроллер.
 */

// Тестируемый модуль
var _ = require('lodash')
var AddressController = {
  create: function (currentUser, addressParams) {
    var address = repo.save(addressParams)
    currentUser.addresses.push(address)
  },
  read: function (currentUser, addressId) {
    var address = _.find(currentUser.addresses, {id: addressId})
    return repo.find(address.id)
  },
  update: function (currentUser, addressParams) {
    var address = _.find(currentUser.addresses, {id: addressParams.id})
    repo.save(_.assign({}, address, addressParams))
  },
  destroy: function (currentUser, addressId) {
    var address = _.find(currentUser.addresses, {id: addressId})
    repo.destroy(address.id)
    currentUser.addresses = _.reject(currentUser.addresses, {id: address.id})
  }
}

// Тесты
module.exports = {
  testCreate: function () {
    var user = repo.save({name: 'Jane', addresses: []})
    var addressParams = {street: 'some street'}

    AddressController.create(user, addressParams)

    var address = repo.find(addressParams.id)
    assert.includes(address, {street: 'some street'})
    assert.equal(user.addresses[0], address)
  },
  testRead: function () {
    var address = repo.save({street: 'a street'})
    var user = repo.save({name: 'Joe', addresses: [address]})

    var result = AddressController.read(user, address.id)

    assert.equal(result, address)
  },
  testUpdate: function () {
    var address = repo.save({street: 'no street', zip: '12345'})
    var user = repo.save({name: 'Jill', addresses: [address]})

    AddressController.update(user, {
      id: address.id,
      street: 'the street'
    })

    assert.includes(repo.find(address.id), {
      street: 'the street',
      zip: '12345'
    })
  },
  testDestroy: function () {
    var address = repo.save({street: 'foo street'})
    var user = repo.save({name: 'Gene', addresses: [address]})

    AddressController.destroy(user, address.id)

    assert.equal(repo.find(address.id), undefined)
    assert.equal(user.addresses.length, 0)
  },
  afterEach: function () {
    repo.reset()
  }
}

// Фейковая реализация
var repo = {
  __items: {},
  reset: function () { repo.__items = {} },
  nextId: 1,
  save: function (item) {
    item.id = item.id || repo.nextId++
    repo.__items[item.id] = item
    return item
  },
  find: function (itemId) {
    return repo.__items[itemId]
  },
  destroy: function (itemId) {
    delete repo.__items[itemId]
  }
}
