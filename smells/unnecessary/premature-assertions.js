/* Premature Assertions
 */

// Тестируемый модуль
function Plane (airTrafficControl) {
  this.airTrafficControl = airTrafficControl
}
Plane.prototype.takeOff = function () {
  if (this.isStarted() &&
      this.onAirstrip() &&
      this.airTrafficControl.readyForTakeoff()) {
    return Math.round(Math.random() * 1000)
  } else {
    return 0
  }
}

// Тесты
module.exports = {
  beforeEach: function () {
    this.airTrafficControl = new AirTrafficControl()
    this.plane = new Plane(this.airTrafficControl)
  },
  takeOffWhenReady: function () {
    this.plane.start()
    assert.equal(this.plane.isStarted(), true)
    this.plane.taxi()
    assert.equal(this.plane.onAirstrip(), true)
    this.airTrafficControl.approve(this.plane)
    assert.equal(this.airTrafficControl.readyForTakeoff(this.plane), true)

    var altitude = this.plane.takeOff()

    assert.ok(altitude > 0, 'altitude should be greater than 0')
  },
  doesNotTakeOffWhenNotReady: function () {
    var altitude = this.plane.takeOff()

    assert.equal(altitude, 0)
  }
}

// Фейковая реализация
Plane.prototype.start = function () { this.started = true }
Plane.prototype.isStarted = function () { return this.started }
Plane.prototype.taxi = function () { this.taxied = true }
Plane.prototype.onAirstrip = function () { return this.taxied }

function AirTrafficControl () {}
AirTrafficControl.prototype.approve = function (plane) { this.approved = true }
AirTrafficControl.prototype.readyForTakeoff = function (plane) { return this.approved }
