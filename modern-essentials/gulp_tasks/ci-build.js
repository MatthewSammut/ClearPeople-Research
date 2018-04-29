const build = require('@microsoft/sp-build-web');

var deployCdnAssets = require('./deploy-cdn-assets.js');
var uploadAppPkg = require('./upload-app-pkg.js');
var deployAppPkg = require('./deploy-app-package.js');

build.task('ci-build', build.serial([deployCdnAssets.Task, uploadAppPkg.Task, deployAppPkg.Task]));

build.task('sppkg', build.serial([build.rig.getConfigureRigTask(), build.rig.getBundleTask(), build.packageSolution]));