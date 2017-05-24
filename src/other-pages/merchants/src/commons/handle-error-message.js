import {message} from 'antd';

export default function (error, errorTip) {
    if (error.response) {
        const resData = error.response.data;
        const {status} = error.response;
        if (resData && resData.message) {
            errorTip = resData.message;
        }
        if (status === 404) {
            errorTip = '您访问的资源不存在！';
        }
        if (status === 403) {
            errorTip = '您无权访问此资源！';
        }
        if (status === 413) {
            errorTip = '您提交的数据过大！';
        }
        if (resData && resData.message && resData.message.startsWith('timeout of')) {
            errorTip = '请求超时！';
        }
    }

    // TODO 根据 error 约定，处理其他类型error

    message.error(errorTip, 3);
}
