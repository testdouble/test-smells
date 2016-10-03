# Subject under test
def gps_within_location?(gps, location)
  boundaries = boundaries_for_zip(location.zip)

  boundaries.northWest.lat >= gps.lat &&
    boundaries.southEast.lat <= gps.lat &&
    boundaries.northEast.lng >= gps.lng &&
    boundaries.southWest.lng <= gps.lng
end

# Test
class SelfImportantTestData < SmellTest
  def test_gps_inside_location
    gps = OpenStruct.new(
      altitude: 3000,
      course: 3.62,
      horizontalAccuracy: 10,
      lat: 43,
      lng: -77,
      secondsSinceLastUpdate: 4,
      speed: 3,
      utcOfLastFix: 180145,
      verticalAccuracy: 15
    )
    location = OpenStruct.new(
      name: 'Cup O Joe',
      streetLine1: '8312 Mulberry St',
      streetLine2: 'Lot #326 c/o very detailed test data',
      city: 'Grandview Heights',
      state: 'OH',
      stateFullName: 'Ohio',
      zip: 43221,
      zipPlus4: 8312
    )

    result = gps_within_location?(gps, location)

    assert_equal true, result
  end

  def test_gps_not_inside_location
    gps = OpenStruct.new(
      altitude: 4000,
      course: 14.18,
      horizontalAccuracy: 5,
      lat: 48,
      lng: -77,
      secondsSinceLastUpdate: 2,
      speed: 1,
      utcOfLastFix: 141445,
      verticalAccuracy: 25
    )
    location = OpenStruct.new(
      name: 'J.F.K Elementary School',
      streetLine1: '1438 Soledad St',
      streetLine2: nil,
      city: 'Columbus',
      state: 'OH',
      stateFullName: 'Ohio',
      zip: 43221,
      zipPlus4: 4294
    )

    result = gps_within_location?(gps, location)

    assert_equal false, result
  end
end

# Fake production implementations to simplify example test of subject
def boundaries_for_zip(zip)
  OpenStruct.new(
    northWest: OpenStruct.new(lat: 45, lng: -80),
    southWest: OpenStruct.new(lat: 40, lng: -80),
    southEast: OpenStruct.new(lat: 40, lng: -75),
    northEast: OpenStruct.new(lat: 45, lng: -75)
  )
end
