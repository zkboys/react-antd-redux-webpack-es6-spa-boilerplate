# zk-react-template-management
zk-react 管理系统模板，UI基于antd，完整的登录、退出登录、菜单等结构

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

### redux
> 页面导出 `LayoutComponent` `mapStateToProps这两个变量`，系统会自动将当前组件与redux进行连接

```
export class LayoutComponent{...}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
```

如果页面想使用简化的redux（只数据共享，操作不共享），请定义INIT_STATE常量
```
// 初始化数据
export const INIT_STATE = {
    scope: 'actionsSetState', // 定义命名空间
    sync: true, // 是否与localStorage进行同步
    a: {
        b: {
            c: ['ccc'],
            c2: 'c2',
        },
        b1: [],
        b2: 'b2',
    },
    d: 'd',
    e: 'e',
};

// 注入数据
export function mapStateToProps(state) {
    return {
        ...state.pageState.actionsSetState,
    };
}

// 取值
const {a, d, e} = this.props;

// 赋值
this.props.actions.setState({a: 'new value'});
```
注：非挂载到router上的组件，需要自行调用connectComponent进行redux的连接，所需参数请查看源码。

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

## dll
开发模式使用dll优化rebuild速度，大概能够提高1倍（40个页面以上）
生产环境不使用dll，dll将所有的第三方打包，2.7M，太大，如果不适用dll，webpack2本身有优化，没有使用到的export 代码不会打包
如果使用dll，将多出近2M的无用资源。
生产环境简单使用：CommonsChunkPlugin

## TODO
- [x] 登录之后，获取菜单数据，并存入session中，由于页面头部是由菜单生成的，如果菜单是异步获取的，将会存在各种问题，所以进入系统时候保证菜单可用
- [x] 构建优化：css postcss的使用，自动添加前缀等功能
- [ ] 是否使用 css module功能，好像加不上，antd不是module方式，如果使用module，antd less 构建会失败。
- [ ] 修改less时可以hot reload ，修改jsx为什么直接reload？
- [ ] antd 图标本地部署问题：缓存问题，antd.less需要全部引入，会多550KB的css代码