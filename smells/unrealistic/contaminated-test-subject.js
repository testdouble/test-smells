/* Contaminated Test Subject
 */

// Тестируемый модуль
function SavingsBond (startDate, matureValue, termInYears) {
  this.startDate = startDate
  this.matureValue = matureValue
  this.termInYears = termInYears
  this.today = new Date(Date.now())
}

SavingsBond.prototype.currentValue = function () {
  if (this.isMature()) {
    return this.matureValue
  } else {
    var elapsed = this.today.getTime() - this.startDate.getTime()
    var termDuration = this.matureDate().getTime() - this.startDate.getTime()

    return Math.round(this.matureValue * (elapsed / termDuration))
  }
}

// Тесты
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    this.subject = new SavingsBond(
      new Date(2000, 5, 15),
      1000,
      10
    )
  },
  whenMatureCurrentValueIsMatureValue: function () {
    td.when(td.replace(this.subject, 'isMature')()).thenReturn(true)

    var result = this.subject.currentValue()

    assert.equal(result, 1000)
  },
  whenImmatureCurrentValueIsProrated: function () {
    td.when(td.replace(this.subject, 'isMature')()).thenReturn(false)
    td.replace(this.subject, 'today', new Date(2005, 5, 15))

    var result = this.subject.currentValue()

    assert.equal(result, 500)
  },
  afterEach: function () {
    td.reset()
  }
}

// Фейковая реализация
SavingsBond.prototype.isMature = function () {
  return this.matureDate.getTime() - Date.now() > 0
}

SavingsBond.prototype.matureDate = function () {
  return new Date(this.startDate.getTime() + this.termInMs())
}

SavingsBond.prototype.termInMs = function () {
  return this.termInYears * 365.25 * 24 * 60 * 60 * 1000
}

