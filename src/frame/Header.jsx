import React, {Component} from 'react';
import {Menu, Popconfirm, Popover, Badge} from 'antd';
import {Link} from 'react-router';
import classNames from 'classnames';
import {FontIcon, UserAvatar} from 'zk-tookit/antd';
import {getFirstValue} from 'zk-tookit/utils/tree-utils';
import service from '../services/service-hoc';
import {toLogin, getCurrentLoginUser} from '../commons';
import connectComponent from '../redux/store/connect-component';

@service()
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
    };

    handleLogout = () => {
        this.props.$service.systemService
            .logout()
            .then(() => {
                toLogin();
            });
    };

    renderMenus() {
        const {menuTreeData = []} = this.props;
        return menuTreeData.map(node => {
            const key = node.key;
            const path = getFirstValue(menuTreeData, node, 'path');
            const icon = node.icon;
            const text = node.text;
            if (text === '系统') return null;
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
                <p>消息3</p>
                <p>消息4</p>
                <p>消息5</p>
                <p>消息6</p>
            </div>
        );
    }

    render() {
        const {currentTopMenuNode = {}, sideBarCollapsed, showSideBar, sideBarMinWidth, sideBarWidth} = this.props;
        const frameHeaderClass = classNames({
            'side-bar-collapsed': sideBarCollapsed,
            'side-bar-hidden': !showSideBar,
        });
        const style = {
            left: sideBarCollapsed ? sideBarMinWidth : sideBarWidth,
        };

        if (!showSideBar) style.left = 0;

        const user = getCurrentLoginUser() ||
            {
                name: '匿名',
                loginName: 'no name',
                avatar: '',
            };
        const showNotice = true;
        return (
            <div className={`frame-header ${frameHeaderClass}`} style={style}>
                <div className={`left-menu ${frameHeaderClass}`} style={style}>
                    <Menu
                        selectedKeys={[currentTopMenuNode.key]}
                        mode="horizontal"
                    >
                        {this.renderMenus()}
                    </Menu>
                </div>
                <div className="right-menu">
                    {
                        showNotice ? // 暂时先不显示，有需求再加
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
                            : null
                    }
                    <Link to="/system/profile">
                        <div className="right-menu-item">
                            <UserAvatar user={user}/>
                            <span>{user.name}</span>
                        </div>
                    </Link>
                    <Popconfirm
                        onVisibleChange={this.handleLogoutPopVisibleChange}
                        placement="bottomRight"
                        title="您确定要退出系统吗？"
                        onConfirm={this.handleLogout}
                    >
                        <div className="right-menu-item">
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
