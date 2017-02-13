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

      requiredConfig: ['publicURL'],

      defaultConfig: {},

      build: function(context) {
        var self = this;
        var options = {};

        return new Promise(function(resolve, reject) {
          exec('PUBLIC_URL=' + self.readConfig('publicURL') + ' yarnpkg run build', options, function(error, stdout, stderr) {
            if (error) {
              reject();
              return;
            }

            var files = glob.sync('**/**/*', {cwd: 'build'});

            if (files && files.length) {
              files.forEach(function(path) {
                self.log('✔  ' + path, { verbose: true });
              });
            } else {
              self.log('No files :(');
            }

            resolve({
              distDir: 'build',
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
