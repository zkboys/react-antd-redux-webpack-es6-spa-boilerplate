import React, {Component} from 'react';
import {PageContent} from 'zk-react/antd';
import './style-test2.less';

export const PAGE_ROUTE = '/example/test2';
export default class Test2 extends Component {
    state = {}

    render() {
        return (
            <PageContent className="example-font-icon">
                <h1>222222</h1>
                <div className="test2-dev">
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
