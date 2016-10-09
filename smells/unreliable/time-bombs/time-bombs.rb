# Subject under test
require 'bigdecimal'
require 'bigdecimal/util'

class TimeCard
  attr_reader :start_time, :end_time

  def initialize(hourly_wage)
    @hourly_wage = hourly_wage
  end

  def punch_in(at = nil)
    @start_time = at || Time.new
  end

  def punch_out(at = nil)
    @end_time = at || Time.new
  end

  def wage_owed
    seconds = (@end_time || Time.new) - @start_time
    hours = seconds / (60 * 60).to_d
    bonus = worked_on_weekend? ? 1.5 : 1

    @hourly_wage * hours * bonus
  end
end

# Test
class TimeBombs < SmellTest
  def setup
    @subject = TimeCard.new(15)
    @now = Time.new
    super
  end

  def test_punch_in_defaults_to_now
    @subject.punch_in

    assert_equal @subject.start_time.to_ms, @now.to_ms
  end

  def test_calculates_wage_owed
    @subject.punch_in(@now)
    @subject.punch_out(@now + (60 * 60 * 24))

    result = @subject.wage_owed

    assert_equal 360, result.to_i
  end
end

# Fake production implementations to simplify example test of subject
class TimeCard
  def worked_on_weekend?
    return @start_time.wday === 0 ||
      @start_time.wday === 6 ||
      @end_time.wday === 0 ||
      @end_time.wday === 6
  end
end
