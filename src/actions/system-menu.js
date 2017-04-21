import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';

export const getSystemMenus = createAction(types.GET_SYSTEM_MENUS, () => {
    // TODO 发送请求，获取菜单数据
    return new Promise((resolve, reject) => {
        reject(new Error('测试抛出错误'));
    });
});
