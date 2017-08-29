# services
> 前端服务成，提供ajax请求数据，统一的数据处理等操作。

提供service层可以有效的隔离前后端数据处理，统一对后端的接口进行端对端测试。在service层，可以进行数据的结构调整，将其他来源（组要是后端ajax请求返回的数据）进行处理后，统一提供给各个组件使用；
可以提高复用，统一维护数据交互。

## service命名
service命名不必带具体业务的名词，比如，UserService下getUserById可以直接定义为getById，因为调用的时候可以区分出`this.props.$service.userService.getById`。

## base-service
> 通过base-service 提供一些其他具体service的公共方法。

ajax请求基于restfull规范，base-service基于restfull提供了一些基础方法。

## 资源释放
> 在组件Unmount的时候，可以对service的资源释放（未完成的ajax请求等），调用service 的 `release`方法

提供了一个高阶组件，来解决自动资源释放问题`service-hoc.jsx`,此高阶组件作用：

1. 将创建各个Service类的实例，统一将service实例以`$service`变量名传入组件的props,
各个service以首字母消息驼峰命名，比如：UserService，经过`service-hoc.jsx`处理后，组件中以`this.props.$service.userService`方式进行调用。
1. 组件Unmount时，调用各个service实例的`release`方法进行资源释放。

