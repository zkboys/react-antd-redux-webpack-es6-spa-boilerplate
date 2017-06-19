import React, {Component} from 'react';
import {PageContent} from 'zk-tookit/antd';
import {domEvent} from 'zk-tookit/react';
import './style-test3.less';

export const PAGE_ROUTE = '/example/test3';

@domEvent()
export default class Test3 extends Component {
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
            <PageContent className="example-font-icon">
                <h1>222222</h1>
                <div styleName="test2-dev good-boy" ref={node => this.div = node}>
                    wode
                </div>
                <div styleName="good-boy">
                    这个测试div
                </div>
                <div>
                    打包的速度问题怎么办？
                    我的真的啊
                </div>
                <div className="fast">要的就是速度</div>
            </PageContent>
        );
    }
}
