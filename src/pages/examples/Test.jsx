import React, {Component} from 'react';
import {PageContent} from 'zk-react/antd';

export const PAGE_ROUTE = '/example/test';
export default class extends Component {
    state = {}

    render() {
        return (
            <PageContent className="example-font-icon">
                <h1>test</h1>
            </PageContent>
        );
    }
}
