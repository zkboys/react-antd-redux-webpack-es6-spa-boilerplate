const path = require('path');
const srcPath = './src';

module.exports = {
    staticPath: './static', // 非webpack构建的静态文件存放目录，会被一同拷贝到assetsRoot目录下
    assetsRoot: './public', // webpack 构建生成文件存放路径
    projectRoot: './',
    sourceFilePath: srcPath,
    routesIgnore: [ // 忽略文件，不进行构建，提供部分模块打包功能
        // '**/ActionsExample.jsx',
    ],
    // pagePath: path.join(srcPath, 'pages/**/*.jsx'), // 使用了PAGE_ROUTE INIT_STATE 文件所在目录，与routesIgnore同样可以控制打包模块
    pagePath: path.join(srcPath, '**/*.jsx'),
    routesFileName: path.join(srcPath, '**/routes.js'),
    allRoutesFileName: path.join(srcPath, 'all-routes.js'),
    pageInitStateFileName: path.join(srcPath, 'page-init-state.js'),
    pageRouteFileName: path.join(srcPath, './page-routes.js'),
    useESLint: true,
    build: {
        env: '"production"',
        assetsRoot: path.join(__dirname, '../public'), // webpack 构建生成文件存放路径
        assetsSubDirectory: 'static',
        assetsPublicPath: '/', // cdn
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: '"development"',
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
