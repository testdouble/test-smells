# Subject under test
$all_time_logins = 0
class Game
  def self.instance
    @game ||= new
  end

  def initialize
    @players = []
  end

  def add_player(name)
    @players << name
    $all_time_logins += 1
  end

  def player_count
    @players.size
  end
end

# Test
class LitterBugs < SmellTest
  def setup
    @game = Game.instance
  end

  def test_login_one_player
    @game.add_player("Joe")

    assert_equal 1, @game.player_count
    assert_equal 1, $all_time_logins
  end

  def test_login_two_players
    @game.add_player("Jane")
    @game.add_player("Stef")

    assert_equal 3, @game.player_count
    assert_equal 3, $all_time_logins
  end
end

