# Subject under test
require "time"

class SavingsBond
  def initialize(start_date, mature_value, term_in_years)
    @start_date = start_date
    @mature_value = mature_value
    @term_in_years = term_in_years
  end

  def current_value
    if mature?
      @mature_value
    else
      elapsed = today - @start_date
      term_duration = mature_date - @start_date

      (@mature_value * (elapsed / term_duration)).round
    end
  end
end

# Test

class ContaminatedTestSubject < SmellTest
  def setup
    @subject = SavingsBond.new(
      Time.new(2000, 5, 15),
      1000,
      10
    )
  end

  def test_when_mature_current_value_is_mature_value
    stub(@subject, :mature?, true)

    result = @subject.current_value

    assert_equal 1000, result
  end

  def test_when_immature_current_value_is_prorated
    stub(@subject, :mature?, false)
    stub(@subject, :today, Time.new(2005, 5, 15))

    result = @subject.current_value

    assert_equal 500, result
  end
end

# Fake production implementations to simplify example test of subject
class SavingsBond
  def mature?
    mature_date - Time.new > 0
  end

  def mature_date
    @start_date + term_in_seconds
  end

  def term_in_seconds
    @term_in_years * 365.25 * 24 * 60 * 60
  end

  def today
    Time.new
  end
end
