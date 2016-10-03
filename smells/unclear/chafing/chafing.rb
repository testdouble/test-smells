# Subject under test
def pricing_for_code(code)
  first_factor = 0
  first_factor = 65 if code[0] == 'A'
  first_factor = 55 if code[0] == '7'
  first_factor = 40 if code[0] == '('

  second_factor = 0
  second_factor = 21 if code.size == 3
  second_factor = 19 if code.size == 5
  second_factor = 16 if code.size == 8

  return first_factor * second_factor
end

# Test
require_relative "../../../support/ruby/generate_code"

class Chafing < SmellTest
  def test_code_one_is_correct
    code = GenerateCode.one()

    result = pricing_for_code(code)

    assert_code_pricing code, result
  end

  def test_code_two_is_correct
    code = GenerateCode.two()

    result = pricing_for_code(code)

    assert_code_pricing code, result
  end

  def test_code_three_is_correct
    code = GenerateCode.three()

    result = pricing_for_code(code)

    assert_code_pricing code, result
  end
end

