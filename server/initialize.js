/*
  Any shared initialization needed for server.js or independent scripts
*/
import fs     from 'fs';
import nconf  from 'nconf';

let { NODE_ENV, RUNNING_LOCALLY } = process.env;

if ( typeof NODE_ENV === 'undefined' ) {
  NODE_ENV = 'development'
}

const DEFAULT_CONFIG        = './server/config/defaults.json';
const DEVELOPMENT_CONFIG    = './server/config/development.json';
const PRODUCTION_CONFIG     = './server/config/production.json';
const REMOTE_PRIVATE_CONFIG = '/home/deploy/config/panther/production.json';
const LOCAL_PRIVATE_CONFIG  = './server/config/privates.json';

console.log("Local?", RUNNING_LOCALLY)

const ENV_CONFIG = NODE_ENV === 'production'
                  ? PRODUCTION_CONFIG
                  : DEVELOPMENT_CONFIG;

const PRIVATE_CONFIG = (NODE_ENV === 'production' && !RUNNING_LOCALLY)
                      ? REMOTE_PRIVATE_CONFIG
                      : LOCAL_PRIVATE_CONFIG;

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. Our environment-specific config (eg. database info)
//   4. Our default configuration (eg. timezone)
//   5. Private configuration (API keys, deploy info)

nconf
  .argv()
  .env()
  .file('environment', ENV_CONFIG)
  .file('defaults', DEFAULT_CONFIG)
  .file('privates', PRIVATE_CONFIG);
