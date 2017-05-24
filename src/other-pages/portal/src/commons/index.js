import {promiseAjax, isDev, isPro, isTest, isRC} from 'zk-react';
import {session, setItem, getItem} from 'zk-react/utils/storage';

export function isInternalSystem() {
    const runEnv = process.run_env.RUN_ENV;
    return runEnv === 'internalSystem' || runEnv === 'undefined' || runEnv === undefined;
}

export function isExternalSystem() {
    return process.run_env.RUN_ENV === 'externalSystem';
}

export function getAjaxBaseUrl() {
    if (isDev) {
        return 'http://172.16.135.168:8080/';
        // return 'http://172.16.41.157:8080/';
        // return 'http://172.16.40.50:8081/';
        // return 'http://172.16.20.57:8081';
        // return 'http://172.16.40.53:8090/';
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


export function setCurrentLoginUser(user) {
    window.sessionStorage.setItem('currentLoginUser', JSON.stringify(user));
}

export function setUserType(userType) {
    setItem('user-type', userType);
}

export function getUserType() {
    return getItem('user-type');
}

export function toLogin() {
    const userType = getUserType();

    let loginPath = '/signin.html';
    if (userType === 1) { // 管理员
        loginPath = '/signin.html';
    }
    if (userType === 2) { // 业务员
        loginPath = '/business-signin.html';
    }
    location.href = loginPath;
    return false;
}

export function logout() {
    const currentLoginUser = getCurrentLoginUser();
    let logoutUrl = '/adminLogin/loginOut';
    if (currentLoginUser.userType === 1) { // 管理员
        logoutUrl = '/adminLogin/loginOut';
    }
    if (currentLoginUser.userType === 2) { // 业务员
        logoutUrl = '/login/loginOut';
    }
    promiseAjax.post(logoutUrl, {}, {errorTip: false}).then(() => {
        session.clear();
        toLogin();
    });
}

export function getMenuData() {
    return session.getItem('menuData');
}

export function setMenuData(menuTreeData) {
    session.setItem('menuData', menuTreeData);
}

export function getMenuTreeData() {
    return session.getItem('menuTreeData');
}

export function setMenuTreeData(menuTreeData) {
    session.setItem('menuTreeData', menuTreeData);
}

/**
 * 当前登录用户是否有某个权限
 * @param permission
 */
export function hasPermission(permission) {
    const sessionMenu = getMenuData() || [];
    const allPermissions = sessionMenu.map(m => m.code);
    return allPermissions.indexOf(permission) > -1;
}
