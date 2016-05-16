var path = require('path')

throw 'Sorry, this module is not designed to be required! Run this instead:\n\n' +
      ' $ cd "' + path.resolve(__dirname, '..') + '"\n' +
      ' $ npm test\n\n'
