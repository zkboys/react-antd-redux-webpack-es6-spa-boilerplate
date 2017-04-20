import React, {Component} from 'react';
import {message} from 'antd';
import * as PubSubMsg from 'zk-react/utils/pubsubmsg';
import './style.less';
import Header from './Header';
import SideBar from './SideBar';

export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        PubSubMsg.subscribe('message', ({type, message: msg, error}) => {
            if (type === 'error') {
                if (error && error.message) {
                    // TODO 处理错误信息
                    msg = error.message;
                }
                message.error(msg, 3);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });
    }

    componentDidMount() {
        this.props.actions.getStateFromStorage();
    }

    render() {
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div className="frame-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
