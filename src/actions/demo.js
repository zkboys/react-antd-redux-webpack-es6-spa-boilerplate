import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';

export const demo = createAction(types.DEMO, (/* message */) => {
    return new Promise((resolve, reject) => {
        reject(new Error('测试抛出错误'));
    });
});
