import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
    middlewareAsyncActionCallback,
    middlewarePromise,
    middlewareSyncReducerToLocalStorage,
    middlewareUtils,
} from 'zk-react/redux';
import reducers from '../reducers';


let middlewares = [
    thunkMiddleware,
    middlewarePromise,
    middlewareAsyncActionCallback,
    middlewareUtils,
    middlewareSyncReducerToLocalStorage,
];

export default function configureStore(initialState) {
    return applyMiddleware(
        ...middlewares
    )(createStore)(combineReducers(reducers), initialState);
}
