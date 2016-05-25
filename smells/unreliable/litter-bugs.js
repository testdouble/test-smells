/* Smell: Litter Bugs
 */

// Subject under test
var allTimeLogins = 0

function Game () {
  this.players = []
}

Game.prototype.addPlayer = function (name) {
  this.players.push(name)
  allTimeLogins++
}

Game.prototype.playerCount = function () {
  return this.players.length
}

// Test
var game;
module.exports = {
  beforeEach: function () {
    game = new Game()
    allTimeLogins = 0 // Who are you?! Clean it up first
  },
  loginTwoPlayers: function () {
    game.addPlayer('Jane')
    game.addPlayer('Stef')

    assert.equal(game.playerCount(), 2)
    assert.equal(allTimeLogins, 2)
  },
  loginOnePlayer: function () {
    game.addPlayer('Joe')

    assert.equal(game.playerCount(), 1)
    assert.equal(allTimeLogins, 1)
  }
}
