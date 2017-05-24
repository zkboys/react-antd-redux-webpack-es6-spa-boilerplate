/* eslint-disable */
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var utils = require('./utils');
var config = require('./config');

var sourceFileName = config.pagePath;
var targetFileName = config.pageRouteFileName;

var paths = {};
var pathNames = {};
exports.handlePageRouteWatch = function (event, pathName) {
    const routePath = getRoutePath(pathName);

    if (!routePath) return;
    console.log('page-route:', event, pathName);
    var pn = utils.getPathName(pathName);
    if (event === 'add' || event === 'change') {
        paths[pathName] = routePath;
        pathNames[pathName] = pn;

        var ps = Object.keys(paths).map(function (key) {
            return paths[key];
        });
        var pns = Object.keys(pathNames).map(function (key) {
            return pathNames[key];
        });
        writeAllPageRoute(ps, pns, targetFileName);
    }
    if (event === 'unlink') {
        delete paths[pathName];
        delete pathNames[pathName];

        var ps2 = Object.keys(paths).map(function (key) {
            return paths[key];
        });
        var pns2 = Object.keys(pathNames).map(function (key) {
            return pathNames[key];
        });
        writeAllPageRoute(ps2, pns2, targetFileName);
    }
}
exports.generateAllPageRoute = function () {
    var result = getPathsAndPathNames(sourceFileName, targetFileName, getRoutePath);
    var paths = result.paths;
    var pathNames = result.pathNames;
    writeAllPageRoute(paths, pathNames, targetFileName);
}

function writeAllPageRoute(paths, pathNames, targetFileName) {
    var fileString = '';
    fileString = utils.getRouteAddtionsImportString();

    fileString += 'export default [';
    pathNames.forEach(function (im, i) {
        fileString += '\n    {\n        ';
        fileString += 'path: \'' + paths[i] + '\',\n        ';
        fileString += utils.getComponentString(im);
        // fileString += 'asyncComponent: \'' + im + '\',\n    ';
        fileString += '},'
    });
    fileString += '\n];\n';
    fs.writeFileSync(targetFileName, fileString);
}


function getRoutePath(file) {
    try {
        var fileStr = fs.readFileSync(file);
        // export const PAGE_ROUTE = '/base-information/business/users/+add/:userId';
        var patt = /export const PAGE_ROUTE = [ ]*['"]([^'"]+)['"][;]/gm;
        var isRoutes = false;
        var block = null;
        while ((block = patt.exec(fileStr)) !== null) {
            isRoutes = block[0] && block[1];
            if (isRoutes) {
                return block[1];
            }
        }
        return false;
    } catch (e) {
        return true; // 文件被移除之后，也算他没有PAGE_ROUTE
    }
}

function getPathsAndPathNames(sourceFilePath, targetFileName, filter) {
    filter = filter || function () {
            return true
        };
    var paths = [];
    var pathNames = [];
    var files = glob.sync(sourceFilePath, {ignore: config.routesIgnore});
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var p = filter(file);
            if (p && p !== true) {
                // var filePath = path.relative(targetFileName, file);
                var moduleName = utils.getPathName(file);
                paths.push(p);
                pathNames.push(moduleName);
            }
        }
    }
    return {
        paths: paths,
        pathNames: pathNames,
    }
}
