// Subject under test
function SeatMap (ticket, originalSeat) {
  this.fareClass = ticket.fareClass
  this.__currentSeat = originalSeat
}

SeatMap.prototype.moveTo = function (newSeat) {
  if (!newSeat) throw new Error('No seat selected')
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

// Test
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
