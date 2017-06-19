import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {Button} from 'antd';
import error401 from './401.png';
import styles from './style.less';
import {toLogin} from '../../commons';

export const PAGE_ROUTE = '/error/401';

@cssModules(styles, {allowMultiple: true})
export default class Error401 extends Component {
    state = {
        remainSecond: 9,
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.si = setInterval(() => {
            let {remainSecond} = this.state;
            remainSecond--;
            if (remainSecond <= 0) {
                this.clear();
                toLogin();
            }
            this.setState({
                remainSecond,
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.clear();
    }

    clear() {
        if (this.si) {
            clearInterval(this.si);
        }
    }

    render() {
        const {remainSecond} = this.state;
        return (
            <div styleName="error-page">
                <img src={error401} alt="401图片"/>
                <p styleName="error-text">您还未登录，请您先登录！</p>
                <p styleName="error-text error-sub-text">{remainSecond} 秒后跳转到登录页面...</p>
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
                    onClick={toLogin}
                >
                    马上登录
                </Button>
            </div>
        );
    }
}
