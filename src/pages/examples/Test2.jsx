import React, {Component} from 'react';
import {PageContent} from 'zk-react/antd';
import './style-test2.less';

export const PAGE_ROUTE = '/example/test2';
export default class extends Component {
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
                    这下快了吗？
                    部分打包功能，会使rebuild速度加快
                </div>
            </PageContent>
        );
    }
}
