if ( process.env.NODE_ENV === 'production' ) {
  module.exports = require('./Home.prod.jsx');
} else {
  module.exports = require('./Home.dev.jsx');
}
