/* Запах: Litter Bugs
 */

// Тестируемый модуль
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

// Тесты
var game = new Game()
module.exports = {
  loginOnePlayer: function () {
    game.addPlayer('Joe')

    assert.equal(game.playerCount(), 1)
    assert.equal(allTimeLogins, 1)
  },
  loginTwoPlayers: function () {
    game.addPlayer('Jane')
    game.addPlayer('Stef')

    assert.equal(game.playerCount(), 3)
    assert.equal(allTimeLogins, 3)
  }
}
