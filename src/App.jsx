import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Spin} from 'antd';
import moment from 'moment';
import {init as initStorage} from 'zk-tookit/utils/storage';
import {convertToTree} from 'zk-tookit/utils/tree-utils';
import './global.less';
import configureStore from './redux/store/configure-store';
import Router from './route/Router';
import service from './services/service-hoc';
import {
    setCurrentLoginUser,
    getCurrentLoginUser,
    toLogin,
    setMenuTreeData,
} from './commons';

if (process.env.NODE_ENV === 'development') {
    // dev 模式开启mock
    require('./mock/index');

    console.log('current mode is debug, mock is enabled');
}

// moment国际化为中国
moment.locale('zh-cn');

const currentLoginUser = getCurrentLoginUser();

// 设置存储前缀，用于区分不同用户的数据
initStorage({
    keyPrefix: currentLoginUser && currentLoginUser.id,
});

// redux store
const store = configureStore();

@service()
class App extends React.Component {
    state = {
        loading: true,
    };

    componentWillMount() {
        // 渲染页面开始之前的一些准备工作
        const userId = currentLoginUser && currentLoginUser.id;
        if (!userId) return toLogin();

        // 根据用户id查询用户菜单权限

        this.props.$service.systemService
            .getMenus({userId})
            .then(res => {
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
            })
            .finally(() => {
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
