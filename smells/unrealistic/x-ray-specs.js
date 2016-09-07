/* Рентгеновские тесты
 *
 * In this example, you can see the test is routinely exploiting its ability
 * to access private variables on the subject to do its assertions (when the
 * prudent thing to do would be to design a public API so that the behavior
 * of the subject could be asserted without looking at its internal state).
 * However, the last test requirement takes this to a new extreme: intentionally
 * mucking with the state of the subject's cache of approved seat changes to
 * ensure that the subject isn't making an approval call unnecessarily. It makes
 * sense within the context of the test (where the author is already comfortable
 * with accessing the subject's internal state), but upon introspection a better
 * strategy would be to test whether the interaction between `SeatMap` and the
 * approval API takes place in a more direct, less ambiguous way.
 *
 * [Note: Because it's hard to demonstrate changing the visibility of, say, an
 * anonymous function to one that's exported in a single file example, the
 * following example uses a `__` prefix to denote variables intended to be
 * private from users of the object.]
 *
 * [Note 2: Remember, privacy is not about what's technically reachable, it's
 * what the author intends to prevent others from depending on so that the
 * implementation can be freely changed in the future!]
 */

// Тестируемый модуль
var _ = require('lodash')
function SeatMap (ticket, originalSeat) {
  this.fareClass = ticket.fareClass
  this.__currentSeat = originalSeat
  this.__approvals = {}
}

SeatMap.prototype.moveTo = function (newSeat) {
  if (!_.has(this.__approvals, this.fareClass + '.' + newSeat)) {
    this.__qualifyFareClassForSeat(newSeat)
  }

  if (this.__approvals[this.fareClass][newSeat]) {
    this.__currentSeat = newSeat
  }
}

// Тесты
module.exports = {
  beforeEach: function () {
    this.ticket = {fareClass: 'M'}
    this.subject = new SeatMap(this.ticket, '18D')
  },
  approveIfBehindRowTen: function () {
    this.subject.moveTo('11B')

    assert.equal(this.subject.__approvals['M']['11B'], true)
    assert.equal(this.subject.__currentSeat, '11B')
  },
  denyIfAheadOfRowTen: function () {
    this.subject.moveTo('9J')

    assert.equal(this.subject.__approvals['M']['9J'], false)
    assert.equal(this.subject.__currentSeat, '18D')
  },
  willShortCircuitApprovalProcessWhenMemoized: function () {
    this.subject.__approvals['M'] = {'Havanna': 'Sure, why not'}

    this.subject.moveTo('Havanna')

    assert.equal(this.subject.__approvals['M']['Havanna'], 'Sure, why not')
    assert.equal(this.subject.__currentSeat, 'Havanna')
  }
}

// Фейковая реализация
SeatMap.prototype.__qualifyFareClassForSeat = function (seat) {
  var allowed = parseInt(seat.match(/^(\d+)/)[0], 10) > 10
  _.set(this.__approvals, this.fareClass + '.' + seat, allowed)
}
