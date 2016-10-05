# Subject under test
class SeatMap
  def initialize(ticket, original_seat)
    @fare_class = ticket.fare_class
    @current_seat = original_seat
  end

  def moveTo(new_seat)
    raise "No seat selected" unless new_seat
    raise "Invalid seat selected" unless /^\d\d?[A-J]$/.test(new_seat)

    if qualify_fare_class_for_seat(new_seat)
      @current_seat = new_seat
    else
      raise Error "Seat not available for ticket's fare class"
    end
  end

  private

  # Private API! Don't call this!
  def qualify_fare_class_for_seat(seat)
    return unless seat

    if row_match = seat.match(/^(\d+)/)
      row = row_match[0].to_i
      row > 10
    end
  end
end

# Test
class InvasionOfPrivacy < SmellTest
  def setup
    @ticket = OpenStruct.new(fare_class: "M")
    @subject = SeatMap.new(@ticket, "18D")
    super
  end

  def test_ensure_seat_not_null
    result = @subject.send(:qualify_fare_class_for_seat, nil)

    refute result
  end

  def test_do_not_break_if_seat_lacks_a_row_number
    result = @subject.send(:qualify_fare_class_for_seat, "A")

    refute result
  end

  def test_approve_if_behind_row_ten
    result = @subject.send(:qualify_fare_class_for_seat, "11B")

    assert_equal true, result
  end

  def test_deny_if_ahead_of_row_ten
    result = @subject.send(:qualify_fare_class_for_seat, "9J")

    refute result
  end
end
