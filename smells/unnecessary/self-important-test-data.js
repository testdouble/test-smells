/* Smell: Self-important Test Data
 *
 * The fact the algorithm is wrong is probably lost on us, becuase creating and
 * reading the test data (whether literally in the test or in messages produced
 * by it) drains enough cognition that we might run out of energy to focus on
 * the proper math.
 */

// Subject under test
var inside = require('point-in-polygon')
function isGpsWithinLocation (gps, location) {
  var polygon = polygonForZip(location.zip)

  return inside([gps.lat, gps.lng], polygon)
}

// Test
module.exports = {
  gpsInsideLocation: function () {
    var gps = {
      lat: 43,
      lng: -77,
    }
    var location = {
      zip: 43221
    }

    var result = isGpsWithinLocation(gps, location)

    assert.equal(result, true)
  },
  gpsNotInsideLocation: function () {
    var gps = {
      lat: 41,
      lng: -82,
    }
    var location = {
      zip: 43221
    }

    var result = isGpsWithinLocation(gps, location)

    assert.equal(result, false)
  }
}

// Fake production implementations to simplify example test of subject
function polygonForZip (zip) {
  return [[45,-80],[40,-76],[40,-71],[45,-75]]
}
