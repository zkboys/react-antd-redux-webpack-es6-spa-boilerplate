# zk-react-template-management
zk-react 管理系统模板，UI基于antd，完整的登录、退出登录、菜单等结构

## Prepare
前端开发前期准备工作

### 需要学习的技术
1. [es6](http://es6.ruanyifeng.com/) 重点：2、3、7、8、9、14、19、20、22
1. [react](https://facebook.github.io/react/) state props 周期函数 jsx
1. [UI antd](https://ant.design/index-cn)
1. 时间处理：[moment](http://momentjs.com/)
1. js工具：[lodash](https://lodash.com/)
1. 构建：[webpack](https://doc.webpack-china.org/)
1. cssModule：[css-module](https://github.com/gajus/react-css-modules)
1. 数据管理：[redux](http://redux.js.org/)

### 需要安装的软件
1. [nodejs](http://nodejs.cn/)
1. [yarn](https://yarnpkg.com/zh-Hans/)
1. [ide webstorm](http://www.jetbrains.com/webstorm/) license server : http://idea.imsxm.com/
1. [git](https://git-scm.com/)

## Build Setup
> 使用[yarn](https://yarnpkg.com/zh-Hans/)

``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# clear cache 如果发现源码与webpack编译文件明显不一致，有可能是缓存脏数据
yarn run clear-dev-cache

```

## 项目结构
```
├── commons             // 系统公共方法，组件
├── constants           // redux相关常量、系统其他常量
├── frame               // 页面框架，头部+左侧等
├── mock                // mock数据，截获ajax请求，便于前端单独调试
│   └── mockdata        // 模拟数据 mockjs
├── pages               // 业务页面，业务开发主要关系目录
│   ├── error           // 一些error页面，404 403 401 等等
│   ├── examples        // 一些例子
│   └── home            // 首页
├── redux               // redux 相关
│   ├── actions         // redux action定义
│   ├── reducers        // redux reducers定义目录
│   └── actionTypes.js  // actions 和 reducers使用的types常量
├── App.jsx             // 项目入口文件
└── global.less         // 全局样式定义

```

## 系统菜单激活状态
> 系统菜单的激活状态根据url地址，自动判定

- 如果是二级页面，不如添加页面，需要保持其父级页面菜单状态，菜单path需要写成`parentPath/+childPath`，使用`/+`作为分界，比如：
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
    const {actions} = this.props;
    actions.hidePageHeader();
}

```

### 修改标题
```
componentWillMount() {
    const {actions} = this.props;
    actions.setPageTitle('自定义页面标题');
}
```

### 自定义面包屑导航
```
componentWillMount() {
    const {actions} = this.props;
    actions.setPageBreadcrumbs([
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

## 页面写法
> 为了简化开发，通过脚本自动生成部分代码，需要注意几个约定

### 路由
> 页面导出 PAGE_ROUTE 常量即可，常量的值对应菜单的path

```
export const PAGE_ROUTE = '/example/users';

// 如果二级页面保持父级页面菜单选中状态，二级页面路由约定：parent_page_route/+child_page_route，通过`/+`进行分割
export const PAGE_ROUTE = '/example/users/+add';
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
- [ ] 系统注入到props中的变量统一使用'$'开头，比如$ajax $event $domEvent $service $actions
- [ ] 字体图标，团队有条件还是定制的好，全部引入会多出300~400KB。
- [ ] 修改less时可以hot reload ，修改jsx为什么直接reload？
- [ ] antd 图标本地部署问题：缓存问题，antd.less需要全部引入，会多550KB的css代码
- [ ] docker 前端生产环境部署
- [ ] antd 自定义异步校验，多个异步校验互相干扰问题 可以使用Promise.all包装各个请求？
- [ ] 菜单匹配时，如果path携带参数，怎么能匹配成功？
- [ ] css module class name 长短问题
- [ ] css module=true background: url(); 问题 Module not found: Error: Can't resolve 'login-bg.jpg'

## 脚手架步骤
1. git clone zk-react-template-management object-name
2. cd object-name
3. rm -rf .git
4. change local-default to local
5. rm -rf local-default
6. yarn


## 第三方UI
1. antd
1. react-color

## 自定义组件
1. 基于antd扩展的自定义业务无关组件

## 第三方js库
1. 工具方法： lodash
1. ajax请求：axios
1. mock数据： mockjs axios-mock-adapter
1. 字符串校验：validator.js
1. jsx中className处理：classnames
1. jsx中内联样式处理：reactcss
1. 时间处理：moment
1. 进度条：nprogress
1. url地址解析：query-string
1. 随机字符串：uuid

## 自定义js库
1. 图片处理
1. 树操作方法
1. 发布订阅
1. 正则
1. 校验方法
1. 存储

## 构建

## redux

## router

## 脚本、自动化

## 项目结构

## 如何简化规范开发
1. 公共组件编写规范
1. 通用业务组件
    1. 通用业务组件编写规范
    1. 什么场景适合整理通用组件
    1. 业务组件粒度
1. 大型web项目结构、项目分层，为什么这么分层
1. 可以提高项目开发效率，提高代码质量的最佳实践
    1. 菜单、页面标题、面包屑导航自动获取+可配置
    1. 简化的redux写法、与存储自动同步、异步redux写法、异常处理
    1. ajax自动提示封装、全局+局部配置、ajax高阶组件自动释放资源、统一错误处理
    1. 路由简化配置，页面直接声明一个PAGE_ROUTE变量，自动生成路由配置文件
    1. 后端交互统一封装成service、提供基于restFull，提供BaseService、service高阶组件自动释放资源。
    1. mock规则可配置
    1. 基础CRUD代码生成
    1. IDE模板，新建文件初始化代码

## 前端开发流程

1. 需求评审、确认
1. 基于需求文档、产品原型进行页面开发
1. 基于swagger（接口规范）接口对接
1. 真实接口对接，前后端联调
1. 基于需求、原型、测试用例进行页面整体自测
1. 提测、修改bug


