var chokidar = require('chokidar');
var fs = require('fs');
var config = require('./config');
var generateAllRoutes = require('./generate-all-routes');
var generatePageRoute = require('./generate-page-route');
var generatePageInitState = require('./generate-page-init-state');

var routesSourceFileName = config.routesFileName;
var pageSourceFileName = config.pagePath;
var allRoutesFileName = config.allRoutesFileName;
var pageInitStateFileName = config.pageInitStateFileName;
var pageRouteFileName = config.pageRouteFileName;

// 删除历史生成文件
fs.existsSync(allRoutesFileName) && fs.unlinkSync(allRoutesFileName);
fs.existsSync(pageInitStateFileName) && fs.unlinkSync(pageInitStateFileName);
fs.existsSync(pageRouteFileName) && fs.unlinkSync(pageRouteFileName);

generate();

function generate() {
    generateAllRoutes.generateAllRoutes();
    generatePageRoute.generateAllPageRoute();
    generatePageInitState.generateAllInitState();
}

exports.generate = generate;
exports.watch = function () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
        chokidar.watch([routesSourceFileName, pageSourceFileName], {ignored: config.routesIgnore}).on('all', (event, pathName) => {
            generateAllRoutes.handleWatchAllRoutes(event, pathName);
            generatePageInitState.handlePageInitStateWatch(event, pathName);
            generatePageRoute.handlePageRouteWatch(event, pathName);
        });
    }
}