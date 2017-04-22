import React, {Component} from 'react';
import {Link} from 'react-router';
import {PageContent} from 'zk-react/antd';
import pageRoutes from 'zk-react/route/page-routes';
import './style.less';

export class LayoutComponent extends Component {
    state = {}

    componentWillReceiveProps(/* nextProps */) {
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.hidePageHeader();
        actions.hideSideBar();
    }

    componentWillUnmount() {
        const {actions} = this.props;
        // 头部和侧边栏用的是一个，别忘了恢复，否则其他页面也不显示了。
        actions.showPageHeader();
        actions.showSideBar();
    }

    render() {
        return (
            <PageContent className="home">
                <h1>home123</h1>
                {
                    pageRoutes.map(route => <div key={route.path}><Link to={route.path}>{route.path}</Link></div>)
                }
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
