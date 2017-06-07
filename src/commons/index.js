import {isDev, isPro, isTest, isRC} from 'zk-react';
import devAjaxBaseUrl from '../../local/local-ajax-base-url';

export function getAjaxBaseUrl() {
    if (isDev) {
        return devAjaxBaseUrl;
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
