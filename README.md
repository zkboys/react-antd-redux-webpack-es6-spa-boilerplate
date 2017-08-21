# zk-react-template-management
> 管理系统架构，基于 antd + react + redux + webpack + ES6 的单页面应用

1. UI基于antd，完整的登录、退出登录、菜单等结构
1. 前后端分离，单独开发，单独部署。
1. 基于webpack2.0进行构建，对构建进行了优化，提高rebuild速度，提高开发效率
1. 菜单、页面标题、面包屑导航自动获取+可配置
1. 简化的redux写法、与存储自动同步、异步redux写法、异常处理，相关文档在: src/redux/README.md
1. ajax自动提示封装、全局+局部配置、ajax高阶组件自动释放资源、前后端约定统一错误处理
1. 路由简化配置，页面直接声明一个PAGE_ROUTE变量，自动生成路由配置文件。相关文档在: src/route/README.md
1. 后端交互统一封装成service、提供基于restFull，提供BaseService基础方法、service高阶组件自动释放资源。
1. mock规则可配置
1. 基础CRUD代码生成。脚本在bin目录下
1. css 模块化
1. 使用eslint 结合 webpack 统一代码规范

## Build Setup
> 使用[yarn](https://yarnpkg.com/zh-Hans/)

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
> 页面头部可以控制显示隐藏、修改标题、修改面包屑

### 显示隐藏
```
componentWillMount() {
    const {$actions} = this.props;
    $actions.hidePageHeader();
}

```

### 修改标题
```
componentWillMount() {
    const {$actions} = this.props;
    $actions.setPageTitle('自定义页面标题');
}
```

### 自定义面包屑导航
```
componentWillMount() {
    const {$actions} = this.props;
    $actions.setPageBreadcrumbs([
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

## TODO
- [x] 登录之后，获取菜单数据，并存入session中，由于页面头部是由菜单生成的，如果菜单是异步获取的，将会存在各种问题，所以进入系统时候保证菜单可用
- [x] 构建优化：css postcss的使用，自动添加前缀等功能
- [x] 是否使用 css module功能，好像加不上，antd不是module方式，如果使用module，antd less 构建会失败。 通过配置可以区分出那些模块使用css module，那些不使用。
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
