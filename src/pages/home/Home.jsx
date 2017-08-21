import React, {Component} from 'react';
import {PageContent} from 'zk-tookit/antd';
import './style.less';

export class LayoutComponent extends Component {
    state = {}

    componentWillReceiveProps(/* nextProps */) {
    }

    componentWillMount() {
        const {actions} = this.props;
        // actions.hidePageHeader();
        actions.hideSideBar();
        actions.setPageTitle('我是自定义页面标题');
        actions.setPageBreadcrumbs([
            {
                key: 'zidingyi',
                path: '',
                text: '自定义',
                icon: 'cloud',
            },
            {
                key: 'mianbaoxie',
                path: '',
                text: '面包屑',
                icon: 'notification',
            },
            {
                key: 'daohang',
                path: '',
                text: '导航',
                icon: 'smile-o',
            },
        ]);
    }

    render() {
        return (
            <PageContent styleName="root">
                <h1 styleName="title">需要丰富一下首页，提高吸引力</h1>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
