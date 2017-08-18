import React, {Component} from 'react';

/**
 * 将$ajax属性注入到目标组件props中，目标组件可以通过this.props.$ajax.get(...)方式进行使用;
 * 每次发送请求时，保存了请求的句柄，在componentWillUnmount方法中，进行统一cancel，进行资源释放，防止组件卸载之后，ajax回调还能执行引起的bug。
 * @example
 * const ajax = createAjaxHoc(zkAxiosInstance)
 * // 装饰器方式：
 * // @ajax()
 * // class SomeComponent extends Component {...}
 *
 * // 传递参数，修改注入的props属性
 * // @ajax({propName = 'ajax001'}) // 组件内调用：this.props.ajax001
 * // class SomeComponent extends Component {...}
 *
 * @example
 * // 直接使用
 * const WrappedComponet = ajax()(SomeComponent);
 *
 * @module ajax高阶组件
 */

const createAjaxHoc = zkAxiosInstance => ({propName = '$ajax'} = {}) => WrappedComponent => {
    class WithSubscription extends Component {
        constructor(props) {
            super(props);
            this._$ajax = {};
            this._$ajaxTokens = [];
            const methods = ['get', 'post', 'put', 'patch', 'del', 'singleGet', 'all'];

            for (let method of methods) {
                this._$ajax[method] = (...args) => {
                    const ajaxToken = zkAxiosInstance[method](...args);
                    this._$ajaxTokens.push(ajaxToken);
                    return ajaxToken;
                };
            }
        }

        static displayName = `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        componentWillUnmount() {
            this._$ajaxTokens.forEach(item => item.cancel());
        }

        render() {
            const injectProps = {
                [propName]: this._$ajax,
            };
            return <WrappedComponent {...injectProps} {...this.props}/>;
        }
    }

    return WithSubscription;
};

export default createAjaxHoc;
