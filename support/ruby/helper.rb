require "minitest/autorun"
require "pry"

class SmellTest < Minitest::Test
  def initialize(*args)
    @on_teardowns = []
    super
  end

  def teardown
    @on_teardowns.each(&:call)
    super
  end

  def assert_code_pricing(code, actual)
    expected = code.codepoints.first * ((1000 - (code.length * 39.0)) / 42).round

    assert_equal expected, actual
  end

  def stub(target, method, response, expected_args = [])
    og_method = target.class.instance_method(method)
    target.class.send(:remove_method, method)
    target.class.send(:define_method, method) { |*actual_args, &blk|
      if target == self && (!expected_args || expected_args == actual_args)
        response
      else
        og_method.bind(self).call(*actual_args, &blk)
      end
    }

    on_teardown do
      target.class.send(:remove_method, method)
      target.class.send(:define_method, method, og_method)
    end
  end

  def verify(target, method, expected_args)
    og_method = target.class.instance_method(method)
    actual_arg_sets = []
    target.class.send(:remove_method, method)
    target.class.send(:define_method, method) { |actual_args|
      actual_arg_sets << actual_args
    }

    on_teardown do
      target.class.send(:remove_method, method)
      target.class.send(:define_method, method, og_method)
      if !actual_arg_sets.include?(expected_args)
        raise <<-MSG.gsub(/^ {10}/,'')
          Expected #{target.class}##{method} to have been called with #{expected_args},
          but #{actual_arg_sets.empty? ? "was never called." : "was called with:" }
          #{actual_arg_sets.each_with_index.map { |a,i| "  #{i+1}.) #{a}" }.join("\n")}
        MSG
      end
    end
  end

  private

  def on_teardown(&blk)
    @on_teardowns << blk
  end
end
