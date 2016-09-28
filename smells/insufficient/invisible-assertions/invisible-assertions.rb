require "helper"

# Subject under test
def is_21?(person)
  if person.age < 21
    raise "Sorry, adults only!"
  end
end

# Test
class InvisibleAssertions < SmellTest
  def test_is_21
    person = OpenStruct.new(age: 21)

    is_21?(person)
  end

  def test_is_under_age
    person = OpenStruct.new(age: 20)

    assert_raises { is_21?(person) }
  end
end
