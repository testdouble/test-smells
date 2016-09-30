require "helper"

# Subject under test
class ValidatesZip
  def initialize(repo)
    @repo = repo
  end

  def verify_cardholder_zip(card_id, zip)
    card = @repo.find(card_id)
    user = @repo.find(card.user_id)
    address = @repo.find(user.address_id)

    address.zip === zip
  end
end

# Test
class BuryTheLede < SmellTest
  def setup
    @repo = Repo.new

    @subject = ValidatesZip.new(@repo)
  end

  def test_true_if_zip_matches
    address = OpenStruct.new(street: "123 Sesame", city: "Cbus", state: "OH", zip: 42)
    @repo.save(address)
    user = OpenStruct.new(
      address_id: address.id,
      name: "Jane",
      age: 12,
      income: "$12.48"
    )
    @repo.save(user)
    issuer = OpenStruct.new(bank_name: "Bank Co")
    @repo.save(issuer)
    card = OpenStruct.new(
      user_id: user.id,
      apr: 17.8,
      number: "1234 0000 2828 4494",
      ccv: 364,
      issuer_id: issuer.id
    )
    @repo.save(card)

    result = @subject.verify_cardholder_zip(card.id, 42)

    assert_equal true, result
  end
end

# Fake production implementations to simplify example test of subject
class Repo
  def initialize
    @items = {}
    @next_id = 1
  end

  def save(obj)
    obj.id = (@next_id += 1) unless obj.id

    # Gotcha!
    validate_address!(obj) if obj.zip
    validate_user!(obj) if obj.address_id
    validate_card!(obj) if obj.user_id

    @items[obj.id] = obj
  end

  def find(id)
    @items[id]
  end

  private

  def validate_address!(address)
    require_properties!(address, [:street, :city, :state])
  end

  def validate_user!(user)
    require_properties!(user, [:name, :age, :income])
  end

  def validate_card!(card)
    require_properties!(card, [:apr, :number, :ccv])
    require_relation!(card, :issuer_id, :bank_name)
  end

  def require_properties!(obj, props)
    props.each do |prop|
      if obj.method(prop).nil? || obj.send(prop).nil?
        raise "Error: \"#{prop}\" required on #{obj}"
      end
    end
  end

  def require_relation!(obj, id_key, prop)
    relation = find(obj[id_key])
    if relation.nil? || relation.send(prop).nil?
      binding.pry
      raise "Error: \"#{prop}\" required on \"#{id_key}\" of \"#{obj}\""
    end
  end

end
