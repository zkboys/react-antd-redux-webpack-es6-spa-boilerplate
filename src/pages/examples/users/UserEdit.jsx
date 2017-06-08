import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PageContent} from 'zk-react/antd';

export const PAGE_ROUTE = '/example/users/+add';
export class LayoutComponent extends Component {
    state = {}

    static contextTypes = {
        router: PropTypes.object,
    };

    componentDidMount() {
        const {route} = this.props;
        const {router} = this.context; // If contextTypes is not defined, then context will be an empty object.

        router.setRouteLeaveHook(route, (/* nextLocation */) => {
            /* eslint-disable */
            const truthBeTold = window.confirm('您有未保存的内容，确定离开此页面？');
            /* eslint-enable */
            if (truthBeTold) {
                // 点击了确定，返回true离开当前页面
                return true;
            }
            // 恢复地址栏
            window.history.pushState({}, '', route.path);

            // 返回 false 会继续停留当前页面，
            // 否则，返回一个字符串，会显示给用户，让其自己决定
            return false;
        });
    }

    render() {
        return (
            <PageContent className="user-add">
                <h1 style={{textAlign: 'center'}}>添加用户</h1>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
