import React, {Component} from 'react';
import {message} from 'antd';
import {PubSubMsg} from 'zk-react';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions} = this.props;
        actions.setSystemMenusStatusByUrl();
        actions.getSystemMenus(() => {
            setTimeout(() => {
                actions.setSystemMenusStatusByUrl();
            });
        });
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
    }

    render() {
        const {sideBarCollapsed, showSideBar} = this.props;
        let paddingLeft = sideBarCollapsed ? 60 : 200;
        paddingLeft = showSideBar ? paddingLeft : 0;
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div className="frame-content" style={{paddingLeft}}>
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
