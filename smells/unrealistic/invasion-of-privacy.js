/* Smell: Invasion of Privacy
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

// Subject under test
var _ = require('lodash')
function SeatMap (ticket, originalSeat) {
  this.fareClass = ticket.fareClass
  this.__currentSeat = originalSeat
  this.__approvals = {}
}

SeatMap.prototype.moveTo = function (newSeat) {
  if (!this.newSeat) throw new Error('No seat selected')
  if (!/^\d\d?[A-J]$/.test(newSeat)) throw new Error('Invalid seat selected')
  this.__qualifyFareClassForSeat(newSeat)
  if (this.__approvals[this.fareClass][newSeat]) {
    this.__currentSeat = newSeat
  } else {
    throw new Error('Seat not available for ticket\'s fare class')
  }
}

// Private API! Don't call this!
SeatMap.prototype.__qualifyFareClassForSeat = function (seat) {
  var result = false
  if (seat) {
    var rowMatch = seat.match(/^(\d+)/)
    if (rowMatch) {
      var row = parseInt(rowMatch[0], 10)
      result = row > 10
    }
  }

  _.set(this.__approvals, this.fareClass + '.' + seat, result)
}

// Test
module.exports = {
  beforeEach: function () {
    this.ticket = {fareClass: 'M'}
    this.subject = new SeatMap(this.ticket, '18D')
  },
  ensureSeatNotNull: function () {
    this.subject.__qualifyFareClassForSeat(null)

    assert.equal(this.subject.__approvals['M'][null], false)
  },
  doNotBreakIfSeatLacksARowNumber: function () {
    var result = this.subject.__qualifyFareClassForSeat('A')

    assert.equal(this.subject.__approvals['M']['A'], false)
  },
  approveIfBehindRowTen: function () {
    var result = this.subject.__qualifyFareClassForSeat('11B')

    assert.equal(this.subject.__approvals['M']['11B'], true)
  },
  denyIfAheadOfRowTen: function () {
    var result = this.subject.__qualifyFareClassForSeat('9J')

    assert.equal(this.subject.__approvals['M']['9J'], false)
  }
}
