import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';

export const demo = createAction(types.DEMO, (message) => {
    return message;
});
