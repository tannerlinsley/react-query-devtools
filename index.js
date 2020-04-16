if (process.env.NODE_ENV === 'production') {
  module.exports = {
    ReactQueryDevtools: function() {return null;},
    ReactQueryDevtoolsPanel: function() {return null;},
  }
} else {
  module.exports = require('./dist/react-query-devtools.development.js')
}
