/* Smell: Missing Assertions
 */

// Subject under test
function fetch (id) {
  var item = find(id)
  item.lastAccessedAt = new Date().getTime()
  return item
}

// Test
module.exports = {
  getsTheItem: function () {
    var result = fetch(42)

    assert.equal(result.name, 'Fred')
  }
}

// Fake production implementations to simplify example test of subject
function find (id) {
  if (id === 42) {
    return Object.create({ name: 'Fred' })
  }
}

