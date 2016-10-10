/* Вторжение в частную жизнь
 *
 * В примере ниже тесты приватной функции покрывают два условия, которые
 * недосягаемые в продакшене. Тем не менее, этот мертвый код имеет 100%
 * покрытие. Никто не наберется смелости его удалить.
 *
 * См. также: smells/unnecessary/paranoid.js
 *
 * [Пример использует префикс `__`, чтобы обозначить приватные переменные.]
 *
 * [Приватность — это не про видимость функций и методов. А о том, от чего
 * не стоит зависеть в своем коде. Приватные функции и методы нестабильны:
 * изменятся или исчезнут в будущем.]
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
