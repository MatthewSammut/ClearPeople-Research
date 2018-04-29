// source: https://github.com/SharePoint/sp-dev-build-extensions/tree/master/gulp-tasks/deploy-app-package
'use strict';

const build = require('@microsoft/sp-build-web');
const sppkgDeploy = require('node-sppkg-deploy');

const environmentInfo = {
  "username": "",
  "password": "",
  "tenant": "",
  "catalogSite": ""
};

exports.Task = build.task('deploy-sppkg', {
  execute: (config) => {
    build.log('Deploy sppkg task started');
    
    environmentInfo.username = config.args['username'] || config.properties.envConfig.username;    
    environmentInfo.password = config.args['password'] || config.properties.envConfig.password;
    environmentInfo.tenant = config.args['tenantname'] || config.properties.envConfig.tenantName;
    environmentInfo.catalogSite = config.args['catalogsite'] || config.properties.envConfig.catalogSite;

    //build.log(environmentInfo);

    // Retrieve the filename from the package solution config file
    let filename = build.packageSolution.taskConfig.paths.zippedPackage;    

    // Remove the solution path from the filename
    filename = filename.split('\\').pop();
    //build.log(filename);

    // Retrieve the skip feature deployment setting from the package solution config file
    const skipFeatureDeployment = build.packageSolution.taskConfig.solution.skipFeatureDeployment ? build.packageSolution.taskConfig.solution.skipFeatureDeployment : false;

    // Deploy the SharePoint package
    return sppkgDeploy.deploy({
      username: environmentInfo.username,
      password: environmentInfo.password,
      tenant: environmentInfo.tenant,
      site: environmentInfo.catalogSite,
      filename: filename,
      skipFeatureDeployment: skipFeatureDeployment,
      verbose: true
    });
  }
});