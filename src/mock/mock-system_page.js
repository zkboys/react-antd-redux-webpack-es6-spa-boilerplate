import axios from 'axios';

const normalAxios = axios.create();

export default function (mock) {
    // 获取系统列表（分页）
    mock.onGet('/systems').reply(config => {
        let {
            pageNum = 1,
            pageSize = 20,
        } = JSON.parse(config.data);

        return normalAxios.get(`/systems?pageSize=${pageSize}&pageNum=${pageNum}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    mock.onGet('/role').reply(config => {
        let {
            pageNum = 1,
            pageSize = 20,
        } = JSON.parse(config.data);

        return normalAxios.get(`/role?pageSize=${pageSize}&pageNum=${pageNum}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });


    // 根据userId获取系统
    mock.onGet('/systems/36486727157682176').reply(() => {
        return normalAxios.get('/systems/36486727157682176').then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    // 切换是否可用
    mock.onPatch('/systems/36486727157682176').reply(config => {
        let params = JSON.parse(config.data);
        return normalAxios.patch('/systems/36486727157682176', params).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    mock.onGet('/systems/checkCode').reply(config => {
        let {
            code,
        } = JSON.parse(config.data);
        return normalAxios.get(`/systems/checkCode?code=${code}`).then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });

    mock.onDelete('/systems/36486727157682176').reply(() => {
        return normalAxios.delete('/systems/36486727157682176').then(res => {
            return [200, res];
        }, err => {
            return [400, err];
        });
    });


    // 新增
    mock.onPost('/systems').reply(config => {
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
    mock.onPut('/systems/36486727157682176').reply(config => {
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
