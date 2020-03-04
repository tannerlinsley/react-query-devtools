if (process.env.NODE_ENV === 'production') {
  module.exports = {
    ReactQueryDevtools: () => null,
    ReactQueryDevtoolsPanel: () => null,
  }
} else {
  module.exports = require('./dist/react-query-devtools.development.js')
}
