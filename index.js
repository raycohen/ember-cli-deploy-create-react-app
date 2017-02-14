/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var Promise = require('ember-cli/lib/ext/promise');
var exec = require('child_process').exec;
var glob = require('glob');
var nodeModulesPath = require('node-modules-path');
var path = require('path');
var fs = require('fs');

var getDisabledPluginsMap = function(context) {
  if (context && context.config && context.config.pipeline) {
    return context.config.pipeline.disabled;
  }
  return {};
};

var userHasDisabledBuildPlugin = function(context) {
  return getDisabledPluginsMap(context).build;
};

module.exports = {
  name: 'ember-cli-deploy-create-react-app',

  createDeployPlugin: function(options) {
    var Plugin = DeployPluginBase.extend({
      name: options.name,

      requiredConfig: ['publicURL'],

      defaultConfig: {},

      configure: function(context) {
        this.warnIfBuildPluginNotDisabled(context);
      },

      warnIfBuildPluginNotDisabled(context) {
        if (userHasDisabledBuildPlugin(context)) {
          return;
        }

        var modulesPath = nodeModulesPath(process.cwd());
        var buildPluginPath = path.join(modulesPath, 'ember-cli-deploy-build');
        if (fs.existsSync(buildPluginPath)) {
          this.warn('The ember build plugin must be disabled.');
          this.warn('Add the following to your config/deploy.js file:');
          this.warn('```', {color: 'red'});
          this.logCode('ENV.pipeline = {');
          this.logCode('  disabled: {');
          this.logCode('    build: true');
          this.logCode('  }');
          this.logCode('};');
          this.warn('```', {color: 'red'});
        }
      },

      warn(message) {
        this.log(message, {color: 'red'});
      },

      logCode(message) {
        this.log(message, {color: 'green'});
      },

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
