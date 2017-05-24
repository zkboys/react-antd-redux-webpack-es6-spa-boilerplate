/* eslint-disable */
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var utils = require('./utils');
var config = require('./config');


var sourceFileName = config.pagePath;
var targetFileName = config.pageInitStateFileName;

var finalString = {};
exports.handlePageInitStateWatch = function (event, pathName) {
    if (!hasInitState(pathName)) return;
    // pathName= path.relative(targetFileName, pathName);
    console.log('init-state:', event, pathName);
    var initString = getPageInitString(pathName);
    var scope = getPageInitScope(initString);
    var scopeInit = scope + ': ' + initString;
    if (event === 'add' || event === 'change') {
        finalString[scope] = scopeInit;
        writeAllInitState(finalString, targetFileName);
    }
    if (event === 'unlink') {
        delete finalString[scope];
        writeAllInitState(finalString, targetFileName);
    }
}

exports.generateAllInitState = function () {
    var finalString = {};
    var files = glob.sync(sourceFileName, {ignore: config.routesIgnore});
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (hasInitState && hasInitState(file)) {
                var initString = getPageInitString(file);
                var scope = getPageInitScope(initString);
                finalString[scope] = scope + ': ' + initString;
            }
        }
    }
    writeAllInitState(finalString, targetFileName);
}

function writeAllInitState(finalString, targetFileName) {
    // 拼接写入文件的内容
    var finalStrings = Object.keys(finalString).map(function (key) {
        return finalString[key];
    })
    var fileString = 'export default {\n    ' + finalStrings.join(',\n    ') + '};';
    fs.writeFileSync(targetFileName, fileString);
}

function hasInitState(file) {
    try { // file 文件有可能不存在，会导致webpack停掉
        var fileStr = fs.readFileSync(file);
        // FIXME 这个判断可能不准确
        return fileStr.indexOf('export const INIT_STATE') > 0;
    } catch (e) {
        return true; // 文件被移除之后，也算他没有INIT_STATE
    }
}

function getPageInitString(filePath) {
    if (!fs.existsSync(filePath)) return {};
    // FIXME 这个算法不准确
    var fileString = fs.readFileSync(filePath, 'utf-8');
    var initStart = fileString.indexOf('export const INIT_STATE = ');
    if (initStart > -1) {
        var initString = fileString.substring(initStart);
        var initEnd = initString.indexOf('};');
        initString = initString.substring(0, initEnd + 1);
        return initString.replace('export const INIT_STATE = ', '');
    }
}

function getPageInitScope(initString) {
    var patt = /scope:[ ]*['"]([^'"]+)['"][,]/gm;
    var isScope = false;
    var block = null;
    while ((block = patt.exec(initString)) !== null) {
        isScope = block[0] && block[1];
        if (isScope) {
            return block[1];
        }
    }
}