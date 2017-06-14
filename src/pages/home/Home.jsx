import React, {Component} from 'react';
import {Link} from 'react-router';
import {PageContent} from 'zk-react/antd';
import {Button} from 'antd';
import pageRoutes from '../../page-routes';
import './style.less';

export class LayoutComponent extends Component {
    state = {}

    componentWillReceiveProps(/* nextProps */) {
    }

    handleGetMenus = () => {
        const {actions} = this.props;
        actions.getSystemMenus(() => {
            setTimeout(() => {
                actions.setSystemMenusStatusByUrl();
            });
        });
    }

    componentWillMount() {
        const {actions} = this.props;
        // actions.hidePageHeader();
        actions.hideSideBar();
        actions.setPageTitle('自定义页面标题');
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
            <PageContent className="home">
                <h1>home123</h1>
                <Button onClick={this.handleGetMenus}>重新获取菜单</Button>
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
