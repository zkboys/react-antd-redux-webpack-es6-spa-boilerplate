export default [
    {
        path: '/base-information/system_page',
        asyncComponent: './system-page/Index.jsx',
    },
    {
        path: '/base-information/roles',
        asyncComponent: './role/Index.jsx',
    },
    {
        path: '/base-information/roles/+manage/:type/:id',
        asyncComponent: './role/Manage.jsx',
    },
];
