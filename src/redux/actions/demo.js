import {createAction} from 'redux-actions';
import * as types from '../action-types';

export const demo = createAction(types.DEMO, (/* message */) => {
    return new Promise((resolve) => {
        resolve('resolve message');
    });
});
