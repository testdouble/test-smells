// Subject under test
var App = {}

App.payMerchants = function (startDate, endDate) {
  var transactions = App.fetch(startDate, endDate)
  var purchaseOrders = App.createPurchaseOrders(App.groupByMerchant(transactions))
  App.submit(purchaseOrders)
}

// Test
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    td.replace(App, 'fetch')
    td.replace(App, 'submit')
  },
  paysMerchantsWithTotals: function () {
    var transactions = [
      {merchant: 'Nike', desc: 'Shoes', amount: 119.20},
      {merchant: 'Nike', desc: 'Waterproof spray', amount: 10.10},
      {merchant: 'Apple', desc: 'iPad', amount: 799.99},
      {merchant: 'Apple', desc: 'iPad Cover', amount: 59.99}
    ]
    var startDate = new Date(2015, 0, 1)
    var endDate = new Date(2015, 11, 31)
    td.when(App.fetch(startDate, endDate)).thenReturn(transactions)

    App.payMerchants(startDate, endDate)

    td.verify(App.submit([
      {merchant: 'Nike', total: 129.30},
      {merchant: 'Apple', total: 859.98}
    ]))
  },
  afterEach: function () {
    td.reset()
  }
}

// Fake production implementations to simplify example test of subject
var _ = require('lodash')

App.fetch = function (startDate, endDate) {
  // Imagine something that hits a data store here
}

App.groupByMerchant = function (transactions) {
  return _.groupBy(transactions, 'merchant')
}

App.createPurchaseOrders = function (transactionsByMerchant) {
  return _.map(transactionsByMerchant, function (transactions, merchant) {
    return {
      merchant: merchant,
      total: _.sumBy(transactions, 'amount')
    }
  })
}

App.submit = function (purchaseOrders) {
  // Imagine something that hits a payment processor here
}
