/* Smell: Surreal tests
 */

// Subject under test
var _ = require('lodash')
function weighClothes (clothes) {
  return Math.round(_.sumBy(clothes, function (item) {
    return item.weight()
  }))
}

// Test
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    td.replace(factors, 'size')
    td.when(factors.size('S')).thenReturn(9)
  },
  addsWeights: function () {
    var smallWetSock = new Clothing('S', 'sock', 'wet')
    var largeDryJacket = new Clothing('L', 'jacket', 'dry')
    td.when(td.replace(largeDryJacket, 'weight')()).thenReturn(8)
    var xlSoakedPants = td.object(['weight'])
    td.when(xlSoakedPants.weight()).thenReturn(15)

    var result = weighClothes([smallWetSock, largeDryJacket, xlSoakedPants])

    assert.equal(result, 26)
  },
  afterEach: function () {
    td.reset()
  }
}

// Fake production implementations to simplify example test of subject
function Clothing (size, type, wetness) {
  this.size = size
  this.type = type
  this.wetness = wetness
}
Clothing.prototype.weight = function () {
  return 1 *
    factors.size(this.size) *
    factors.type(this.type) *
    factors.wetness(this.wetness)
}

var factors = {
  size: function (size) {
    switch (size) {
      case 'S':
        return 0.75
      case 'M':
        return 1
      case 'L':
        return 1.25
      case 'XL':
        return 1.5
      default:
        return 1
    }
  },
  type: function (type) {
    switch (type) {
      case 'sock':
        return 0.2
      case 'shirt':
        return 1
      case 'pants':
        return 2
      case 'jacket':
        return 3
      default:
        return 1
    }
  },
  wetness: function (wetness) {
    switch (wetness) {
      case 'dry':
        return 1
      case 'moist':
        return 1.1
      case 'wet':
        return 1.6
      case 'soaked':
        return 2.5
      default:
        return 1
    }
  }
}

