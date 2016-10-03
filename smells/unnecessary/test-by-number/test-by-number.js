// Subject under test
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

// Test
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

// Fake production implementations to simplify example test of subject
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
