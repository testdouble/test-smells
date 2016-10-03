# Subject under test
class AddressController
  def initialize(repo)
    @repo = repo
  end

  def create(current_user, address_params)
    address = @repo.save(address_params)
    current_user.addresses.push(address)
  end

  def read(current_user, address_id)
    address = current_user.addresses.find { |a| a.id == address_id }
    @repo.find(address.id)
  end

  def update(current_user, address_params)
    address = current_user.addresses.find { |a| a.id == address_params[:id] }

    @repo.save(address.tap {|a|
      address_params.each do |(k,v)|
        a[k] = v
      end
    })
  end

  def destroy(current_user, address_id)
    address = current_user.addresses.find { |a| a.id == address_id }
    @repo.destroy(address.id)
    current_user.addresses = current_user.addresses.reject {|a| a.id == address.id }
  end
end

# Test
class TestByNumber < SmellTest
  def setup
    @repo = Repo.new
    @subject = AddressController.new(@repo)
    super
  end

  def test_create
    user = @repo.save(OpenStruct.new(name: 'Jane', addresses: []))
    address_params = OpenStruct.new(street: 'some street')

    @subject.create(user, address_params)

    address = @repo.find(address_params.id)
    assert_equal "some street", address.street
    assert_equal address, user.addresses[0]
  end

  def test_read
    address = @repo.save(OpenStruct.new(street: 'a street'))
    user = @repo.save(OpenStruct.new(name: 'Joe', addresses: [address]))

    result = @subject.read(user, address.id)

    assert_equal address, result
  end

  def test_update
    address = @repo.save(OpenStruct.new(street: 'no street', zip: '12345'))
    user = @repo.save(OpenStruct.new(name: 'Jill', addresses: [address]))

    @subject.update(user, {
      id: address.id,
      street: 'the street'
    })

    address = @repo.find(address.id)
    assert_equal "the street", address.street
    assert_equal "12345", address.zip
  end

  def test_destroy
    address = @repo.save(OpenStruct.new(street: 'foo street'))
    user = @repo.save(OpenStruct.new(name: 'Gene', addresses: [address]))

    @subject.destroy(user, address.id)

    assert_equal nil, @repo.find(address.id)
    assert_equal 0, user.addresses.length
  end

  # Fake production implementations to simplify example test of subject
  class Repo
    def initialize
      @items = {}
      @next_id = 1
    end

    def save(item)
      item.id = item.id || @next_id += 1
      @items[item.id] = item
      return item
    end

    def find(item_id)
      @items[item_id]
    end

    def destroy(item_id)
      @items.delete(item_id)
    end
  end
end
