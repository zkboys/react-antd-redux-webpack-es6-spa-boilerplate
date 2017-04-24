import React, {Component} from 'react';
import {message} from 'antd';
import {PubSubMsg} from 'zk-react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

NProgress.configure({showSpinner: false});

export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions} = this.props;
        actions.setSystemMenusStatusByUrl();
        // 系统登录之后，获取菜单，保存到session中，这里就不用异步获取菜单了。
        // actions.getSystemMenus(() => {
        //     setTimeout(() => {
        //         actions.setSystemMenusStatusByUrl();
        //     });
        // });
        actions.getStateFromStorage();

        PubSubMsg.subscribe('message', ({type, message: msg, error = {}}) => {
            if (type === 'error') {
                handleErrorMessage(error);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });

        PubSubMsg.subscribe('history-change', (/* history */) => {
            actions.setSystemMenusStatusByUrl();
        });

        PubSubMsg.subscribe('start-fetching-component', () => {
            NProgress.start();
        });

        PubSubMsg.subscribe('end-fetching-component', () => {
            NProgress.done();
        });
    }

    render() {
        const {sideBarCollapsed, showSideBar} = this.props;
        let paddingLeft = sideBarCollapsed ? 60 : 200;
        paddingLeft = showSideBar ? paddingLeft : 0;
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div id="frame-content" className="frame-content" style={{paddingLeft}}>
                    <PageHeader/>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
