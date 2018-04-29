const build = require('@microsoft/sp-build-web');
const fs = require('fs');

const addCustomConfig = build.subTask('add-custom-config-subtask', function (gulp, buildConfig, done) {    
    const env = buildConfig.args['env'] || 'dev';
    let json = JSON.parse(fs.readFileSync('./config/environments.json'));

    this.log('Adding env settings to build config...' + env);

    buildConfig.properties.envConfig = json[env];

    done();
});

const updateCdnPath = build.subTask('set-cdn-path-from-env', function (gulp, buildConfig, done) {    
    if (buildConfig.production && buildConfig.args['env']) {
        let targetCdn = buildConfig.properties.envConfig.cdnBasePath;
        this.log('Setting cdn-path to...' + targetCdn);
        build.writeManifests.taskConfig.cdnBasePath = targetCdn;
    } else {
        this.log("using localhost target-cdn");
    }

    done();
});

// Not in use so far, as even changing the Solution ID and Name, 
// you can´t install the same App in the same App Catalog, as it will raise an error 
// saying the Component ID (webparts, extensions) are already in the catalog
// https://github.com/SharePoint/sp-dev-docs/issues/831
// We keep the code because at some point, we might want to generate the .sppkg with different names per environment
const updateSpPkg = build.subTask('set-sppkg-from-env', function (gulp, buildConfig, done) {    
    const environment = buildConfig.args['env'];
    if (buildConfig.production && environment) {
        const zippedPackage = 'solution/cms-ci' + '_' + environment + '.sppkg';
        this.log('Setting sppkg to...' + zippedPackage);
        let solutionName = build.packageSolution.taskConfig.solution.name;
        if (solutionName.indexOf('_' + environment) < 0) { //avoid adding _env_env, as this is done when we Build Deploy-pck and Deploy-cdn dependencies
            build.packageSolution.taskConfig.solution.name = solutionName + '_' + environment;
        }        
        build.packageSolution.taskConfig.paths.zippedPackage = zippedPackage;
        build.packageSolution.taskConfig.solution.id = buildConfig.properties.envConfig.solutionId;
    } 

    done();
});

build.rig.addPostBuildTask(addCustomConfig);
build.rig.addPostBuildTask(updateCdnPath);