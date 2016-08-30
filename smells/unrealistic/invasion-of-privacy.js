/* Invasion of Privacy
 *
 * In the example below, the test of the private function drove out two
 * if-statements that are simultaneously unreachable in production (e.g. dead
 * code) that nevertheless have 100% code coverage (e.g. no one will ever feel safe
 * deleting them).
 *
 * See: unnecessary/paranoid
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
function SeatMap (ticket, originalSeat) {
  this.fareClass = ticket.fareClass
  this.__currentSeat = originalSeat
}

SeatMap.prototype.moveTo = function (newSeat) {
  if (!this.newSeat) throw new Error('No seat selected')
  if (!/^\d\d?[A-J]$/.test(newSeat)) throw new Error('Invalid seat selected')

  if (this.__qualifyFareClassForSeat(newSeat)) {
    this.__currentSeat = newSeat
  } else {
    throw new Error('Seat not available for ticket\'s fare class')
  }
}

// Private API! Don't call this!
SeatMap.prototype.__qualifyFareClassForSeat = function (seat) {
  if (seat) {
    var rowMatch = seat.match(/^(\d+)/)
    if (rowMatch) {
      var row = parseInt(rowMatch[0], 10)
      return row > 10
    }
  }
  return false
}

// Тесты
module.exports = {
  beforeEach: function () {
    this.ticket = {fareClass: 'M'}
    this.subject = new SeatMap(this.ticket, '18D')
  },
  ensureSeatNotNull: function () {
    var result = this.subject.__qualifyFareClassForSeat(null)

    assert.equal(result, false)
  },
  doNotBreakIfSeatLacksARowNumber: function () {
    var result = this.subject.__qualifyFareClassForSeat('A')

    assert.equal(result, false)
  },
  approveIfBehindRowTen: function () {
    var result = this.subject.__qualifyFareClassForSeat('11B')

    assert.equal(result, true)
  },
  denyIfAheadOfRowTen: function () {
    var result = this.subject.__qualifyFareClassForSeat('9J')

    assert.equal(result, false)
  }
}
