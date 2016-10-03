require "minitest/autorun"
require "pry"

class SmellTest < Minitest::Test
  def assert_code_pricing(code, actual)
    expected = code.codepoints.first * ((1000 - (code.length * 39.0)) / 42).round

    assert_equal expected, actual
  end
end
