import orgs from './mockdata/organizations';

export default function (mock) {
    mock.onGet('/mock/ajax/get').reply(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, orgs]);
            }, 2000);
        });
    });
    mock.onGet('/mock/ajax/single/get').reply(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, orgs]);
            }, 2000);
        });
    });
    mock.onGet('/mock/ajax/single/get2').reply(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, orgs]);
            }, 2000);
        });
    });
    mock.onPost('/mock/ajax/post').reply(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, orgs]);
            }, 2000);
        });
    });
}
