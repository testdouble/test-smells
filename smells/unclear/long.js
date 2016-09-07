/* Длинные тесты
 */

// Тестируемый модуль
function Stack () {
  this.items = []
}
Stack.prototype.push = function (item) { this.items.push(item) }
Stack.prototype.pop = function () { return this.items.pop() }
Stack.prototype.peek = function () { return this.items[this.items.length - 1] }
Stack.prototype.depth = function () { return this.items.length }

// Тесты
module.exports = {
  makeSureEverythingWorks: function () {
    var subject = new Stack()

    // Тесты Push
    subject.push('A')
    subject.push('B')
    subject.push('C')

    assert.equal(subject.pop(), 'C')
    assert.equal(subject.pop(), 'B')
    assert.equal(subject.pop(), 'A')

    // Тесты Peek
    subject.push('D')
    subject.push('E')

    assert.equal(subject.peek(), 'E')

    subject.pop()

    assert.equal(subject.peek(), 'D')

    subject.pop()

    // Тесты Depth
    subject.push('F')
    subject.push('G')

    assert.equal(subject.depth(), 2)

    // Тесты Pop
    subject.pop()
    subject.pop()

    assert.equal(subject.depth(), 0)
    assert.equal(subject.pop(), undefined)
  }
}
