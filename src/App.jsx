import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {message} from 'antd';
import {
    debug,
    configureStore,
    Router,
    initRouter,
    initActions,
    initReducers,
    promiseAjax,
    PubSubMsg,
} from 'zk-react';
import './global.less';
import handleErrorMessage from './commons/handle-error-message';
import actions from './actions';
import reducers from './reducers';
import * as Error404 from './pages/error/Error404';
import * as Frame from './frame/Frame';
import Home from './pages/home/Home';

if (debug) {
    require('./mock/index');

    console.log('current mode is debug, mock is started');
}

initRouter({
    Error404,
    Frame,
    Home,
    historyListen: (history) => {
        PubSubMsg.publish('history-change', history);
    },
    onLeave: () => {
    },
    onEnter: () => {
    },
    onRouterDidMount: () => {
    },
});

initActions(actions);
initReducers(reducers);
promiseAjax.init({
    setOptions: (/* instance, isMock */) => {
    },
    onShowErrorTip: (err, errorTip) => {
        if (errorTip !== false) {
            handleErrorMessage(err);
        }
    },
    onShowSuccessTip: (response, successTip) => {
        if (successTip !== false) {
            message.success(successTip, 3);
        }
    },
    isMock: (url /* url, data, method, options */) => {
        return url.startsWith('/mock');
    },
});


const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('main'));
