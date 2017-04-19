import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    message: 'demo init menssage',
};

export default handleActions({
    [types.DEMO](state, action) {
        const {payload} = action;
        return {
            ...state,
            message: payload,
        };
    },
}, initialState);
