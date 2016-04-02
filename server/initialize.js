/*
  Any shared initialization needed for server.js or independent scripts
*/
import fs     from 'fs';
import nconf  from 'nconf';

if ( typeof process.env.NODE_ENV === 'undefined' ) {
  process.env.NODE_ENV = 'development'
}

const DEFAULT_CONFIG      = './server/config/defaults.json';
const DEVELOPMENT_CONFIG  = './server/config/development.json';
const PRODUCTION_CONFIG   = '/home/deploy/config/panther/production.json';

let ENV_CONFIG = process.env.NODE_ENV === 'production'
                  ? PRODUCTION_CONFIG
                  : DEVELOPMENT_CONFIG;

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. Our environment-specific config (eg. database info)
//   4. Our default configuration (eg. timezone)

nconf
  .argv()
  .env()
  .file('environment', ENV_CONFIG)
  .file('defaults', DEFAULT_CONFIG);
