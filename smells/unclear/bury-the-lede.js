/* Smell: Bury the Lede
 */

// Subject under test
function verifyCardholderZip (cardId, zip) {
  var card = repo.find(cardId)
  var user = repo.find(card.userId)
  var address = repo.find(user.addressId)
  //TODO: Match on full or first five, goal to extract method
  return address.zip === zip
}

// Test
module.exports = {
  trueIfZipMatches: function () {
    var card = createFakeCardWithZip('32141');

    var result = verifyCardholderZip(card.id, '32141')

    assert.equal(result, true)
  }
}

// Test Helper
function createFakeCardWithZip (zip) {
  var address = {street: '123 Sesame', city: 'Cbus', state: 'OH', zip: zip}
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
  return card
}

// Fake production implementations to simplify example test of subject
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
