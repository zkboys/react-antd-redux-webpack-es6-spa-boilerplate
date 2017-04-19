import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {message} from 'antd';
import {configureStore, Router, initRouter, initActions, initReducers, initPromiseAjax} from 'zk-react';
import './global.less';
import actions from './actions';
import reducers from './reducers';
import * as Error404 from './pages/error/Error404';
import * as Frame from './Frame';
import Home from './pages/home/Home';

initRouter({
    Error404,
    Frame,
    Home,
    historyListen: (...args) => {
        console.log(args);
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
initPromiseAjax({
    setOptions: (/* instance, isMock */) => {
    },
    onShowErrorTip: (err, errorTip) => {
        if (errorTip !== false) {
            if (err.response) {
                const resData = err.response.data;
                const {status} = err.response;
                if (resData && resData.message) {
                    errorTip = resData.message;
                }
                if (status === 404) {
                    errorTip = '您访问的资源不存在！';
                }
                if (status === 403) {
                    errorTip = '您无权访问此资源！';
                }
                if (resData && resData.message && resData.message.startsWith('timeout of')) {
                    errorTip = '请求超时！';
                }
            }
            message.error(errorTip, 3);
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
