import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {Button} from 'antd';
import error403 from './403.png';
import styles from './style.less';


export const PAGE_ROUTE = '/error/403';

@cssModules(styles, {allowMultiple: true})
export default class Error403 extends Component {
    state = {
        remainSecond: 9,
    }

    componentDidMount() {
        this.si = setInterval(() => {
            let {remainSecond} = this.state;
            remainSecond--;
            if (remainSecond <= 0) {
                this.clear();
                this.props.router.goBack();
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
                <img src={error403} alt="401图片"/>
                <p styleName="error-text">非常抱歉，您没权访问此页面！</p>
                <p styleName="error-text error-sub-text">{remainSecond} 秒后返回上一个页面...</p>
                <Button
                    type="primary"
                    styleName="error-btn"
                    onClick={this.props.router.goBack}
                >
                    马上返回
                </Button>
            </div>
        );
    }
}
