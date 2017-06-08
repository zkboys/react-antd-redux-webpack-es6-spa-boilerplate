import React, {Component} from 'react';
import {message, Tabs} from 'antd';
import {event} from 'zk-react';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

const TabPane = Tabs.TabPane;

@event()
export class LayoutComponent extends Component {

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

    handleTabChange = (activeKey) => {
        console.log(activeKey);
        const currentTab = this.tabPageKeys.find(item => item.key === activeKey);
        const path = currentTab.path;
        this.props.router.push(path);
    };
    tabPageKeys = [];
    tabPages = {};

    render() {
        const {sideBarCollapsed, showSideBar, showPageHeader, currentSideBarMenuNode} = this.props;
        const sideBarCollapsedWidth = 60;
        const sideBarExpendedWidth = 200;
        const headerHeight = 56;
        const tabHeight = 37;
        const pageHeaderHeight = 50;

        let paddingLeft = sideBarCollapsed ? sideBarCollapsedWidth : sideBarExpendedWidth;
        paddingLeft = showSideBar ? paddingLeft : 0;
        const paddingTop = showPageHeader ? headerHeight + tabHeight + pageHeaderHeight : headerHeight + tabHeight;
        if (!this.tabPageKeys.find(item => item.key === currentSideBarMenuNode.key) && currentSideBarMenuNode.key) {
            this.tabPageKeys.push({
                key: currentSideBarMenuNode.key,
                text: currentSideBarMenuNode.text,
                path: currentSideBarMenuNode.path,
            });
        }
        const activeKey = currentSideBarMenuNode.key;

        if (
            location.pathname === this.props.children.props.location.pathname
            && !this.tabPages[currentSideBarMenuNode.key]
        ) {
            this.tabPages[currentSideBarMenuNode.key] = this.props.children;
        }
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div style={{position: 'fixed', zIndex: 998, left: paddingLeft, right: 0, background: '#fff', paddingTop: headerHeight}}>
                    <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                        {
                            this.tabPageKeys.map(item => <TabPane tab={item.text} key={item.key}/>)
                        }
                    </Tabs>
                </div>
                <PageHeader top={headerHeight + tabHeight}/>
                <div id="frame-content" className="frame-content" style={{paddingLeft, paddingTop}}>
                    {
                        this.tabPageKeys.map(item => {
                            const style = {
                                display: item.key === activeKey ? 'block' : 'none',
                            };
                            return (
                                <div style={style} key={`tab-page-${item.key}`}>
                                    {this.tabPages[item.key]}
                                </div>
                            );
                        })
                    }
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
