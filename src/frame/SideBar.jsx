import React, {Component} from 'react';
import {Link} from 'react-router';
import {Menu} from 'antd';
import Rnd from 'react-rnd';
import {renderNode} from 'zk-react/utils/tree-utils';
import {FontIcon} from 'zk-react/antd';
import {getScrollBarWidth} from 'zk-react/utils';
import connectComponent from '../redux/store/connect-component';
import {getWindowSize, addEventListener} from '../commons';


const SubMenu = Menu.SubMenu;

class LayoutComponent extends Component {
    state = {
        windowHeight: 600,
    }

    componentWillMount() {
        this.setState({windowHeight: getWindowSize().height});
        addEventListener(window, 'resize', () => {
            this.setState({windowHeight: getWindowSize().height});
        });
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
        let {windowHeight} = this.state;
        let {currentSideBarMenuNode} = this.props;
        const headerHeight = 56;
        const {menuOpenKeys, sideBarCollapsed, showSideBar, sideBarMinWidth, sideBarWidth} = this.props;
        const sideBarCurrentWidth = sideBarCollapsed ? sideBarMinWidth : sideBarWidth;
        const mode = sideBarCollapsed ? 'vertical' : 'inline';
        const outerOverFlow = sideBarCollapsed ? 'visible' : 'hidden';
        const innerOverFlow = sideBarCollapsed ? '' : 'scroll';
        const scrollBarWidth = getScrollBarWidth();
        const innerWidth = (sideBarCurrentWidth + scrollBarWidth) - 1; // 1 为outer 的 border
        const logo = sideBarCollapsed ? 'ZK' : '管理系统架构';

        if (!currentSideBarMenuNode) currentSideBarMenuNode = {};
        return (

            <div className="frame-side-bar" style={{width: sideBarCurrentWidth, display: showSideBar ? 'block' : 'none'}}>
                <div className="logo">
                    <Link to="/">
                        {logo}
                    </Link>

                    <div className="side-bar-toggle" onClick={this.handleToggleSideBar}>
                        <FontIcon type="fa-bars"/>
                    </div>
                </div>
                <Rnd
                    default={{
                        x: 0,
                        y: 0,
                        height: windowHeight - headerHeight,
                        width: sideBarCurrentWidth,
                    }}
                    // style={{transition: 'width 300ms'}}
                    disableDragging
                    enableResizing={{
                        bottom: false,
                        bottomLeft: false,
                        bottomRight: false,
                        left: false,
                        right: true,
                        top: false,
                        topLeft: false,
                        topRight: false,
                    }}
                    onResize={(event, direction, refToElement) => {
                        if (!sideBarCollapsed) {
                            const newSideBarWidth = parseInt(refToElement.style.width, 10);
                            console.log(newSideBarWidth);
                            this.props.actions.setSideBarWidth(newSideBarWidth);
                        }
                    }}
                >
                    <div className="menu-outer" style={{overflow: outerOverFlow, top: 0}}>
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
                </Rnd>
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
