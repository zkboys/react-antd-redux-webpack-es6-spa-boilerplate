# zk-react-demo
zk-react 示例项目

## 项目结构
```
├── actions         // redux action定义
├── commons         // 系统公共方法，组件
├── constants       // redux相关常量、系统其他常量
├── frame           // 页面框架，头部+左侧等
├── mock            // mock数据，截获ajax请求，便于前端单独调试
│   └── mockdata    // 模拟数据 mockjs
├── pages           // 业务页面，业务开发主要关系目录
│   ├── error       // 一些error页面，404 403 401 等等
│   ├── examples    // 一些例子
│   └── home        // 首页
├── reducers        // redux reducers定义目录
├── App.jsx         // 项目入口文件
├── global.less     // 全局样式定义
```