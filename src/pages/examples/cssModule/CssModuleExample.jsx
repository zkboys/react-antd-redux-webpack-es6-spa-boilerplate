import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {QueryBar} from 'zk-tookit/antd';
import styles from './style.less';

export const PAGE_ROUTE = '/example/css';

@cssModules(styles)
export default class LayoutComponent extends Component {
    state = {}

    componentDidMount() {

    }

    componentWillUnmount() {
        console.log('unmount');
    }

    render() {
        /*
         *
         建议遵循如下原则:
          不使用选择器,只使用 class 名来定义样式;
          不层叠多个 class,只使用一个 class 把所有样式定义好;  所有样式通过 composes 组合来实现复用;
          不嵌套。

         react-css-modules 优势
          我们不用再关注是否使用驼峰来命名 class 名;
          我们不用每一次使用 CSS Modules 的时候都关联 style 对象;
          使用 CSS Modules,容易使用 :global 去解决特殊情况,使用 react-css-modules 可写成 <div className="global-css" styleName="local-module"></div>,这种形式轻松对应全局和局
         部;
          当 styleName 关联了一个 undefined CSS Modules 时,我们会得到一个警告;
          我们可以强迫使用单一的 CSS Modules。
         * */
        return (
            <div styleName="root">init
                <QueryBar>测试</QueryBar>
                <div styleName="test-inner">
                    我是内部的
                </div>
            </div>
        );
    }
}
