const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');

const sourcePath = path.resolve(__dirname, '../', 'src');

Object.keys(baseWebpackConfig.entry).forEach(name => {
    // add hot-reload related code to entry chunks
    baseWebpackConfig.entry[name] = [path.join(__dirname, './dev-client')].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    output: {
        path: path.join(__dirname, '../', 'dist'),
        publicPath: config.dev.assetsPublicPath,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less/,
                exclude: config.useCSSModulePath,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false,
                            includePaths: [sourcePath],
                        },
                    },
                ],
            },
            {
                test: /\.less/,
                include: config.useCSSModulePath,
                use: [
                    'style-loader',
                    {
                        // https://github.com/webpack-contrib/css-loader
                        loader: 'css-loader',
                        options: {
                            module: true,
                            camelCase: true,
                            localIdentName: '[path][name]-[local]',
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false,
                            includePaths: [sourcePath],
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'eval-source-map',
    plugins: [
        // 只在开发模式下使用
        // webpack2会忽略未使用的export，打包文件更小
        // dll会全部打包，会有很多未使用代码
        // 这个项目会相差1.7M
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require(path.join(__dirname, '../', 'dist', 'vendor-manifest.json')),
        }),
        new AddAssetHtmlPlugin({
            filepath: path.join(__dirname, '../', 'dist', 'vendor.dll.js'),
            includeSourcemap: false,
            hash: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            chunks: ['common', 'app'],
            favicon: './favicon.png',
            filename: 'index.html',
            template: './index.html',
            title: 'REACT管理系统架构',
            inject: true,
        }),
        new HtmlWebpackPlugin({
            chunks: ['common', 'login'],
            favicon: './favicon.png',
            filename: 'login.html',
            template: './index.html',
            title: '登录',
            inject: true,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
        }),
    ]
});
