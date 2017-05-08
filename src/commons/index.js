import {isDev, isPro, isTest, isRC} from 'zk-react';

export function getAjaxBaseUrl() {
    if (isDev) {
        return 'http://172.16.135.168:8080/';
        // return 'http://172.16.41.157:8080/';
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
    const currentLoginUser = window.sessionStorage.getItem('currentLoginUser');
    return currentLoginUser ? JSON.parse(currentLoginUser) : null;
}
export function toLogin() {
    return window.location.href = '/login.html';
}
