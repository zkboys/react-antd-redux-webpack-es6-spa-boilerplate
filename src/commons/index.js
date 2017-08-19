import {session} from 'zk-tookit/utils/storage';
import mockUrls from '../mock/url-config';

export const isPro = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isRC = process.env.NODE_ENV === 'rc';

export function getAjaxBaseUrl() {
    if (process.env.NODE_ENV === 'development') { // 这种写法，webpack打包production模式代码时，会把这个if分支的代码干掉
        return 'http://lb-haproxy.dev.default.ffpms.:10001';
        // return 'http://172.16.1.111:8080'; // 刘金龙
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

// 这里由于App.jsx 中要对storage进行初始化，要用到 currentLoginUser.id 作为 keyPrefix
// 所以不能使用 封装的storage相关方法
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
    session.clear();
    window.sessionStorage.clear();
    return window.location.href = '/login.html';
}

export function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}

export function hasPermission(code) {
    const currentLoginUser = getCurrentLoginUser();
    if (currentLoginUser) {
        const {permissions = []} = currentLoginUser;
        return permissions.includes(code);
    }
    return false;
}

export function getDefaultPass() {
    return '123456';
}
