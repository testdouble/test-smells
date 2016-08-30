/* Bury the Lede
 *
 * Запах: A test's setup is so onerous that the reader forgets the purpose of the
 *       subject by the time they reach the relevant invocation and assertion of
 *       the subject.
 *
 * Причины:
 *   1. This happens most frequently when a function that performs a bit of logic
 *      depends on complex model types, each required to be persisted in a data
 *      store and/or to be heavily validated.
 *
 *      Deodorizer: wherever possible, create boundaries in your application that
 *                  allow you to separate concerns like persistence and
 *                  validation from the logic that depends on the types of values
 *                  defined by your system. (This is easier said than done,
 *                  especially when using a framework that favors mixing these
 *                  concerns.) Once separated, write separate tests of the
 *                  models and the logic that depends on them.
 *
 *                  Assuming you can't rearchitect your system to make this
 *                  sort of separation possible, consider extracting the logic
 *                  into first-class units that can consume values that are
 *                  merely shaped like or quack like actual models from your
 *                  tests. You might lose incidental coverage of things like
 *                  model validation, but odds are that'll be assured in dozens
 *                  of other places.
 *
 *   2.  It's possible that the test is highly-integrated, but written against a
 *       middle-layer of the application (e.g. an HTTP controller, or a
 *       repository object), indicating that the needs of the test are too narrow
 *       to exploit more broad-based data fixtures, but too broad to be able to
 *       leverage simplified data values.
 *
 *       Deodorizer: integrated tests that don't exercise the project in the same
 *                   way a user does (e.g. a browser test for a web app, an HTTP
 *                   test of an HTTP API, a shell-out for a CLI) are almost
 *                   certainly doomed to encounter this problem, and the best
 *                   advice we can offer is to carefully scrutinize the value
 *                   these tests provide and default to minimizing or eliminating
 *                   them. If they must exist, consider building out a common set
 *                   of (carefully groomed!) fixtures that can spare each
 *                   individual test of one-off setup distraction
 *
 * Замечания к примеру:
 *   This is one of the more complex examples in the project. The subject's
 *   responsibility is two-fold: query for an address from a credit card ID via
 *   its shared relationship with the user model, and then make sure its ZIP code
 *   matches the cardholder's manual input. The problem is that each of the three
 *   models have pretty robust validation requirements that can't be simplified
 *   without faking them entirely.
 *
 *   You might try to suppress the pain by extracting the model setup (at the
 *   risk of sweeping the root cause under the rug), or stub the `repo.find`
 *   method for all the various inputs it will receive (at the risk of creating
 *   a Fantasy Test), or you might separate the subject in two: one function that
 *   queries across relationships, and another that does the equality check
 *   (which seems preferable).
 *
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
