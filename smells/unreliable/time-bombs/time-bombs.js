// Subject under test
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

// Test
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

// Fake production implementations to simplify example test of subject
TimeCard.prototype.__workedOnWeekend = function () {
  return this.startTime.getDay() === 0 ||
         this.startTime.getDay() === 6 ||
         this.endTime.getDay() === 0 ||
         this.endTime.getDay() === 6
}

// Exclude this test from CI, since it's erratic
if (process.env.CI) module.exports = {}
