import {isDev, isPro, isTest, isRC} from 'zk-react';
import {session} from 'zk-react/utils/storage';
import mockUrls from '../mock/url-config';

export function getAjaxBaseUrl() {
    if (isDev) {
        return require('../../local/local-ajax-base-url'); // 只有div模式才会引用文件
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

// 这里由于keyPrefix 要设置成 currentLoginUser.id 的原因，无法使用封装过的storage
export function getCurrentLoginUser() {
    const currentLoginUser = window.sessionStorage.getItem('currentLoginUser');
    return currentLoginUser ? JSON.parse(currentLoginUser) : null;
}

export function setCurrentLoginUser(currentLoginUser) {
    window.sessionStorage.setItem('currentLoginUser', JSON.stringify(currentLoginUser));
}

export function getMenuTreeData() {
    return session.getItem('menuTreeData');
}

export function setMenuTreeData(menuTreeData) {
    session.setItem('menuTreeData', menuTreeData);
}

export function toLogin() {
    return window.location.href = '/login.html';
}

export function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}
