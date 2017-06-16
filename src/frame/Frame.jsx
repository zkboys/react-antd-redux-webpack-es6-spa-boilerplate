import React, {Component} from 'react';
import {message} from 'antd';
import {event} from 'zk-react';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

@event()
export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions, $on} = this.props;
        actions.setSystemMenusStatusByUrl();
        actions.getStateFromStorage();

        $on('message', ({type, message: msg, error = {}}) => {
            if (type === 'error') {
                handleErrorMessage(error);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });
    }

    render() {
        const {sideBarCollapsed, showSideBar, showPageHeader, currentSideBarMenuNode, sideBarMinWidth, sideBarWidth} = this.props;
        let paddingLeft = sideBarCollapsed ? sideBarMinWidth : sideBarWidth;
        paddingLeft = showSideBar ? paddingLeft : 0;
        const paddingTop = showPageHeader ? 106 : 56;
        let children = this.props.children;
        let iframeContentStyle = {};
        if (currentSideBarMenuNode && currentSideBarMenuNode.url) {
            children = <iframe src={currentSideBarMenuNode.url} frameBorder={0} style={{width: '100%', height: '100%'}}/>;
            iframeContentStyle = {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                height: '100%',
            };
        }
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <PageHeader/>
                <div id="frame-content" className="frame-content" style={{paddingLeft, paddingTop, ...iframeContentStyle}}>
                    {children}
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
