/* Smell: Long tests
 */

// Subject under test
function Stack () {
  this.items = []
}
Stack.prototype.push = function (item) { this.items.push(item) }
Stack.prototype.pop = function () { return this.items.pop() }
Stack.prototype.peek = function () { return this.items[this.items.length - 1] }
Stack.prototype.depth = function () { return this.items.length }

// Test
var subject
module.exports = {
  beforeEach: function () {
    subject = new Stack()
  },

  pushStoresThingsPopCanPull: function () {
    subject.push('A')
    subject.push('B')
    subject.push('C')

    assert.equal(subject.pop(), 'C')
    assert.equal(subject.pop(), 'B')
    assert.equal(subject.pop(), 'A')
  },

  peekSeesTheTop: function () {
    subject.push('D')
    subject.push('E')

    assert.equal(subject.peek(), 'E')

    subject.pop()

    assert.equal(subject.peek(), 'D')
  },

  depthWorks: function () {
    subject.push('F')
    subject.push('G')

    assert.equal(subject.depth(), 2)
  },

  popPullsUndefinedWhenEmpty: function () {
    assert.equal(subject.depth(), 0)
    assert.equal(subject.pop(), undefined)
  }

}
