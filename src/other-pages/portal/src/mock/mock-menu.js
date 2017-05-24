import menus from './mockdata/menus';

export default function (mock) {
    mock.onGet('/mock/system/menus').reply(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, menus]);
            }, 1000);
        });
    });
}
