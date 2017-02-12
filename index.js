/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var Promise = require('ember-cli/lib/ext/promise');
var exec = require('child_process').exec;
var glob = require('glob');

module.exports = {
  name: 'ember-cli-deploy-create-react-app',

  createDeployPlugin: function(options) {
    var Plugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {},

      build: function(context) {
        var self = this;
        var options = {};
        options.cwd = '../deployable-react-app';

        return new Promise(function(resolve, reject) {
          exec('PUBLIC_URL=https://s3.amazonaws.com/reactdeployer/react-deployer/ yarnpkg run build', options, function(error, stdout, stderr) {
            if (error) {
              reject();
              return;
            }

            var files = glob.sync('**/**/*', {cwd: '../deployable-react-app/build'});

            if (files && files.length) {
              files.forEach(function(path) {
                self.log('✔  ' + path, { verbose: true });
              });
            } else {
              self.log('No files :(');
            }

            resolve({
              distDir: '../deployable-react-app/build',
              distFiles: files
            });
          });
        }).then(function(results) {
          return new Promise(function(resolve, reject) {
            exec('ls', options, function(error, stdout, stderr) {
              if (error) {
                reject();
                return;
              }
              resolve(results);
            });
          });
        });
      }
    });

    return new Plugin();
  }
};
