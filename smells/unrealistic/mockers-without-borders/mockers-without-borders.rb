# Subject under test
class App
  def pay_merchants(start_date, end_date)
    transactions = fetch(start_date, end_date)
    purchase_orders = create_purchase_orders(group_by_merchant(transactions))
    submit(purchase_orders)
  end
end

# Test
class MockersWithoutBorders < SmellTest
  def setup
    @subject = App.new
    super
  end
  def test_pays_merchants_with_totals
    transactions = [
      { merchant: 'Nike', desc: 'Shoes', amount: 119.20 },
      { merchant: 'Nike', desc: 'Waterproof spray', amount: 10.10 },
      { merchant: 'Apple', desc: 'iPad', amount: 799.99 },
      { merchant: 'Apple', desc: 'iPad Cover', amount: 59.99 }
    ]
    start_date = Date.civil(2015, 1, 1)
    end_date = Date.civil(2015, 12, 31)

    stub(@subject, :fetch, transactions, [start_date, end_date]) do
      verify(@subject, :submit, [
        { merchant: 'Nike', total: 129.30 },
        { merchant: 'Apple', total: 859.98 }
      ]) do
          @subject.pay_merchants(start_date, end_date)
      end
    end
  end
end

# Fake production implementations to simplify example test of subject
class App
  def fetch(start_date, end_date)
    # Imagine something that hits a data store here
  end

  def group_by_merchant(transactions)
    transactions.group_by { |t| t[:merchant] }
  end

  def create_purchase_orders(transactions_by_merchant)
    transactions_by_merchant.map { |(merchant, transactions)|
      {
        merchant: merchant,
        total: transactions.map {|h| h[:amount] }.reduce(:+)
      }
    }
  end

  def submit(purchase_orders)
    # Imagine something that hits a payment processor here
  end
end
