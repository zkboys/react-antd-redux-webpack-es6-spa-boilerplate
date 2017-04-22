import React, {Component} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router';
import {FontIcon} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import {getFirstValue} from 'zk-react/utils/tree-utils';

class LayoutComponent extends Component {
    componentDidMount() {

    }

    renderMenus() {
        const {menuTreeData} = this.props;
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

    render() {
        const {currentTopMenuNode = {}, sideBarCollapsed, showSideBar} = this.props;
        let className = sideBarCollapsed ? 'side-bar-collapsed' : '';
        className = showSideBar ? className : `${showSideBar} side-bar-hidden`;
        return (
            <div className={`frame-header ${className}`}>
                <div className="menu">
                    <Menu
                        selectedKeys={[currentTopMenuNode.key]}
                        mode="horizontal"
                    >
                        {this.renderMenus()}
                    </Menu>
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
