/* Запах: 7-layer testing
 *
 *
 * Challenges:
 *   - Now move the rounding to the top-level and out of each transaction
 *   - only search for valid days in month (e.g. 28 in feb or 29 in leap years)
 */

// Тестируемый модуль
var _ = require('lodash')
function annualProfit (year) {
  return _.sumBy(_.range(1, 13), function (month) {
    return monthlyProfit(year, month)
  })
}

function monthlyProfit (year, month) {
  return _.sumBy(_.range(1, 32), function (day) {
    return dailyProfit(year, month, day)
  })
}

function dailyProfit (year, month, day) {
  var transactions = repo.find({year: year, month: month, day: day})
  return _.sumBy(transactions, function (transaction) {
    return transactionProfit(transaction)
  })
}

function transactionProfit (transaction) {
  return Math.round(transaction.price - transaction.cost)
}

// Тесты
module.exports = {
  computesAnnualProfit: function () {
    repo.saveTransactions([
      {year: 2016, month: 3, day: 14, price: 55.44, cost: 80.30},
      {year: 2016, month: 6, day: 20, price: 9.33, cost: 4.00},
      {year: 2016, month: 12, day: 31, price: 112.48, cost: 100.24},
      // Bad year:
      {year: 2015, month: 3, day: 14, price: 999, cost: 0}
    ])

    var result = annualProfit(2016)

    assert.equal(result, -8)
  },
  computesMonthlyProfit: function () {
    repo.saveTransactions([
      {year: 2016, month: 5, day: 1, price: 108.99, cost: 70.45},
      {year: 2016, month: 5, day: 15, price: 208.13, cost: 133.55},
      {year: 2016, month: 5, day: 31, price: 90.00, cost: 80.03},
      // Bad month:
      {year: 2016, month: 6, day: 14, price: 999, cost: 0}
    ])

    var result = monthlyProfit(2016, 5)

    assert.equal(result, 124)
  },
  computesDailyProfit: function () {
    repo.saveTransactions([
      {year: 2016, month: 5, day: 12, price: 19.44, cost: 18.11},
      {year: 2016, month: 5, day: 12, price: 21.40, cost: 22.01},
      {year: 2016, month: 5, day: 12, price: 998.10, cost: 907.20},
      // Bad day:
      {year: 2016, month: 5, day: 1, price: 999, cost: 0}
    ])

    var result = dailyProfit(2016, 5, 12)

    assert.equal(result, 91)
  },
  computesTransactionProfit: function () {
    var transaction = {price: 33.22, cost: 20.11}

    var result = transactionProfit(transaction)

    assert.equal(result, 13)
  },
  afterEach: function () {
    repo.reset()
  }
}

// Фейковая реализация
var repo = {
  __transactions: [],
  reset: function () {
    repo.__transactions = []
  },
  saveTransactions: function (transactions) {
    repo.__transactions.push.apply(repo.__transactions, transactions)
  },
  find: function (criteria) {
    return _.filter(repo.__transactions, criteria)
  }
}
