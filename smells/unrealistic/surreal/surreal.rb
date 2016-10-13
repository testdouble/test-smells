# Subject under test
def weigh_clothes(clothes)
  clothes.map { |item| item.weight }.reduce(:+).round
end

# Test
class Surreal < SmellTest
  def setup
    stub(FACTORS, :size, 9, ["S"])
    super
  end

  def test_adds_weights
    small_wet_sock = Clothing.new("S", "sock", "wet")
    large_dry_jacket = Clothing.new("L", "jacket", "dry")
    stub(large_dry_jacket, :weight, 8)
    xl_soaked_pants = OpenStruct.new(weight: 15)

    result = weigh_clothes([small_wet_sock, large_dry_jacket, xl_soaked_pants])

    assert_equal 26, result
  end
end

# Fake production implementations to simplify example test of subject
class Clothing
  def initialize(size, type, wetness)
    @size = size
    @type = type
    @wetness = wetness
  end

  def weight
    return 1 *
      FACTORS.size(@size) *
      FACTORS.type(@type) *
      FACTORS.wetness(@wetness)
  end
end

class Factors
  def size(size)
    case size
    when "S" then 0.75
    when "M" then 1
    when "L" then 1.25
    when "XL" then 1.5
    else 1
    end
  end

  def type(type)
    case type
    when "sock" then 0.2
    when "shirt" then 1
    when "pants" then 2
    when "jacket" then 3
    else 1
    end
  end

  def wetness(wetness)
    case wetness
    when "dry" then 1
    when "moist" then 1.1
    when "wet" then 1.6
    when "soaked" then 2.5
    else 1
    end
  end
end
FACTORS = Factors.new
