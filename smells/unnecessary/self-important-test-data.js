/* Self-important Test Data
 *
 * The fact the algorithm is wrong is probably lost on us, becuase creating and
 * reading the test data (whether literally in the test or in messages produced
 * by it) drains enough cognition that we might run out of energy to focus on
 * the proper math.
 */

// Тестируемый модуль
function isGpsWithinLocation (gps, location) {
  var boundaries = boundariesForZip(location.zip)
  return boundaries.northWest.lat >= gps.lat &&
         boundaries.southEast.lat <= gps.lat &&
         boundaries.northEast.lng >= gps.lng &&
         boundaries.southWest.lng <= gps.lng
}

// Тесты
module.exports = {
  gpsInsideLocation: function () {
    var gps = {
      altitude: 3000,
      course: 3.62,
      horizontalAccuracy: 10,
      lat: 43,
      lng: -77,
      secondsSinceLastUpdate: 4,
      speed: 3,
      utcOfLastFix: 180145,
      verticalAccuracy: 15
    }
    var location = {
      name: 'Cup O Joe',
      streetLine1: '8312 Mulberry St',
      streetLine2: 'Lot #326 c/o very detailed test data',
      city: 'Grandview Heights',
      state: 'OH',
      stateFullName: 'Ohio',
      zip: 43221,
      zipPlus4: 8312
    }

    var result = isGpsWithinLocation(gps, location)

    assert.equal(result, true)
  },
  gpsNotInsideLocation: function () {
    var gps = {
      altitude: 4000,
      course: 14.18,
      horizontalAccuracy: 5,
      lat: 48,
      lng: -77,
      secondsSinceLastUpdate: 2,
      speed: 1,
      utcOfLastFix: 141445,
      verticalAccuracy: 25
    }
    var location = {
      name: 'J.F.K Elementary School',
      streetLine1: '1438 Soledad St',
      streetLine2: null,
      city: 'Columbus',
      state: 'OH',
      stateFullName: 'Ohio',
      zip: 43221,
      zipPlus4: 4294
    }

    var result = isGpsWithinLocation(gps, location)

    assert.equal(result, false)
  }
}

// Фейковая реализация
function boundariesForZip (zip) {
  return {
    northWest: {lat: 45, lng: -80},
    southWest: {lat: 40, lng: -80},
    southEast: {lat: 40, lng: -75},
    northEast: {lat: 45, lng: -75}
  }
}
