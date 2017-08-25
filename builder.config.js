/**
 * 构建配置文件，通过脚本参数形式传入构建
 * 可以根据不同的构建配置，生成不同的目标文件
 */
module.exports = {
    // 业务页面所在目录，用来构建路由以及init state，字符串或者数组
    pagePath: './src/pages/**/*.jsx',
    // pagePath: [
    //     './src/pages/reserve/**/*.jsx',
    //     './src/pages/sale/**/*.jsx',
    // ],

    // 忽略文件，不进行构建，提供部分模块打包功能，一般是配合补充 pagePath 进行使用，字符串或者数组
    pageIgnore: [
        // '**/ActionsExample.jsx',
    ],

    // webpack配置，区分不同环境
    webpack: {
        base: {
            entry: {
                app: './src/App.jsx',
                login: './src/pages/login/Login.jsx',
            },
        },
        dev: {},
        prod: {},
        dll: {},
    },
};
