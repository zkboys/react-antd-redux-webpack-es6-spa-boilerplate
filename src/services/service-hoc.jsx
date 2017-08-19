import React, {Component} from 'react';
import {firstLowerCase} from 'zk-tookit/utils';
import * as allServices from './index';
/**
 * service高级组件
 * 将$services属性注入到目标组件props中，目标组件可以通过this.props.$services(...)方式进行使用;
 * 在componentWillUnmount方法中，进行统一资源（ajax等）清除（打断未完成ajax请求）
 * @example
 * import service from 'path/to/service-hoc';
 * // 装饰器方式：
 * // @service() // 不指定service，将注入所有service
 * // class SomeComponent extends Component {...}
 *
 * // 传递参数，修改注入的props属性
 * // @event({propName = '$$service', SomeService}) // 组件内调用：this.props.$$service
 * // class SomeComponent extends Component {...}
 *
 * @example
 * // 直接使用
 * import {service} from 'path/to/service-hoc';
 * const WrappedComponet = service()(SomeComponent);
 *
 * @module 发布订阅高级组件
 */

export default function service(options) {
    return function (WrappedComponent) {
        class WithSubscription extends Component {
            constructor(props) {
                super(props);
                const {propName = '$service'} = options || {};
                this.propName = propName;
                this.services = {};
                // 创建service实例，实例名首字母自动转为小写

                // 没有设置service，默认注入全部service
                if (!options || (Object.keys(options).length === 1 && Object.keys(options)[0] === 'propName')) {
                    Object.keys(allServices).forEach(item => {
                        if (item !== this.propName) this.services[firstLowerCase(item)] = new allServices[item]();
                    });
                } else {
                    // 有指定service
                    Object.keys(options).forEach(item => {
                        if (item !== this.propName) this.services[firstLowerCase(item)] = new options[item]();
                    });
                }
            }

            static displayName = `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

            componentWillUnmount() {
                // 当前组件卸载，释放各个service占用的资源
                Object.keys(this.services).forEach(item => {
                    const se = this.services[item];
                    if (se.release) {
                        se.release();
                    }
                });
            }

            render() {
                const injectProps = {
                    [this.propName]: this.services,
                };
                return <WrappedComponent {...injectProps} {...this.props}/>;
            }
        }

        return WithSubscription;
    };
}
