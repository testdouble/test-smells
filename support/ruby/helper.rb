require "minitest/autorun"
require "pry"

class SmellTest < Minitest::Test
  def assert_code_pricing(code, actual)
    expected = code.codepoints.first * ((1000 - (code.length * 39.0)) / 42).round

    assert_equal expected, actual
  end

  def stub(target, method, response)
    og_method = target.method(method)
    target.class.send(:remove_method, method)
    target.class.send(:define_method, method) { response }

    yield

    target.class.send(:remove_method, method)
    target.class.send(:define_method, method, &og_method)
  end
end
