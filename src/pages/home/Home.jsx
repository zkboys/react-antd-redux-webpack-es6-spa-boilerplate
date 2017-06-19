import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';
import {PageContent} from 'zk-tookit/antd';
import {Button} from 'antd';
import pageRoutes from '../../page-routes';
import styles from './style.less';

@cssModules(styles)
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
            <PageContent styleName="root">
                <h1 styleName="title">home123</h1>
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
