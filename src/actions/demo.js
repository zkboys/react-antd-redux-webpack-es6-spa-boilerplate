import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';

export const demo = createAction(types.DEMO, (/* message */) => {
    return new Promise((resolve) => {
        resolve('resolve message');
    });
});
