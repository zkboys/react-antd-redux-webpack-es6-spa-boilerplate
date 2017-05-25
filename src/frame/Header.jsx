import React, {Component} from 'react';
import {Menu, Popconfirm, Popover, Badge} from 'antd';
import {Link} from 'react-router';
import classNames from 'classnames';
import {FontIcon, UserAvatar} from 'zk-react/antd';
import {getFirstValue} from 'zk-react/utils/tree-utils';
import {session} from 'zk-react/utils/storage';
import {toLogin, getCurrentLoginUser} from '../commons';
import connectComponent from '../redux/store/connectComponent';

class LayoutComponent extends Component {
    componentDidMount() {

    }

    handleLogoutPopVisibleChange = (visible) => {
        if (visible) {
            // 使弹框固定，不随滚动条滚动
            window.setTimeout(() => {
                const popover = document.querySelector('.ant-popover.ant-popover-placement-bottomRight');
                popover.style.top = '56px';
                popover.style.position = 'fixed';
            }, 0);
        }
    }

    handleLogout = () => {
        session.clear();
        toLogin();
    }

    renderMenus() {
        const {menuTreeData = []} = this.props;
        return menuTreeData.map(node => {
            const key = node.key;
            const path = getFirstValue(menuTreeData, node, 'path');
            const icon = node.icon;
            const text = node.text;
            return (
                <Menu.Item key={key}>
                    <Link to={path}>
                        <FontIcon type={icon}/>{text}
                    </Link>
                </Menu.Item>
            );
        });
    }

    renderNoticeContent() {
        return (
            <div>
                <p>消息1消息1消息1消息1消息1消息1</p>
                <p>消息2</p>
            </div>
        );
    }

    render() {
        const {currentTopMenuNode = {}, sideBarCollapsed, showSideBar} = this.props;
        const frameHeaderClass = classNames({
            'side-bar-collapsed': sideBarCollapsed,
            'side-bar-hidden': !showSideBar,
        });

        const user = getCurrentLoginUser() ||
            {
                name: '匿名',
                loginName: 'no name',
                avatar: '',
            };
        return (
            <div className={`frame-header ${frameHeaderClass}`}>
                <div className={`left-menu ${frameHeaderClass}`}>
                    <Menu
                        selectedKeys={[currentTopMenuNode.key]}
                        mode="horizontal"
                    >
                        {this.renderMenus()}
                    </Menu>
                </div>
                <div className="right-menu">
                    <Popover
                        content={this.renderNoticeContent()}
                    >
                        <div className="right-menu-item">
                            <Badge count={100}>
                                <FontIcon type="message"/>
                                <span className="notice-label">通知</span>
                            </Badge>
                        </div>
                    </Popover>
                    <div className="right-menu-item">
                        <UserAvatar user={user}/>
                        <span>{user.name}</span>
                    </div>
                    <Popconfirm
                        onVisibleChange={this.handleLogoutPopVisibleChange}
                        placement="bottomRight"
                        title="您确定要退出系统吗？"
                        onConfirm={this.handleLogout}
                    >
                        <div className="right-menu-item">
                            <span>退出登录</span>
                            <FontIcon type="logout" size="lg"/>
                        </div>
                    </Popconfirm>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
