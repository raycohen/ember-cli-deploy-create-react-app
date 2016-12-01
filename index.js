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
        options.cwd = '../fluxproofofconcept';

        return new Promise(function(resolve, reject) {
          exec('npm run build', options, function(error, stdout, stderr) {
            if (error) {
              reject();
              return;
            }

            var files = glob.sync('**/**/*', {cwd: '../fluxproofofconcept/build'});

            if (files && files.length) {
              files.forEach(function(path) {
                self.log('✔  ' + path, { verbose: true });
              });
            } else {
              self.log('No files :(');
            }

            resolve({
              distDir: '../fluxproofofconcept/build',
              distFiles: files
            });
          });
        }).then(function(results) {
          exec('ls', options, function(error, stdout, stderr) {
            if (error) {
              reject();
              return;
            }
            resolve(results);
          });
        });
      }
    });

    return new Plugin();
  }
};
