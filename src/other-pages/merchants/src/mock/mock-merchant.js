import {getMerchantsByPageSize} from './mockdata/merchants';

export default function (mock) {
    mock.onGet('/mock/merchants').reply((config) => {
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
                    list: getMerchantsByPageSize(20),
                }]);
            }, 1000);
        });
    });
}
