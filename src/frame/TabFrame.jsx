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
    handleTabEdit = (targetKey, action) => {
        console.log(targetKey, action);
        if (action === 'remove') {
            // 最后一个不删除
            if (this.tabPageKeys.length <= 0) return;

            let prePath = location.pathname;
            // 关闭当前tab
            if (this.activeKey === targetKey) {
                let preIndex = 0;
                for (let i = 0; i < this.tabPageKeys.length; i++) {
                    if (this.tabPageKeys[i].key === targetKey) {
                        preIndex = i - 1;
                    }
                }
                preIndex = preIndex < 0 ? 0 : preIndex;

                prePath = this.tabPageKeys[preIndex].path;
            }
            this.props.router.push(prePath);
            this.tabPageKeys = this.tabPageKeys.filter(item => item.key !== targetKey);
            // const removedComponent = this.tabpages[targetKey];
            // console.log(removedComponent);
            Reflect.deleteProperty(this.tabPages, targetKey);
        }
    };
    tabPageKeys = [];
    tabPages = {};
    activeKey = 0;

    render() {
        const {sideBarCollapsed, showSideBar, showPageHeader, currentSideBarMenuNode} = this.props;
        const sideBarCollapsedWidth = 60;
        const sideBarExpendedWidth = 200;
        const headerHeight = 56;
        const tabHeight = 45;
        const pageHeaderHeight = 50;

        let paddingLeft = sideBarCollapsed ? sideBarCollapsedWidth : sideBarExpendedWidth;
        paddingLeft = showSideBar ? paddingLeft : 0;
        const paddingTop = showPageHeader ? headerHeight + tabHeight + pageHeaderHeight : headerHeight + tabHeight;

        const menuKey = currentSideBarMenuNode.key;
        if (!this.tabPageKeys.find(item => item.key === menuKey) && menuKey) {
            this.tabPageKeys.push({
                key: menuKey,
                text: currentSideBarMenuNode.text,
                path: currentSideBarMenuNode.path,
            });
        }
        const activeKey = this.activeKey = menuKey;

        const pathname = location.pathname;
        const childrenPathname = this.props.children.props.location.pathname;

        if (
            pathname === childrenPathname
            && !this.tabPages[menuKey]
        ) {
            this.tabPages[menuKey] = this.props.children;
        }

        // 没有菜单对应的页面，通过 /+ 来确定的
        if (
            pathname.indexOf('/+') === -1
            && childrenPathname.indexOf('/+') > -1
        ) {
            Reflect.deleteProperty(this.tabPages, menuKey);
        }

        if (
            pathname === childrenPathname
            && pathname.indexOf('/+') > -1
        ) {
            this.tabPages[menuKey] = this.props.children;
        }

        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div style={{position: 'fixed', zIndex: 998, left: paddingLeft, right: 0, background: '#fff', paddingTop: headerHeight + 8}}>
                    <Tabs
                        hideAdd
                        animated={false}
                        type="editable-card"
                        activeKey={activeKey}
                        onEdit={this.handleTabEdit}
                        onChange={this.handleTabChange}>
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
