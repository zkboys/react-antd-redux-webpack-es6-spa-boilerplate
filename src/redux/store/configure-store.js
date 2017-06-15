import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'zk-react/redux/promise-middleware';
import asyncActionCallbackMiddleware from 'zk-react/redux/async-action-callback-middleware';
import utilsMiddleware from 'zk-react/redux/utils-middleware';
import syncReducerToAsyncStorage from 'zk-react/redux/sync-reducer-to-local-storage-middleware';
import reducers from '../reducers';


let middlewares = [
    thunkMiddleware,
    promiseMiddleware,
    asyncActionCallbackMiddleware,
    utilsMiddleware,
    syncReducerToAsyncStorage,
];

export default function configureStore(initialState) {
    return applyMiddleware(
        ...middlewares
    )(createStore)(combineReducers(reducers), initialState);
}
