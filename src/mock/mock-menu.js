import menus from './mockdata/menus';

export default function (mock) {
    mock.onGet('/home/menus').reply(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, menus]);
            }, 1000);
        });
    });
}
