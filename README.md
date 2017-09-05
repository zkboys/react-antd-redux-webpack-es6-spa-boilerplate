# react-antd-redux-webpack-es6-spa-boilerplate
> 管理系统架构，基于 antd + react + redux + webpack + ES6 的单页面应用

管理系统往往是大量的表单表格等页面，存在大量的体力劳动，基于长期的管理系统开发，整理出一套管理系统架构、组件、通用方法来提高开发效率。
可以以此为基础，快速创建管理系统项目。simple is all，make coding easy!
感谢[ant design](https://ant.design/index-cn)提供如此出色的UI库及设计思想，让开发变得简单很多！祝[ant design](https://ant.design/index-cn)越做越好！

QQ交流群：667271903

喜欢就给个star，感谢您的鼓励与支持！

## 架构功能一览：
> 如果您想找华丽的UI，这个框架会让你失望，它目前只关注了如何简化编码，提高开发效率。

1. UI基于antd，完整的登录、退出登录、菜单等结构。
1. 前后端分离，前后端可以并行开发，前端单独部署。
1. 基于webpack2.0进行构建，对构建进行了优化，提高rebuild速度，提高开发效率。
1. 菜单、页面标题、面包屑导航自动获取+可配置。
1. redux写法封装、简化的redux写法、与存储自动同步、异步redux写法、异常处理，相关文档在: src/redux/README.md。
1. ajax自动提示封装、全局+局部配置、ajax高阶组件自动释放资源、前后端约定统一错误处理。
1. 路由简化配置，页面直接声明一个PAGE_ROUTE变量，自动生成路由配置文件。相关文档在: src/route/README.md。
1. 后端交互统一封装成service、提供基于restFull，提供BaseService基础方法、service高阶组件自动释放资源。
1. mock规则可配置，快速切换mock数据与真实数据
1. 基础CRUD代码生成，减少不必要的体力劳动。脚本在bin目录下。
1. 列表页可配置，通过ListPage组件，通过简单的配置，可以生成列表页面。
1. css 模块化，有效避免css命名冲突，提高css命令灵活性。
1. 使用eslint 结合 webpack 统一代码规范，降低各个开发人员直接的沟通成本，提高代码质量。

## 开发环境
1. node v7.2.1
2. yarn v0.27.5
3. 兼容windows/mac 还没在ubuntu上开发，未知。

## 安装、开发/生产构建
> 必须使用[yarn](https://yarnpkg.com/zh-Hans/)进行构建。yarn可以更好的组织依赖，下载依赖速度更快，也许还需要翻墙。
使用[npm](https://www.npmjs.com/)或者[淘宝的cnpm](http://npm.taobao.org/)安装之后运行`npm run dev `会报错无法启动；

yarn:
``` bash
# 安装所有依赖
$ yarn

# 启动开发
$ yarn dev

# 生产环境构建
$ yarn build

# 清除缓存（如果发现源码与webpack编译文件明显不一致，有可能是缓存脏数据）
$ yarn clear-cache
```

## 项目结构
```
.
├── .happypack                      // happypack缓存文件
├── bin                             // 代码生成脚本
├── builder                         // 构建工具
├── dist                            // 开发构建时，生成的临时文件，生产环境不用
├── local-default                   // 个性化配置，用户分模块打包、个人配置等，只开发模式有效，目前没启用，预留功能
├── public                          // 构建之后的代码，用户生产环境部署
├── src                             // 开发主要目录
│    ├── commons                    // 系统公共方法，组件
│    ├── frame                      // 页面框架，头部+左侧等
│    ├── mock                       // mock数据，截获ajax请求，便于前端单独调试
│    │   └── mockdata               // 模拟数据 mockjs
│    ├── pages                      // 业务页面，业务开发主要关系目录
│    │   ├── error                  // 一些error页面，404 403 401 等等
│    │   ├── examples               // 一些例子
│    │   └── home                   // 首页
│    ├── redux                      // redux 相关
│    │   ├── actions                // redux action定义
│    │   ├── reducers               // redux reducers定义目录
│    │   ├── store                  // redux store
│    │   └── actionTypes.js         // actions 和 reducers使用的types常量
│    ├── route                      // 路由 相关
│    ├── services                   // 前端服务，一般是ajax请求等一些封装，提供基础数据
│    ├── all-routes.js              // 脚本生成的路由配置文件
│    ├── App.jsx                    // 项目入口文件
│    ├── global.less                // 全局样式定义
│    ├── page-init-state.js         // 全局样式定义
│    ├── page-init-state.js         // 脚本生成的简化redux写法的初始化state
│    ├── page-routes.js             // 脚本生成的路由配置文件
│    └── variables.less             // 主题变量
├── static                          // 非构建依赖的静态文件
├── .babelrc
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── favicon.png
├── index.html
├── package.json
├── postcss.config.js
├── README.md
└── yarn.lock
```

## 文件命名约定

1. 文件夹小写英文加连字符"-"，比如：`src/pages/user-center`
1. less文件、js文件 小写英文加连字符"-"，比如：`user-center.less`、`user-center.js`
1. jsx文件（组件），首字母大写，驼峰命名，比如：`UserCenter.jsx`

## 系统菜单激活状态
> 系统菜单的激活状态根据url地址，自动判定

如果是二级页面，比如添加页面，需要保持其父级页面菜单状态，菜单path需要写成`parentPath/+childPath`，使用`/+`作为分界，比如：
```
list页面：
export const PAGE_ROUTE = '/example/users'

list页面的添加按钮，跳转到添加页面，但是页面菜单选中状态要保持list页面状态

export const PAGE_ROUTE = '/example/users/+add'
```

## 页面头部
> 页面头部标题、面包屑导航系统会根据页面状态自动获取，但也可以控制显示隐藏、修改标题、修改面包屑。

### 显示隐藏
```
componentWillMount() {
    this.props.$actions.hidePageHeader();
}

```

### 修改标题
```
componentWillMount() {
    this.props.$actions.setPageTitle('自定义页面标题');
}
```

### 自定义面包屑导航
```
componentWillMount() {
    this.props.$actions.setPageBreadcrumbs([
        {
            key: 'zidingyi',
            path: '',
            text: '自定义',
            icon: 'fa-user',
        },
        {
            key: 'mianbaoxie',
            path: '',
            text: '面包屑',
            icon: 'fa-user',
        },
        {
            key: 'daohang',
            path: '',
            text: '导航',
            icon: 'fa-user',
        },
    ]);
}
```

## 前后端分离 ngnix配置 参考
```
# 服务地址
upstream api_service {
  server localhost:8080;
  keepalive 2000;
}
#
server {
    listen       80;
    server_name  localhost;
    location / {
      root /home/app/nginx/html; // 前端打包之后的文件存放路径
      index index.html;
      try_files $uri $uri/ /index.html; #react-router 防止页面刷新出现404
    }
    location ^~/api { // 代理ajax请求，前端的ajax请求配置了统一的baseUrl = ‘/api’
       proxy_pass http://api_service/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }
}
```

## 构建拆分
> 基于配置，进行不同项目的打包构建，解决不同项目，但是类似，有很多通用组件，但是要单独发布的情景；
如果项目相差较大，没有太多的公共部分，还是建议单独建立一个项目。

构建可以传入config文件，基于config文件可以构建出不同的项目
```
"dev": "yarn run clear-cache && yarn run dll && cross-env NODE_ENV=development node ./builder/dev-server.js --cfg ./xxx.config.js",
```

xxx.config.js如下
```js
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
```

## TODO
- [x] 登录之后，获取菜单数据，并存入session中，由于页面头部是由菜单生成的，如果菜单是异步获取的，将会存在各种问题，所以进入系统时候保证菜单可用。
      已经改为进入App之前获取菜单，这样刷新页面就可以获取最新菜单，不必重新登录。
- [x] 构建优化：css postcss的使用，自动添加前缀等功能
- [x] 是否使用 css module功能，好像加不上，antd不是module方式，如果使用module，antd less 构建会失败。
      通过配置可以区分出那些模块使用css module，那些不使用。
- [x] 添加事件，移除事件的高阶组件
- [x] redux 中数据，实现部分数据同步到localStorage中，目前是可以选择性恢复，可以满足需求
- [x] source-map改如何使用
- [x] 左侧菜单可拖动缩放宽度
- [x] zk-react 开发模式构建慢问题，升级到webpack2.0，添加了一些优化
- [x] antd 通用校验规则整理到zk-react中
- [x] antd edit-cell其他表单元素完善、 可配置form组件（可用于查询条件、简单的form）
- [x] antd 自定义异步校验，多个异步校验互相干扰问题 可以使用Promise.all包装各个请求
- [x] 系统注入到props中的变量统一使用'$'开头，比如$ajax $event $domEvent $service $actions
- [ ] 字体图标，团队有条件还是定制的好，全部引入会多出300~400KB。
- [ ] 修改less时可以hot reload ，修改jsx为什么直接reload？
- [ ] antd 图标本地部署问题：缓存问题，antd.less需要全部引入，会多550KB的css代码
- [ ] docker 前端生产环境部署
- [ ] 菜单匹配时，如果path携带参数，怎么能匹配成功？
- [ ] css module class name 长短问题
- [ ] css module=true background: url(); 问题 Module not found: Error: Can't resolve 'login-bg.jpg'
- [ ] 测试：单元测试，端对端测试
- [ ] 整理完善demo、文档，使用jsdoc？es6支持情况如何？
- [ ] TypeScript + immutable 重构，团队人员情况，学习成本，开发成本？
