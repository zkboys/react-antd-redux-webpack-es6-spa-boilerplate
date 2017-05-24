import React, {Component} from 'react';
import {Card} from 'antd';
import './style.less';


export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    componentWillMount() {
        const {actions} = this.props;
        actions.hidePageHeader();
        actions.hideSideBar();
    }

    render() {
        return (
            <Card>欢迎登陆统一门户管理系统</Card>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
