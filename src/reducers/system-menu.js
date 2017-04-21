import {handleActions} from 'redux-actions';
import {handleAsyncReducer} from 'zk-react';
import * as types from '../constants/actionTypes';

let initialState = {
    topMenuTreeData: [],
    sideBarMenuTreeData: [],
    currentTopMenuNode: null,
    currentSideBarMenuNode: null,
};


export default handleActions({
    [types.GET_SYSTEM_MENUS]: handleAsyncReducer({
        always(state, action) {
            console.log('always', state, action);
            return state;
        },
        pending(state, action) {
            console.log('pending', state, action);
            return state;
        },
        resolve(state, action) {
            console.log('resolve', state, action);
            return state;
        },
        reject(state, action) {
            console.log('reject', state, action);
            return state;
        },
        complete(state, action) {
            console.log('complete', state, action);
            return state;
        },
    }),
    [types.GET_SYSTEM_MENUS](state, action) {
        const {payload} = action;
        return {
            ...state,
            message: payload,
        };
    },
}, initialState);
