import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {PageContent} from 'zk-tookit/antd';
import {domEvent} from 'zk-tookit/react';
import styles from './style-test2.less';

export const PAGE_ROUTE = '/example/test2';

@cssModules(styles)
@domEvent()
export default class Test2 extends Component {
    state = {};

    componentDidMount() {
        this.props.$addEventListener(window, 'resize', () => {
            console.log(123);
        });
        this.props.$addEventListener(this.div, 'click', () => {
            console.log('wode');
        });
    }

    render() {
        return (
            <PageContent styleName="example-font-icon">
                <h1>222222</h1>
                <div styleName="test2-dev" ref={node => this.div = node}>
                    wode
                </div>
                <div styleName="good-boy">
                    这个测试div
                </div>
                <div>
                    打包的速度问题怎么办？
                    我的真的啊
                </div>
                <div styleName="fast">要的就是速度</div>
            </PageContent>
        );
    }
}
