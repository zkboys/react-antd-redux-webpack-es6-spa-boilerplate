import {createAction} from 'redux-actions';
import {promiseAjax} from 'zk-react';
import * as types from '../actionTypes';

export const getSystemMenus = createAction(types.GET_SYSTEM_MENUS,
    () => promiseAjax.get('/mock/system/menus', null, {errorTip: false}), // TODO 修改这个链接
    (resolved, rejected) => ({resolved, rejected})
);

export const setSystemMenusStatusByUrl = createAction(types.SET_SYSTEM_MENUS_STATUS_BY_URL);

export const setSystemMenuOpenKeys = createAction(types.SET_SYSTEM_MENU_OPEN_KEYS);
export const toggleSideBar = createAction(types.TOGGLE_SIDE_BAR);
export const setPageTitle = createAction(types.SET_PAGE_TITLE);
export const setPageBreadcrumbs = createAction(types.SET_PAGE_BREADCRUMBS);
export const hidePageHeader = createAction(types.HIDE_PAGE_HEADER);
export const showPageHeader = createAction(types.SHOW_PAGE_HEADER);
export const hideSideBar = createAction(types.HIDE_SIDE_BAR);
export const showSideBar = createAction(types.SHOW_SIDE_BAR);
