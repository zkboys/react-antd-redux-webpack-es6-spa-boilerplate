import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {message} from 'antd';
import {
    isDev,
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
import actions from './redux/actions';
import reducers from './redux/reducers';
import * as Error404 from './pages/error/Error404';
import * as Frame from './frame/Frame';
import * as Home from './pages/home/Home';
import {getCurrentLoginUser} from './commons';

if (isDev) {
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
    onLeave: (/* prevState */) => {
    },
    onEnter: (nextState, replace, callback) => {
        const ignorePath = [
            '/login',
            '/error/401',
            '/error/403',
            '/error/404',
        ];
        const {location} = nextState;
        const currentLoginUser = getCurrentLoginUser();
        if (!currentLoginUser) {
            if (ignorePath.indexOf(location.pathname) < 0) {
                replace('/error/401');
            }
        } else {
            callback();
        }
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
