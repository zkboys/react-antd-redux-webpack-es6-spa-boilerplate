import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {message, Spin} from 'antd';
import moment from 'moment';
import * as promiseAjax from 'zk-tookit/utils/promise-ajax';
import {init as initStorage} from 'zk-tookit/utils/storage';
import {convertToTree} from 'zk-tookit/utils/tree-utils';
import './global.less';
import configureStore from './redux/store/configure-store';
import Router from './route/Router';
import handleErrorMessage from './commons/handle-error-message';
import {getCurrentLoginUser, toLogin, setCurrentLoginUser, setMenuTreeData, getAjaxBaseUrl, isMock} from './commons';

moment.locale('zh-cn'); // moment国际化为中国

if (process.env.NODE_ENV === 'development') {
    require('./mock/index');

    console.log('current mode is debug, mock is started');
}
const currentLoginUser = getCurrentLoginUser();

initStorage({ // 设置存储前缀，用于区分不同用户的数据
    keyPrefix: currentLoginUser && currentLoginUser.id,
});

promiseAjax.init({
    setOptions: (instance) => {
        instance.defaults.baseURL = getAjaxBaseUrl();
    },
    onShowErrorTip: (err, errorTip) => {
        handleErrorMessage(err, errorTip);
    },
    onShowSuccessTip: (response, successTip) => {
        if (successTip !== false) {
            message.success(successTip, 3);
        }
    },
    isMock,
});

const store = configureStore();

class App extends React.Component {
    state = {
        loading: true,
    };

    componentWillMount() {
        // 渲染页面开始之前的一些准备工作
        const userId = currentLoginUser && currentLoginUser.id;
        if (!userId) return toLogin();
        // 根据用户id查询用户菜单权限
        promiseAjax.get('/mock/system/menus', {userId}).then(res => {
            console.log(res);
            let menus = res;
            if (process.env.NODE_ENV === 'development') {
                // 这里做个备份，防止数据丢失之后，方便恢复菜单数据。
                menus && menus.length && window.localStorage.setItem(`${currentLoginUser.name}-menus.bak`, JSON.stringify(menus));
            }

            const permissions = menus.map(item => {
                if (item.type === '0') return item.key;
                if (item.type === '1') return item.code;
                return null;
            });

            // 根据order 排序
            const orderedData = [...menus].sort((a, b) => {
                const aOrder = a.order || 0;
                const bOrder = b.order || 0;

                // 如果order都不存在，根据 text 排序
                if (!aOrder && !bOrder) {
                    return a.text > b.text ? 1 : -1;
                }

                return bOrder - aOrder;
            });

            const menuTreeData = convertToTree(orderedData);
            setMenuTreeData(menuTreeData);

            currentLoginUser.permissions = permissions;
            setCurrentLoginUser(currentLoginUser);
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    render() {
        const {loading} = this.state;
        return loading ?
            (
                <Spin tip="Loading...">
                    <div style={{height: document.body.clientHeight}}/>
                </Spin>
            )
            :
            (
                <Provider store={store}>
                    <Router />
                </Provider>
            );
    }
}

ReactDOM.render(<App />, document.getElementById('main'));
