'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

require('./gulp_tasks/add-custom-config.js');

// gulp upload-app-pkg --ship
// + First time you need to Deploy from AppCatalog manually (Ribbon - File - Deploy)
require('./gulp_tasks/upload-app-pkg.js');

// gulp deploy-cdn-assets --ship
require('./gulp_tasks/deploy-cdn-assets.js');

require('./gulp_tasks/deploy-app-package.js');

// Continuous Integration Build (deploy CDN assets and App Package)
//gulp ci-build --ship --username="<USER>@<TENANT>.onmicrosoft.com" --password="<PASSWORD>" --tenant-url="https://<TENANT>.sharepoint.com/" --site-relative-url="sites/<SITE>" --library-path="<CDN_LIBRARY>" --target-cdn="https://publiccdn.sharepointonline.com/<TENANT>.sharepoint.com/sites/<SITE>/<CDN_LIBRARY>"
require('./gulp_tasks/ci-build.js');

build.initialize(gulp);
