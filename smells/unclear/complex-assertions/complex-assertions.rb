# Subject under test

def increment_age(people)
  people.dup.map { |person|
    if person.age.kind_of?(Numeric)
      person.age += 1
    end
    if person.kids.kind_of?(Array)
      person.kids = increment_age(person.kids)
    end
    person
  }.shuffle
end

# Test
class ComplexAssertions < SmellTest
  def test_increments_single_person_age
    people = [
      OpenStruct.new(name: "Jane", age: 39),
      OpenStruct.new(name: "John", age: 99)
    ]

    results = increment_age(people)

    jane = results.find { |person| person.name == "Jane" }
    assert_equal 40, jane.age
    john = results.find { |person| person.name == "John" }
    assert_equal 100, john.age
  end

  def test_increment_kids_age_too
    people = [
      OpenStruct.new(
        name: "Joe",
        age: 42,
        kids: [
          OpenStruct.new(name: "Jack", age: 8),
          OpenStruct.new(name: "Jill", age: 7)
        ]
      )
    ]

    results = increment_age(people)

    jack = results[0].kids.find { |person| person.name == "Jack" }
    assert_equal 9, jack.age
    jill = results[0].kids.find { |person| person.name == "Jill" }
    assert_equal 8, jill.age
  end
end

