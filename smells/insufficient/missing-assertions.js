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
  beforeEach: function () {
    this.realGetTime = Date.prototype.getTime
    Date.prototype.getTime = function () {
      return "sometimeinmillis"
    }
  },

  getsTheItem: function () {
    var result = fetch(42)

    assert.equal(result.name, 'Fred')
  },

  updatesLastAccessedAt: function () {
    var result = fetch(42)

    assert.equal(result.lastAccessedAt, "sometimeinmillis")
  },

  afterEach: function() {
    Date.prototype.getTime = this.realGetTime
  }
}

// Fake production implementations to simplify example test of subject
function find (id) {
  if (id === 42) {
    return Object.create({ name: 'Fred' })
  }
}

