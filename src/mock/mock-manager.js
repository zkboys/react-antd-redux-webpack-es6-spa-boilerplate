import axios from 'axios';

const normalAxios = axios.create();

export default function (mock) {
    // 获取用户列表（分页）
    mock.onGet('/admins').reply(config => {
        let {
            pageNum = 1,
            pageSize = 20,
            loginName = '',
            // mobile,
            // name,
        } = JSON.parse(config.data);

        return normalAxios.get(`/admins?pageSize=${pageSize}&pageNum=${pageNum}&loginName=${loginName}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    // 根据userId获取用户
    mock.onGet('/admins/35857320541949952').reply(() => {
        return normalAxios.get('/admins/35857320541949952').then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    // 切换是否可用
    mock.onPatch('/admins/35857320541949952').reply(config => {
        let params = JSON.parse(config.data);
        return normalAxios.patch('/admins/35857320541949952', params).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    // 检测用户名是否存在
    mock.onGet('/admins/checkLoginName').reply(config => {
        let {
            loginName,
        } = JSON.parse(config.data);
        return normalAxios.get(`/admins/checkLoginName?loginName=${loginName}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    // 根据userId删除
    mock.onDelete('/admins/35857320541949952').reply(() => {
        return normalAxios.delete('/admins/35857320541949952').then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });


    // 新增
    mock.onPost('/admins').reply(config => {
        let params = JSON.parse(config.data);
        console.log(params);
        return normalAxios.post(config.url, params).then(res => {
            return [200, res];
        }, (err, ...rest) => {
            console.log(123, err, rest);
            return [400, err];
        });
    });

    // 修改
    mock.onPut('/admins/35857320541949952').reply(config => {
        let params = JSON.parse(config.data);
        console.log(params);
        return normalAxios.put(config.url, params).then(res => {
            return [200, res];
        }, (err, ...rest) => {
            console.log(123, err, rest);
            return [400, err];
        });
    });
}
