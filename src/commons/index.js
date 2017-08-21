import {message} from 'antd';
import {session} from 'zk-tookit/utils/storage';
import ZkAxios from 'zk-tookit/axios';
import createAjaxHoc from 'zk-tookit/axios/react-hoc';
import mockUrls from '../mock/url-config';
import handleErrorMessage from './handle-error-message';

export const isPro = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isRC = process.env.NODE_ENV === 'rc';


/**
 * 获取ajax请求的baseUrl
 * @returns {*}
 */
export function getAjaxBaseUrl() {
    // 这种写法，webpack打包production模式代码时，会把这个if分支的代码干掉
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080';
        // return 'http://172.16.1.111:8080'; // xxx后端开发人员地址
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

/**
 * 判断请求是否是mock
 * @param url
 * @returns {boolean|*}
 */
export function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}

/**
 * ajax工具
 * @type {ZkAxios}
 */
export const zkAxios = new ZkAxios({
    onShowErrorTip: handleErrorMessage,
    onShowSuccessTip: (response, successTip) => {
        if (successTip !== false) {
            message.success(successTip, 3);
        }
    },
    isMock,
});

// 默认配置
zkAxios.defaults.baseUrl = getAjaxBaseUrl();
zkAxios.defaults.timeout = 1000 * 5;
zkAxios.mockDefaults.baseUrl = '/';

// mockjs使用的axios实例
export const mockInstance = zkAxios.mockInstance;

/**
 * ajax高阶组件
 */
export const ajax = createAjaxHoc(zkAxios);

// 这里由于App.jsx 中要对storage进行初始化，要用到 currentLoginUser.id 作为 keyPrefix
// 所以不能使用 封装的storage相关方法
/**
 * 保存当前登录用户
 * @returns {null}
 */
export function getCurrentLoginUser() {
    const currentLoginUser = window.sessionStorage.getItem('currentLoginUser');
    return currentLoginUser ? JSON.parse(currentLoginUser) : null;
}

/**
 * 获取当前登录用户
 * @param currentLoginUser
 */
export function setCurrentLoginUser(currentLoginUser) {
    window.sessionStorage.setItem('currentLoginUser', JSON.stringify(currentLoginUser));
}

/**
 * 从sessionStorage中获取菜单的树形结构数据
 * @returns {*}
 */
export function getMenuTreeData() {
    return session.getItem('menuTreeData');
}

/**
 * 保存菜单的树形结构到sessionStorage中
 * @param menuTreeData
 */
export function setMenuTreeData(menuTreeData) {
    session.setItem('menuTreeData', menuTreeData);
}

/**
 * 跳转到登录页面
 * @returns {string}
 */
export function toLogin() {
    session.clear();
    window.sessionStorage.clear();
    return window.location.href = '/login.html';
}

/**
 * 判断当前用户是否拥有code对应的权限
 * @param code
 * @returns {boolean}
 */
export function hasPermission(code) {
    const currentLoginUser = getCurrentLoginUser();
    if (currentLoginUser) {
        const {permissions = []} = currentLoginUser;
        return permissions.includes(code);
    }
    return false;
}
