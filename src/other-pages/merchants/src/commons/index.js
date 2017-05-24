import {isDev, isPro, isTest, isRC} from 'zk-react';

export function getAjaxBaseUrl() {
    if (isDev) {
        return 'http://172.16.136.82:8080/'; // 测试服务器
        // return 'http://172.16.135.97:8080'; // 开发服务
        // return 'http://172.16.40.245:8080'; // 邢鑫
        // return 'http://172.16.40.76:8080/'; // 春风
        // return 'http://172.16.40.50:8081/';
        // return 'http://172.16.20.57:8081';
        // return 'http://172.16.40.231:8080/';
    }
    if (isPro) {
        return '/api/';
    }

    if (isTest) {
        return '/api/';
    }

    if (isRC) {
        return '/api/';
    }
    return '/';
}

export function getCurrentLoginUser() {
    // TODO
    return {
        createUserId: '111645',
        salesmanCode: '111645',
        orgNo: '8201963574',
    };
}

export function toLogin() {
    return window.location.href = '/login';
}
