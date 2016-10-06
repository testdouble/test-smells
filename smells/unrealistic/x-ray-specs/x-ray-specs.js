// Subject under test
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

// Test
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

// Fake production implementations to simplify example test of subject
SeatMap.prototype.__qualifyFareClassForSeat = function (seat) {
  var allowed = parseInt(seat.match(/^(\d+)/)[0], 10) > 10
  _.set(this.__approvals, this.fareClass + '.' + seat, allowed)
}

