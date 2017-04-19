import axios from 'axios';
import {LoginUsers} from './mockdata/user.js';
import menus from './mockdata/menus';

const normalAxios = axios.create();

export default function (mock) {
    // mock success request
    mock.onGet('/success').reply(200, {
        msg: 'success',
    });

    // mock error request
    mock.onGet('/error').reply(500, {
        msg: 'failure',
    });
    // 登录
    mock.onPost('/adminLogin/login').reply(config => {
        let {
            password, // password
            loginName, // loginName
        } = JSON.parse(config.data);
        return new Promise((resolve, reject) => {
            const user = LoginUsers.filter(u => u.loginname === loginName && u.pass === password);
            if (user && user.length) {
                console.log(user);
                resolve([200,
                    {
                        refer: '/',
                        user: user[0],
                        menus,
                    },
                ]);
            } else {
                reject(new Error('用户名或密码错误'));
            }
        });
    });
    // 获取用户列表（分页）
    mock.onGet('/user/list').reply(config => {
        let {
            pageNum = 1,
            pageSize = 20,
            loginName = '',
            // mobile,
            // name,
        } = JSON.parse(config.data);
        console.log(`/user/list?pageSize=${pageSize}&pageNum=${pageNum}&loginName=${loginName}`);

        return normalAxios.get(`/user/list?pageSize=${pageSize}&pageNum=${pageNum}&loginName=${loginName}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    mock.onGet('/user/del').reply(config => {
        let {
            id,
        } = JSON.parse(config.data);

        return normalAxios.get(`/user/del?id=${id}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    mock.onPost('/user/update').reply(config => {
        let params = JSON.parse(config.data);
        console.log(params);
        return normalAxios.post(config.url, params).then(res => {
            return [200, res];
        }, (err, ...rest) => {
            console.log(123, err, rest);
            return [400, err];
        });
    });
    mock.onPost('/user/add').reply(config => {
        let params = JSON.parse(config.data);
        console.log(params);
        return normalAxios.post(config.url, params).then(res => {
            return [200, res];
        }, (err, ...rest) => {
            console.log(123, err, rest);
            return [400, err];
        });
    });
}
