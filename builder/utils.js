var path = require('path');
var glob = require('glob');
var os = require('os');
var config = require('./config');

function assetsPath(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

/**
 * 根据文件的绝对路径，生成所需的所有import 和 moduleName
 * @param sourceFilePath
 * @param targetFileName
 * @returns {{imports: Array, modules: Array}}
 */
function getImportsAndModules(sourceFilePath, targetFileName, filter, star) {
    filter = filter || function () {
            return true
        };
    var imports = [];
    var modules = [];
    var files = glob.sync(sourceFilePath, {ignore: config.routesIgnore});
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (filter && filter(file)) {
                // var filePath = path.relative(targetFileName, file);
                var importStr = getImportStr(file, star);
                var moduleName = getModuleName(file);
                imports.push(importStr);
                modules.push(moduleName);
            }
        }
    }
    return {
        imports: imports,
        modules: modules,
    }
}

/**
 * 获取本机的ip地址
 * @returns {*}
 */
function getIP() {
    var interfaces = os.networkInterfaces();
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return '127.0.0.1';
}


/**
 * 根据文件的相对路径，生成import 所需字符串
 * @param pathName
 * @param filePackage
 * @param ext
 * @returns {string}
 */
function getImportStr(pathName, star) {
    var pName = getModuleName(pathName);
    pathName = getPathName(pathName);
    if (star) {
        return "import * as " + pName + " from '" + pathName + "';";
    }
    return "import " + pName + " from '" + pathName + "';";
}

/**
 * 获取文件相对路径名，用于引入等
 * @param pathName
 */
function getPathName(pathName) {
    var extName = path.extname(pathName);
    pathName = pathName.replace(extName, '');
    if (process.platform.indexOf('win') >= 0) {
        pathName = pathName.replace(/\\/g, "\/");
    }
    // pathName = pathName.replace('../', '');
    return pathName;
}
/**
 * 根据文件的相对路径，生成moduleName
 * @param pathName
 * @param ext
 * @returns {string}
 */
function getModuleName(pathName) {
    var extName = path.extname(pathName);
    pathName = pathName.replace(extName, '');
    pathName = pathName.split(path.sep);
    var pName = '';
    pathName.forEach(function (p) {
        if (p) {
            var ps = p.split('-');
            ps.forEach(function (v) {
                pName += v.replace(/(\w)/, function (v) {
                    return v.toUpperCase()
                });
            });
        }
    });
    pName = pName.replace(/\./g, '');
    pName = pName.replace(':', '');
    return pName;
}

/**
 * 删除数组中某个元素
 * @param arr
 * @param item
 */
function arrayRemove(arr, item) {
    var itemIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            itemIndex = i;
            break;
        }
    }
    if (itemIndex > -1) {
        arr.splice(itemIndex, 1);
    }
}

/**
 * 获取asyncComponent 转换之后的字符串
 * @param componentPath
 * @returns {string}
 */
function getComponentString(componentPath) {
    return "getComponent: (nextState, cb) => {"
        + "startFetchingComponent();"
        + "require.ensure([], (require) => {"
        + "if (!shouldComponentMount(nextState)) return;"
        + "endFetchingComponent();"
        + "cb(null, connectComponent(require('" + componentPath + "')));"
        + "});"
        + "},";
}
/**
 * 获取路由异步加载控制所需的import字符串
 * @returns {string}
 */
function getRouteAddtionsImportString() {

    var connectPath = path.join(__dirname, '../', 'src', 'redux/store/connectComponent.js');
    var routeUtilsPath = path.join(__dirname, '../', 'src', 'commons', 'route-utils');

    connectPath = getPathName(connectPath);
    routeUtilsPath = getPathName(routeUtilsPath);

    return "import connectComponent from '" + connectPath + "';\n"
        + "import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from '" + routeUtilsPath + "';"
        + '\n\n';
}
exports.getRouteAddtionsImportString = getRouteAddtionsImportString;
exports.getComponentString = getComponentString;
exports.assetsPath = assetsPath;
exports.arrayRemove = arrayRemove;
exports.getImportStr = getImportStr;
exports.getModuleName = getModuleName;
exports.getPathName = getPathName;
exports.getImportsAndModules = getImportsAndModules;
exports.getIP = getIP;