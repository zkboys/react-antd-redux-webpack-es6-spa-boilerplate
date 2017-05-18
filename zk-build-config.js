const path = require('path');

const assetsSubDirectory = 'static';

function assetsPath(_path) {
    return path.posix.join(assetsSubDirectory, _path);
}

module.exports = {
    useESLint: true,
    proxyTables: { // dev-server 反向代理配置
        // '/api/organization/users': 'http://localhost:3001', // 开发过程中，可以代理具体的url到后端开发机器上。
    },
    projectRoot: './',
    srcPath: './src',
    staticPath: './static', // 非webpack构建的静态文件存放目录，会被一同拷贝到assetsRoot目录下
    assetsRoot: './public', // webpack 构建生成文件存放路径
    assetsSubDirectory,
    assetsPublicPath: '/', // webpack 构建时，静态文件cdn
    routesIgnore: [ // 忽略文件，不进行构建，提供部分模块打包功能
        // '**/AddEdit.jsx',
    ],
    pagePath: './src/pages/**/*.jsx', // 使用了PAGE_ROUTE INIT_STATE 文件所在目录，与routesIgnore同样可以控制打包模块
    htmlOptions: { // HtmlWebpackPlugin 所需的一些配置
        app: {
            template: './index.html', // html 模板
            fileName: 'index.html', // 构建生成的文件名
            favicon: './favicon.png',
            title: 'zk-react management', // 当前文件的title标签值
        },
        login: {
            template: './index.html',
            fileName: 'login.html',
            favicon: './favicon.png',
            title: '登录',
        },
    },
    webpack: { // webpack 配置 分为 base（通用） dev（开发） prod（生产）
        base: {
            entry: {
                app: './src/App.jsx',
                login: './src/pages/login/Login.jsx',
            },
            resolve: {
                extensions: ['', '.web.js', '.js', '.jsx'],
                alias: {
                    src: './src',
                    // assets: path.resolve(__dirname, './src/assets'),
                    components: './src/components',
                },
            },
            module: {
                loaders: [
                    {
                        test: /\.(svg)(\?.*)?$/,
                        loader: 'url',
                        query: {
                            limit: 10000,
                            name: assetsPath('img/[name].[hash:7].[ext]'),
                        },
                    },
                ],
            },
        },
        prod: {
            devtool: false,
        },
    },
    babelImport: [{libraryName: 'antd', style: 'css'}],
};
