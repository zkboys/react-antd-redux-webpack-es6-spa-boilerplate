import React, {Component} from 'react';
import {PageContent} from 'zk-react/antd';
import domEvent from 'zk-react/utils/dom-event-decorator';
import './style-test2.less';

export const PAGE_ROUTE = '/example/test2';

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
            <PageContent className="example-font-icon">
                <h1>222222</h1>
                <div className="test2-dev" ref={node => this.div = node}>
                    wode
                </div>
                <div className="good-boy">
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
