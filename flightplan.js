// Flightplan - Deployment and Server Administration
//
// Acceptable arguments:
//   --skip-webpack         If I've recently bundled, I can skip the bundling.
//   --fresh-dependencies   Don't copy cached NPM module dependencies.

'use strict';

require('babel-core/register');
require('./server/initialize');

const plan    = require('flightplan');
const _       = require('lodash');
const nconf   = require('nconf');
const moment  = require('moment');

const privateKey        = process.env.HOME + "/.ssh/id_rsa";

const user              = 'deploy';
const appName           = 'panther';
const newDirectoryName  = 'panther_' + moment().format('YYYY-MM-DD_hh[h]mm[m]ss[s]');

const tempDir           = `/tmp/${newDirectoryName}`;
const projectDir        = `/home/${user}/${appName}`;

const newDirectory      = `${projectDir}/${newDirectoryName}`;
const linkedDirectory   = `${projectDir}/current`;

const MAX_SAVED_DEPLOYS = 3

plan.target('production', {
  host:       nconf.get('SERVER_HOST'),
  username:   nconf.get('SERVER_USER'),
  agent:      process.env.SSH_AUTH_SOCK
});

plan.local( 'deploy', local => {
  local.log(`Deployment started! Deploying to ${newDirectoryName}`);

  if ( !plan.runtime.options['skip-webpack'] ) {
    local.log('Webpacking everything up.');
    local.exec('webpack -p --config webpack.prod.js');
  } else {
    local.log('Skipping webpack bundle.')
  }

  local.log('Copying files to remote');
  const filenames = ['index.html', 'dist', 'client', 'server', 'package.json'];
  const files = filenames.reduce( (memo, filename) => {
    let file = local.find(filename, { silent: true }).stdout.split('\n');
    return [ ...memo, file ];
  }, []);

  // const index     = local.find('index.html', {silent: true}).stdout.split('\n');
  // const dist      = local.find('dist', {silent: true}).stdout.split('\n');
  // const client    = local.find('client', {silent: true}).stdout.split('\n');
  // const server    = local.find('server', {silent: true}).stdout.split('\n');
  // const packjson  = local.find('package.json', {silent: true}).stdout.split('\n');
  // const files     = [].concat(dist, client, server, packjson);

  local.transfer(files, `/tmp/${newDirectoryName}`);
});

plan.remote( 'deploy', remote => {
  remote.log('Move folder to web root')
  remote.sudo(`cp -R ${tempDir} ${newDirectory}`, { user });
  remote.rm(`-rf ${tempDir}`); // clean up after ourselves

  if ( !plan.runtime.options['fresh-dependencies'] ) {
    remote.log('Copying dependencies from last deploy');
    remote.exec(`cp -R ${linkedDirectory}/node_modules ${newDirectory}/node_modules`)
  }

  remote.log('Installing dependencies');
  remote.sudo(
    `npm --production --prefix ${newDirectory} install ${newDirectory}`,
    { user }
  );


  remote.log('Creating symlink');
  remote.sudo(`ln -snf ${newDirectory} ${linkedDirectory}`, { user });

  // Start/Restart the application
  // First, figure out if the app is already running
  let appDetails = remote.exec(`pm2 show ${appName}`, {failsafe: true});
  let appNotRunning = !!appDetails.stderr;

  if ( appNotRunning ) {
    remote.log("App is not already running. Starting it fresh")
    remote.exec(`pm2 start ${linkedDirectory}/server --name="${appName}"`)
  } else {
    remote.log("Restarting app")
    remote.exec(`pm2 restart ${appName}`)
  }

  remote.log('Removing oldest copies of deploy');
  remote.exec(`cd ${projectDir} && rm -rf \`ls -td wws_* | awk 'NR>${MAX_SAVED_DEPLOYS}'\``);

});
