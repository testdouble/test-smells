# Subject under test
def rank_hotel_review(user, title, text, stars)
  rank = 10
  rank -= 3 unless user.logged_in
  rank += 10 if stars == 5 || stars == 1
  if rank > 1 && obscene?(title)
    raise "Underage swearing!" unless user.age > 13
    rank = 1
  elsif rank > 3 && obscene?(text)
    rank = 3 unless user.occupation == "sailor"
  end
  return rank
end

# Test
class Quixotic < SmellTest
  def test_5_star_member
    user = OpenStruct.new(logged_in: true)

    result = rank_hotel_review(user, "title", "body", 5)

    assert_equal 20, result
  end

  def test_3_star_anonymous
    user = OpenStruct.new(logged_in: false)

    result = rank_hotel_review(user, "title", "body", 3)

    assert_equal 7, result
  end
end

# Fake production implementations to simplify example test of subject
def obscene?(text)
  text.include?("obscenities")
end
