import React from 'react';
import {Button} from 'antd';
import {Link} from 'react-router';
import error404 from './404.png';
import './style.less';

export default function Error404(props) {
    return (
        <div className="error-page">
            <img src={error404} alt="404图片"/>
            <p className="error-text">您访问的页面不存在...</p>
            <Button
                type="primary"
                className="error-btn"
                onClick={props.router.goBack}
            >
                返回上一级
            </Button>
            <Button
                type="primary"
                className="error-btn error-btn-right"
            >
                <Link to="/">返回首页</Link>
            </Button>
        </div>
    );
}
