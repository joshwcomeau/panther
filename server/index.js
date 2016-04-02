// Simple wrapper for server.js, to allow ES6 on the server-side.
require('babel-core/register');

// Boot up the server that corresponds to the environment.
var fileSuffix  = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
var fileName    = './server.'+fileSuffix; // eg. ./server.dev

require(fileName);
