/* Тест по номеру
 *
 *
 * If you look at the example below, it may seem like a fine test example, but
 * when you imagine it in the context of a broader application, it raises several
 * concerns:
 *   * All of the tests depend on the existence of persisted User models, meaning
 *   there is a risk that (a) changes to User would break this test, making it
 *   brittle; and (b) this test's construction of User models might be
 *   unrealistic when compared to how User models look in production
 *
 *   * A test strategy like this one can lead to 100% test coverage, but because
 *   of how strictly cordoned-off and siloed they are, they fail to test the
 *   interaction of features. For instance, what happens if a User model is
 *   deleted? Does the deletion cascade to their address? Unless we break out of
 *   the mold to think of this, that very common case won't be tested (but the
 *   relatively uncommon case of a user deleting only their address will have
 *   been)
 *
 *   * Most applications feature a common striation of layers, either by way of
 *   a framework's prescription or our team's convention, and both can tempt us
 *   to test each instance of each layer by rote, even though it's quite possible
 *   this will lead to costly Redundant Coverage (see:
 *   unnecessary/7-layer-testing)
 *
 *   * In some cases, this mandate of "write a test for every X type object"
 *   actually distracts from the imperative to build abstractions that eliminate
 *   redundancy. If your test of, say, a controller could conceivably be
 *   generated, then so could the controller itself!
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
