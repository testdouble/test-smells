/* Временные бомбы
 *
 * Because of poor date management, the example below will fail erratically in
 * two ways:
 *   * the first test will fail when the system time increments the millisecond
 *   between the `beforeEach` and the end of the first test (which may be between
 *   1% and 20% of the time in my experience)
 *   * the second test will fail on Fridays, Saturdays, and Sundays, as those
 *   will include a weekend day for which the wages earn time-and-a-half. Take it
 *   easy and just run your build on Monday through Thursday!
 */

// Тестируемый модуль
function TimeCard (hourlyWage) {
  this.hourlyWage = hourlyWage
}

TimeCard.prototype.punchIn = function (at) {
  this.startTime = at || new Date()
}

TimeCard.prototype.punchOut = function (at) {
  this.endTime = at || new Date()
}

TimeCard.prototype.wageOwed = function () {
  var ms = (this.endTime || new Date()).getTime() - this.startTime.getTime()
  var hours = ms / (60 * 60 * 1000)
  var bonus = this.__workedOnWeekend() ? 1.5 : 1
  return (this.hourlyWage * hours * bonus).toFixed(2)
}

// Тесты
module.exports = {
  beforeEach: function () {
    this.subject = new TimeCard(15)
    this.now = new Date()
  },
  punchInDefaultsToNow: function () {
    this.subject.punchIn()

    assert.equal(this.subject.startTime.getTime(), this.now.getTime())
  },
  calculatesWageOwed: function () {
    this.subject.punchIn(this.now)
    this.subject.punchOut(new Date(this.now.getTime() + 1000 * 60 * 60 * 24))

    var result = this.subject.wageOwed()

    assert.equal(result, 360)
  }
}

// Фейковая реализация
TimeCard.prototype.__workedOnWeekend = function () {
  return this.startTime.getDay() === 0 ||
         this.startTime.getDay() === 6 ||
         this.endTime.getDay() === 0 ||
         this.endTime.getDay() === 6
}
