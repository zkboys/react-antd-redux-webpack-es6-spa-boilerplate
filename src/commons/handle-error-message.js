import {message, Modal} from 'antd';
import {toLogin} from './index';

export default function (error, errorTip) {
    if (errorTip === false) return;
    let msg = '操作失败';
    if (errorTip) msg = errorTip;
    if (error.response) {
        const resData = error.response.data;
        const {status} = error.response;

        if (resData && resData.resultMsg) {
            msg = resData.resultMsg;
        }

        if (status === 401) { // 需要登录
            return toLogin();
        }

        if (status === 403) {
            msg = '您无权访问此资源！';
        }

        if (status === 404) {
            msg = '您访问的资源不存在！';
        }
    }

    if (error && error.message && error.message.startsWith('timeout of')) {
        msg = '请求超时！';
    }

    // 方便调试，开发时，使用message方式提示
    // 线上使用modal提示，防止用户注意不到message提示
    if (process.env.NODE_ENV === 'development') {
        message.error(msg, 3);
    } else {
        Modal.error({
            title: '提示',
            content: msg,
        });
    }
}
