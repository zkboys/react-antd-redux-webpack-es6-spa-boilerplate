import {getUsersByPageSize} from './mockdata/user';

export default function (mock) {
    mock.onGet('/mock/users').reply((config) => {
        const {
            pageSize,
            pageNum,
        } = JSON.parse(config.data);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, {
                    pageNum,
                    pageSize,
                    total: 888,
                    list: getUsersByPageSize(pageSize),
                }]);
            }, 1000);
        });
    });
}
