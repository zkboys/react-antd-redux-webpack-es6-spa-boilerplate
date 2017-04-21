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

    renderMenus(menuCollapsed) {
        const {currentTopMenuNode} = this.props;
        if (currentTopMenuNode && currentTopMenuNode.children) {
            if (menuCollapsed) {
                currentTopMenuNode.children.forEach(item => item.isTop = true);
            }
            return renderNode(currentTopMenuNode.children, (item, children) => {
                const isTop = item.isTop;
                const key = item.key;
                const path = item.path;
                const text = item.text;
                const icon = item.icon;
                let title = <span><FontIcon type={icon}/>{text}</span>;

                if (menuCollapsed && isTop) {
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
        const {currentSideBarMenuNode, menuOpenKeys, menuCollapsed} = this.props;
        const sideBarWidth = menuCollapsed ? 60 : 200;
        const mode = menuCollapsed ? 'vertical' : 'inline';
        const outerOverFlow = menuCollapsed ? 'visible' : 'hidden';
        const innerOverFlow = menuCollapsed ? '' : 'scroll';
        const scrollBarWidth = getScrollBarWidth();
        const innerWidth = (sideBarWidth + scrollBarWidth) - 1; // 1 为outer 的 border
        return (
            <div className="frame-side-bar" style={{width: sideBarWidth}}>
                <div className="logo">
                    架构
                    <div className="side-bar-toggle" onClick={this.handleToggleSideBar}>
                        <FontIcon type="fa-bars"/>
                    </div>
                </div>
                <div className="menu-outer" style={{overflow: outerOverFlow}}>
                    <div className="menu-inner" style={{width: innerWidth, 'overflow-y': innerOverFlow}}>
                        <Menu
                            style={{display: menuCollapsed ? 'none' : 'block'}}
                            mode={mode}
                            selectedKeys={[currentSideBarMenuNode.key]}
                            openKeys={menuOpenKeys}
                            onOpenChange={this.handleOpenChange}
                        >
                            {this.renderMenus()}
                        </Menu>
                        <Menu
                            style={{display: !menuCollapsed ? 'none' : 'block'}}
                            mode={mode}
                            selectedKeys={[currentSideBarMenuNode.key]}
                        >
                            {this.renderMenus(menuCollapsed)}
                        </Menu>
                    </div>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state.systemMenu,
    };
}

/*
 menuTreeData: [],
 sideBarMenuTreeData: [],
 currentTopMenuNode: null,
 currentSideBarMenuNode: null,
 * */
export default connectComponent({LayoutComponent, mapStateToProps});
