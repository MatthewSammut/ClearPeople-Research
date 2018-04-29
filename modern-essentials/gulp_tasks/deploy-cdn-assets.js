const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const debug = require('gulp-debug');

const spsync = require('gulp-spsync-creds').sync;

const uploadToSharePoint = build.task('upload-to-sharepoint', { 
    execute: (config) => {
        return new Promise((resolve, reject) => {
            //const deployFolder = require('./config/copy-assets.json'); //use instead: build.copyAssets.taskConfig.deployCdnPath            
            const folderLocation = `./${build.copyAssets.taskConfig.deployCdnPath}/**/*`;

            const username = config.args['username'] || config.properties.envConfig.username;
            const password = config.args['password'] || config.properties.envConfig.password;
            const spTenantUrl = config.args['tenant-url'] || config.properties.envConfig.spTenantUrl;
            var site = config.args['site-relative-url'] || config.properties.envConfig.cdnSiteRelativeUrl;            
            const libraryPath = config.args['library-path'] || config.properties.envConfig.cdnLibraryPath;
            site = spTenantUrl + site;
            
            build.log(`Uploading to SharePoint...Site: ${site}. Library: ${libraryPath}`);

            return gulp.src(folderLocation)
                //.pipe(debug({title: 'unicorn:'}))
                .pipe(spsync({
                    "username": username,
                    "password": password,
                    "site": site,
                    "libraryPath": libraryPath,
                    "publish": true
                }))
                .on('finish', resolve);
        });
    }
});

const deployToSharePoint = build.serial([build.rig.getConfigureRigTask(), build.rig.getBundleTask(), uploadToSharePoint]);
exports.Task = build.task("deploy-cdn-assets", deployToSharePoint);