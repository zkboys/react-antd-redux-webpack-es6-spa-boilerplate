/* eslint-disable */
var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var config = require('./config');

var sourceFileName = config.routesFileName;
var targetFileName = config.allRoutesFileName;

var imports = [];
var modules = [];
exports.handleWatchAllRoutes = function (event, pathName) {
    if (!isRoutesFile(pathName)) return;
    // pathName= path.relative(targetFileName, pathName);
    console.log('all-routes:', event, pathName);
    var im = utils.getImportStr(pathName);
    var pn = utils.getModuleName(pathName);
    if (event === 'add') {
        imports.push(im);
        modules.push(pn);
        writeAllRoutes(imports, modules, targetFileName);
    }
    if (event === 'unlink') {
        utils.arrayRemove(imports, im);
        utils.arrayRemove(modules, pn);
        writeAllRoutes(imports, modules, targetFileName);
    }
}

exports.generateAllRoutes = function () {
    var result = utils.getImportsAndModules(sourceFileName, targetFileName);
    var imports = result.imports;
    var modules = result.modules;
    writeAllRoutes(imports, modules, targetFileName);
}

function writeAllRoutes(imports, routesNames, targetFileName) {
    var fileString = imports.join('\n');
    fileString += '\n\nexport default [].concat(\n    ';
    fileString += routesNames.join(',\n    ');
    fileString += '\n);\n';
    fs.writeFileSync(targetFileName, fileString);
}

function isRoutesFile(pathName) {
    return path.basename(pathName) === 'routes.js';
}
