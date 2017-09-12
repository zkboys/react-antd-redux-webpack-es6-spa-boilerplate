const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const packageJson = require('../package.json');
const config = require('./config');

// 这两个库会导致dll失败
Reflect.deleteProperty(packageJson.dependencies, 'antd');
Reflect.deleteProperty(packageJson.dependencies, 'zk-tookit');
Reflect.deleteProperty(packageJson.dependencies, 'animate.css');
const deps = Object.keys(packageJson.dependencies);

const webpackDllConfig = config.webpackConfig.dll;

module.exports = merge({
    entry: {
        vendor: deps,
    },
    output: {
        path: path.join(__dirname, '../', 'dist'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(__dirname, '../', 'dist', '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。
             */
            name: '[name]_library'
        })
    ]
}, webpackDllConfig);
