// Subject under test
function rankHotelReview (user, title, text, stars) {
  var rank = 10
  if (!user.loggedIn) rank -= 3
  if (stars === 5 || stars === 1) rank += 10
  if (rank > 1 && isObscene(title)) {
    if (user.age <= 13) throw new Error('Underage swearing!')
    rank = 1
  } else if (rank > 3 && isObscene(text)) {
    if (user.occupation !== 'sailor') rank = 3
  }
  return rank
}

// Test
module.exports = {
  fiveStarMember: function () {
    var user = {loggedIn: true}

    var result = rankHotelReview(user, 'title', 'body', 5)

    assert.equal(result, 20)
  },

  threeStarAnonymous: function () {
    var user = {loggedIn: false}

    var result = rankHotelReview(user, 'title', 'body', 3)

    assert.equal(result, 7)
  }
}

// Fake production implementations to simplify example test of subject
function isObscene (text) {
  return text.indexOf('obscenities') !== -1
}
