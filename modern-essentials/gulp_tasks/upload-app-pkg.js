const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const debug = require('gulp-debug');

const spsync = require('gulp-spsync-creds').sync;

const uploadAppPkg = build.task('upload-app-pkg', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            //build.log('Uploading .sppkg file to App Catalog library');
            const folderLocation = build.packageSolution.taskConfig.paths.zippedPackage;
            
            const username = config.args['username'] || config.properties.envConfig.username;
            const password = config.args['password'] || config.properties.envConfig.password;
            const spTenantUrl = config.args['tenant-url'] || config.properties.envConfig.spTenantUrl;
            const catalogSite = config.args['catalogsite'] || config.properties.envConfig.catalogSite;

            return gulp.src(folderLocation)
                //.pipe(debug({title: 'unicorn:'})
                .pipe(
                    spsync({
                    "username": username,
                    "password": password,
                    "site": spTenantUrl + catalogSite,
                    "libraryPath": "AppCatalog",
                    "publish": true
                }))
                .on('finish', resolve);
        });
    }
});

const uploadAppPackage = build.serial([build.rig.getConfigureRigTask(), build.rig.getBundleTask(), build.packageSolution, uploadAppPkg]);
exports.Task = build.task("upload-app-pkg", uploadAppPackage);