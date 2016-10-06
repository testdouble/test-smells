# Subject under test
class MutableSeatMap
  attr_reader :approvals, :current_seat

  def initialize(ticket, original_seat)
    @fare_class = ticket.fare_class
    @current_seat = original_seat
    @approvals = {}
  end

  def move_to(new_seat)
    if !@approvals[@fare_class] || !@approvals[@fare_class][new_seat]
      qualify_fare_class_for_seat!(new_seat)
    end

    if @approvals[@fare_class][new_seat]
      @current_seat = new_seat
    end
  end
end

# Test
class XRaySpecs < SmellTest
  def setup
    @ticket = OpenStruct.new(fare_class: "M")
    @subject = MutableSeatMap.new(@ticket, "18D")
    super
  end

  def test_approve_if_behind_row_ten
    @subject.move_to("11B")

    assert_equal true, @subject.approvals["M"]["11B"]
    assert_equal "11B", @subject.current_seat, "11B"
  end

  def test_deny_if_ahead_of_row_ten
    @subject.move_to("9J")

    assert_equal false, @subject.approvals["M"]["9J"]
    assert_equal "18D", @subject.current_seat
  end

  def test_will_short_circuit_approval_process_when_memoized
    @subject.approvals["M"] = {"Havanna" => "Sure, why not"}

    @subject.move_to("Havanna")

    assert_equal "Sure, why not", @subject.approvals["M"]["Havanna"]
    assert_equal "Havanna", @subject.current_seat
  end
end

# Fake production implementations to simplify example test of subject
class MutableSeatMap
  def qualify_fare_class_for_seat!(seat)
    allowed = seat.match(/^(\d+)/)[0].to_i > 10
    @approvals[@fare_class] ||= {}
    @approvals[@fare_class][seat] = allowed
  end
end


