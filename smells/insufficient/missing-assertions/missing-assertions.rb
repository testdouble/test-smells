require "helper"

# Subject under test
def fetch(id)
  item = find(id)
  item.last_accessed_at = Time.new
  return item
end

# Test
class MissingAssertions < SmellTest
  def test_gets_the_item
    result = fetch(42)

    assert_equal "Fred", result.name
  end
end

# Fake production implementations to simplify example test of subject
def find(id)
  if id == 42
    OpenStruct.new(name: "Fred")
  end
end
