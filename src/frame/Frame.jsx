import React, {Component} from 'react';
import {message} from 'antd';
import {PubSubMsg} from 'zk-react';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';

export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions} = this.props;

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
        const {menuCollapsed} = this.props;
        const paddingLeft = menuCollapsed ? 60 : 200;
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div className="frame-content" style={{paddingLeft}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.systemMenu,
    };
}
