import {handleActions} from 'redux-actions';
import {handleAsyncReducer} from 'zk-react';
import {convertToTree, getNodeByPropertyAndValue, getTopNodeByNode} from 'zk-react/utils/tree-utils';
import {uniqueArray} from 'zk-react/utils';
import {global} from 'zk-react/utils/storage';
import * as types from '../constants/actionTypes';

let initialState = {
    menuTreeData: [],
    sideBarMenuTreeData: [],
    currentTopMenuNode: {},
    currentSideBarMenuNode: {},
    menuOpenKeys: [],
    menuCollapsed: false,
};

export default handleActions({
    [types.GET_SYSTEM_MENUS]: handleAsyncReducer({
        always(state, /* action */) {
            return state;
        },
        pending(state, /* action */) {
            return state;
        },
        resolve(state, action) {
            const {payload} = action;
            let menuTreeData = state.menuTreeData;

            if (payload && payload.length) {
                menuTreeData = convertToTree(payload);
            }
            global.setItem('menuTreeData', menuTreeData);

            return {
                ...state,
                menuTreeData,
            };
        },
        reject(state, /* action */) {
            return state;
        },
        complete(state, /* action */) {
            return state;
        },
    }),
    [types.SET_SYSTEM_MENUS_STATUS_BY_URL](state) {
        const menuTreeData = global.getItem('menuTreeData');
        let {
            currentSideBarMenuNode,
            currentTopMenuNode,
            menuOpenKeys,
        } = state;

        if (menuTreeData) {
            let path = location.pathname;
            if (path.indexOf('/+') > -1) {
                path = path.substring(0, path.indexOf('/+'));
            }
            currentSideBarMenuNode = getNodeByPropertyAndValue(menuTreeData, 'path', path);
            currentTopMenuNode = getTopNodeByNode(menuTreeData, currentSideBarMenuNode);
            if (currentSideBarMenuNode) {
                // 保持其他打开的菜单
                menuOpenKeys = menuOpenKeys.concat(currentSideBarMenuNode.parentKeys);
                menuOpenKeys = uniqueArray(menuOpenKeys);
            }
        }
        return {
            ...state,
            currentTopMenuNode,
            currentSideBarMenuNode,
            menuOpenKeys,
        };
    },
    [types.SET_SYSTEM_MENU_OPEN_KEYS](state, action) {
        const {payload} = action;
        return {
            ...state,
            menuOpenKeys: payload,
        };
    },
    [types.TOGGLE_SIDE_BAR](state) {
        let {menuCollapsed} = state;
        return {
            ...state,
            menuCollapsed: !menuCollapsed,
        };
    },
}, initialState);
