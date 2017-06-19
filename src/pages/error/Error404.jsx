import React, {Component} from 'react';
import {Button} from 'antd';
import {Link} from 'react-router';
import error404 from './404.png';
import './style.less';

export default class Error404 extends Component {
    state = {};

    render() {
        return (
            <div styleName="error-page">
                <img src={error404} alt="404图片"/>
                <p styleName="error-text">您访问的页面不存在...</p>
                <Button
                    type="primary"
                    styleName="error-btn"
                    onClick={this.props.router.goBack}
                >
                    返回上一级
                </Button>
                <Button
                    type="primary"
                    styleName="error-btn error-btn-right"
                >
                    <Link to="/">返回首页</Link>
                </Button>
            </div>
        );
    }
}
