# Subject under test
require "json"

# [Note: In production, this func will only ever be called by .csv_for below]
def escape_csv_string_value(value)
  if !value
    ""
  elsif !value.kind_of?(String)
    escape_csv_string_value(JSON.dump(value))
  elsif value.include?(",")
    "\"#{value.gsub(/"/, "\"\"")}\""
  else
    value
  end
end

# Test
class Paranoid < SmellTest
  def test_does_nothing_without_commas
    text = "hi my name is \"Todd\""

    result = escape_csv_string_value(text)

    assert_equal text, result
  end

  def test_wraps_comma_strings_with_double_quotes
    result = escape_csv_string_value("Hello, world.")

    assert_equal "\"Hello, world.\"", result
  end

  def test_double_quotes_in_comma_strings
    result = escape_csv_string_value("Hello, \"Todd\".")

    assert_equal "\"Hello, \"\"Todd\"\".\"", result
  end

  def test_ensure_not_null
    result = escape_csv_string_value(nil)

    assert_equal "", result
  end

  def test_coerce_number_to_string
    result = escape_csv_string_value(42)

    assert_equal "42", result
  end

  def test_coerce_object_to_string_and_escape_the_string
    result = escape_csv_string_value(name: "Jim", age: 64)

    assert_equal "\"{\"\"name\"\":\"\"Jim\"\",\"\"age\"\":64}\"", result
  end
end

# Fake production implementation to add context to the subject
def csv_for(value)
  if value.kind_of?(String)
    escape_csv_string_value(value)
  elsif value.kind_of?(Array)
    if value.any? { |item| item.kind_of?(Array) }
      value.map { |item| csv_for(item) }.join("\n")
    else
      value.map { |item| csv_for(item) }.join(",")
    end
  else
    value
  end
end

# Example use:
csv_for([["id", "name", "bio"], [1, "joe", "why, hello \"joe\"!"]])
# => 'id,name,bio\n1,joe,"why, hello ""joe""!"'
