import React, {Component} from 'react';
import {Link} from 'react-router';
import {Menu} from 'antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import {renderNode} from 'zk-react/utils/tree-utils';
import {FontIcon} from 'zk-react/antd';
import {getScrollBarWidth} from 'zk-react/utils';

const SubMenu = Menu.SubMenu;

class LayoutComponent extends Component {
    componentDidMount() {

    }

    handleToggleSideBar = () => {
        const {actions} = this.props;
        actions.toggleSideBar();
    }
    handleOpenChange = (openKeys) => {
        const {actions} = this.props;
        actions.setSystemMenuOpenKeys(openKeys);
    }

    renderMenus() {
        const {currentTopMenuNode, sideBarCollapsed} = this.props;

        if (currentTopMenuNode && currentTopMenuNode.children) {
            if (sideBarCollapsed) {
                currentTopMenuNode.children.forEach(item => item.isTop = true);
            }
            return renderNode(currentTopMenuNode.children, (item, children) => {
                const isTop = item.isTop;
                const key = item.key;
                const path = item.path;
                const text = item.text;
                const icon = item.icon;
                let title = <span><FontIcon type={icon}/>{text}</span>;

                if (sideBarCollapsed && isTop) {
                    title = <span><FontIcon type={icon}/><span className="side-bar-top-menu-text">{text}</span></span>;
                }

                if (children) {
                    return (
                        <SubMenu key={key} title={title}>
                            {children}
                        </SubMenu>
                    );
                }
                return (
                    <Menu.Item key={key}>
                        <Link to={path}>
                            {title}
                        </Link>
                    </Menu.Item>
                );
            });
        }
    }

    render() {
        let {currentSideBarMenuNode} = this.props;
        const {menuOpenKeys, sideBarCollapsed, showSideBar} = this.props;
        const sideBarWidth = sideBarCollapsed ? 60 : 200;
        const mode = sideBarCollapsed ? 'vertical' : 'inline';
        const outerOverFlow = sideBarCollapsed ? 'visible' : 'hidden';
        const innerOverFlow = sideBarCollapsed ? '' : 'scroll';
        const scrollBarWidth = getScrollBarWidth();
        const innerWidth = (sideBarWidth + scrollBarWidth) - 1; // 1 为outer 的 border

        if (!currentSideBarMenuNode) currentSideBarMenuNode = {};
        return (
            <div className="frame-side-bar" style={{width: sideBarWidth, display: showSideBar ? 'block' : 'none'}}>
                <div className="logo">
                    <Link to="/">
                        架构
                    </Link>

                    <div className="side-bar-toggle" onClick={this.handleToggleSideBar}>
                        <FontIcon type="fa-bars"/>
                    </div>
                </div>
                <div className="menu-outer" style={{overflow: outerOverFlow}}>
                    <div className="menu-inner" style={{width: innerWidth, overflowY: innerOverFlow}}>
                        <Menu
                            style={{display: sideBarCollapsed ? 'none' : 'block'}}
                            mode={mode}
                            selectedKeys={[currentSideBarMenuNode.key]}
                            openKeys={menuOpenKeys}
                            onOpenChange={this.handleOpenChange}
                        >
                            {this.renderMenus()}
                        </Menu>
                        <Menu
                            style={{display: !sideBarCollapsed ? 'none' : 'block'}}
                            mode={mode}
                            selectedKeys={[currentSideBarMenuNode.key]}
                        >
                            {this.renderMenus()}
                        </Menu>
                    </div>
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
