import React, {Component} from 'react';
import {message, Spin} from 'antd';
import {event} from 'zk-react';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

@event()
export class LayoutComponent extends Component {
    state = {};

    componentWillMount() {
        const {actions, $on} = this.props;
        actions.setSystemMenusStatusByUrl();
        actions.getStateFromStorage();

        // redux 中有publish message消息
        $on('message', ({type, message: msg, error = {}}) => {
            if (type === 'error') {
                handleErrorMessage(error);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });

        // 开始异步获取页面js
        $on('fetching-page-start', () => {
            actions.showFullPageLoading();
        });
        // 结束异步获取页面js
        $on('fetching-page-end', () => {
            actions.hideFullPageLoading();
        });
    }

    render() {
        const {
            sideBarCollapsed,
            showSideBar,
            showPageHeader,
            currentSideBarMenuNode,
            sideBarMinWidth,
            sideBarWidth,
            fullPageLoading,
        } = this.props;
        let paddingLeft = sideBarCollapsed ? sideBarMinWidth : sideBarWidth;
        paddingLeft = showSideBar ? paddingLeft : 0;

        const paddingTop = showPageHeader ? 106 : 56;
        let children = this.props.children;
        let iFrameContentStyle = {};

        // 通过url，加载iFrame页面
        if (currentSideBarMenuNode && currentSideBarMenuNode.url) {
            children = <iframe src={currentSideBarMenuNode.url} frameBorder={0} style={{width: '100%', height: '100%'}}/>;
            iFrameContentStyle = {
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
                <div id="frame-content" className="frame-content" style={{paddingLeft, paddingTop, ...iFrameContentStyle}}>
                    <Spin spinning={fullPageLoading}>{children}</Spin>
                </div>
            </div>
        );
    }
}

export const mapStateToProps = (state) => ({...state.frame});
