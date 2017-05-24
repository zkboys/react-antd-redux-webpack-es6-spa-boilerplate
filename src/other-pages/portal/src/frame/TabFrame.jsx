import React, {Component} from 'react';
import {message, Tabs} from 'antd';
import {PubSubMsg} from 'zk-react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

NProgress.configure({showSpinner: false});

const tabData = {};
const TabPane = Tabs.TabPane;
export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions} = this.props;
        actions.setSystemMenusStatusByUrl();
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

    handleTabChange = (key) => {
        const {router} = this.props;
        router.push(key);
    }
    handleTabEdit = (key, action) => {
        if (action === 'remove') {
            const keys = Object.keys(tabData);
            if (keys && keys.length > 1) {
                const {router} = this.props;
                delete tabData[key];
                router.push(keys[0]);
            }
        }
    }

    render() {
        const {sideBarCollapsed, showSideBar, currentSideBarMenuNode} = this.props;
        const path = location.pathname;
        const node = tabData[path];
        if (path && !node) {
            tabData[path] = {
                component: this.props.children,
                title: currentSideBarMenuNode.text,
            };
        }
        let paddingLeft = sideBarCollapsed ? 60 : 200;
        paddingLeft = showSideBar ? paddingLeft : 0;
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <PageHeader/>
                <div id="frame-content" className="frame-content" style={{paddingLeft}}>
                    <Tabs
                        type="editable-card"
                        animated={false}
                        activeKey={currentSideBarMenuNode.path}
                        onEdit={this.handleTabEdit}
                        onChange={this.handleTabChange}>
                        {Object.keys(tabData).map(k => {
                            const item = tabData[k];
                            return <TabPane tab={item.title} key={k}>{item.component}</TabPane>;
                        })}
                    </Tabs>
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
