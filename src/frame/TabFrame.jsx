import React, {Component} from 'react';
import {message, Tabs} from 'antd';
import {event} from 'zk-tookit/react';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

const TabPane = Tabs.TabPane;
const IFRAME_TYPE = 'iframe';
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
        const currentTab = this.tabs[activeKey];
        const path = currentTab.path;
        this.props.router.push(path);
    };
    handleTabEdit = (targetKey, action) => {
        if (action === 'remove') {
            // 最后一个不删除
            if (Object.keys(this.tabs).length <= 0) return;

            let prePath = location.pathname;
            // 关闭当前tab
            if (this.activeKey === targetKey) {
                let preIndex = 0;
                for (let i = 0; i < Object.keys(this.tabs).length; i++) {
                    if (Object.keys(this.tabs)[i] === targetKey) {
                        preIndex = i - 1;
                        break;
                    }
                }
                preIndex = preIndex < 0 ? 0 : preIndex;

                prePath = Object.keys(this.tabs)[preIndex];
            }
            this.props.router.push(prePath);

            Reflect.deleteProperty(this.tabs, targetKey);
        }
    };
    activeKey = 0;
    tabs = {};

    getTabName() {
        if (location.pathname === '/') {
            setTimeout(() => {
                const {actions} = this.props;
                actions.hidePageHeader();
                actions.hideSideBar();
            });
            return '首页';
        }
        const {currentSideBarMenuNode} = this.props;
        return this.props.location.query.tabName
            || (currentSideBarMenuNode && currentSideBarMenuNode.text)
            || '未知';
    }

    render() {
        const {sideBarCollapsed, showSideBar, showPageHeader, currentSideBarMenuNode, sideBarMinWidth, sideBarWidth} = this.props;
        const sideBarCollapsedWidth = sideBarMinWidth;
        const sideBarExpendedWidth = sideBarWidth;
        const headerHeight = 56;
        const tabHeight = 45;
        const pageHeaderHeight = 50;

        let paddingLeft = sideBarCollapsed ? sideBarCollapsedWidth : sideBarExpendedWidth;
        paddingLeft = showSideBar ? paddingLeft : 0;
        const paddingTop = showPageHeader ? headerHeight + tabHeight + pageHeaderHeight : headerHeight + tabHeight;


        const pathname = location.pathname;
        const childrenPathname = this.props.children && this.props.children.props.location.pathname;
        const activeKey = this.activeKey = pathname;

        const key = pathname;
        const name = this.getTabName();

        if (
            pathname === childrenPathname
            && !this.tabs[key]
        ) {
            this.tabs[key] = {
                key,
                name,
                path: pathname + location.search,
                component: this.props.children,
            };
        }

        let iframeContentStyle = {};
        if (currentSideBarMenuNode && currentSideBarMenuNode.url) {
            if (this.tabs[key] && this.tabs[key].type !== IFRAME_TYPE) {
                this.tabs[key].component = (
                    <iframe src={currentSideBarMenuNode.url} frameBorder={0} style={{width: '100%', height: '100%'}}/>
                );
                this.tabs[key].type = IFRAME_TYPE;
            }
            iframeContentStyle = {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            };
        }

        if (this.tabs[key]) {
            this.tabs[key].name = name;
        }

        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <div style={{
                    position: 'fixed',
                    zIndex: 998,
                    left: paddingLeft,
                    right: 0,
                    background: '#fff',
                    paddingTop: headerHeight + 8,
                    transition: 'left 300ms',
                }}>
                    <Tabs
                        hideAdd
                        animated={false}
                        type="editable-card"
                        activeKey={key}
                        onEdit={this.handleTabEdit}
                        onChange={this.handleTabChange}>
                        {
                            Object.keys(this.tabs).map(k => {
                                const item = this.tabs[k];
                                return <TabPane tab={item.name} key={item.key}/>;
                            })
                        }
                    </Tabs>
                </div>
                <PageHeader top={headerHeight + tabHeight}/>
                <div id="frame-content" className="frame-content" style={{paddingLeft, paddingTop, ...iframeContentStyle}}>
                    {
                        Object.keys(this.tabs).map(k => {
                            const item = this.tabs[k];
                            const style = {
                                display: item.key === activeKey ? 'block' : 'none',
                            };
                            if (item.type === IFRAME_TYPE) {
                                style.height = '100%';
                            }
                            return (
                                <div style={style} key={`tab-page-${item.key}`}>
                                    {item.component}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export function

mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
