# Subject under test
class Financials

  def initialize(repo)
    @repo = repo
  end

  def annual_profit(year)
    (1..12).map { |month|
      monthly_profit(year, month)
    }.compact.reduce(:+)
  end

  def monthly_profit(year, month)
    (1..31).map { |day|
      daily_profit(year, month, day)
    }.compact.reduce(:+)
  end

  def daily_profit(year, month, day)
    transactions = @repo.find(year: year, month: month, day: day)
    transactions.map { |transaction|
      transaction_profit(transaction)
    }.compact.reduce(:+)
  end

  def transaction_profit(transaction)
    (transaction.price - transaction.cost).round
  end
end

# Test
class SevenLayerTesting < SmellTest
  def setup
    @repo = Repo.new
    @subject = Financials.new(@repo)
    super
  end

  def test_computes_annual_profit
    @repo.save_transactions([
      {year: 2016, month: 3, day: 14, price: 55.44, cost: 80.30},
      {year: 2016, month: 6, day: 20, price: 9.33, cost: 4.00},
      {year: 2016, month: 12, day: 31, price: 112.48, cost: 100.24},
      # Bad year:
      {year: 2015, month: 3, day: 14, price: 999, cost: 0}
    ])

    result = @subject.annual_profit(2016)

    assert_equal (-8), result
  end

  def test_computes_monthly_profit
    @repo.save_transactions([
      {year: 2016, month: 5, day: 1, price: 108.99, cost: 70.45},
      {year: 2016, month: 5, day: 15, price: 208.13, cost: 133.55},
      {year: 2016, month: 5, day: 31, price: 90.00, cost: 80.03},
      # Bad month:
      {year: 2016, month: 6, day: 14, price: 999, cost: 0}
    ])

    result = @subject.monthly_profit(2016, 5)

    assert_equal 124, result
  end

  def test_computes_daily_profit
    @repo.save_transactions([
      {year: 2016, month: 5, day: 12, price: 19.44, cost: 18.11},
      {year: 2016, month: 5, day: 12, price: 21.40, cost: 22.01},
      {year: 2016, month: 5, day: 12, price: 998.10, cost: 907.20},
      # Bad day:
      {year: 2016, month: 5, day: 1, price: 999, cost: 0}
    ])

    result = @subject.daily_profit(2016, 5, 12)

    assert_equal 91, result
  end

  def test_computes_transaction_profit
    transaction = OpenStruct.new(price: 33.22, cost: 20.11)

    result = @subject.transaction_profit(transaction)

    assert_equal 13, result
  end

  # Fake production implementations to simplify example test of subject
  class Repo
    def initialize
      @transactions = []
    end

    def save_transactions(transactions)
      @transactions.push(*transactions.map { |hash| OpenStruct.new(hash) })
    end

    def find(criteria)
      @transactions.select { |transaction|
        criteria.all? { |(name, value)|
          transaction.send(name) == value
        }
      }
    end
  end
end
