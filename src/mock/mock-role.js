import roles from './mockdata/roles';

export default function (mock) {
    mock.onGet('/organization/roles').reply(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, {
                    results: roles,
                    totalCount: roles.length,
                }]);
            }, 1000);
        });
    });
}
