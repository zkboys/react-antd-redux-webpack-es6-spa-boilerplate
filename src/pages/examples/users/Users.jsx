import React, {Component} from 'react';
import {Operator} from 'zk-react/antd';
import ListPage from './ListPage';

export const PAGE_ROUTE = '/example/users';

export default class extends Component {
    state = {};
    columns = [
        {title: '登陆名称', dataIndex: 'loginName', key: 'loginName', width: '20%'},
        {title: '用户名', dataIndex: 'name', key: 'name'},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const items = [
                    {
                        label: '修改',
                        permission: '',
                        onClick: () => console.log('修改'),
                    },
                    {
                        label: '删除',
                        permission: '',
                        confirm: {
                            title: `您确定要删除“${record.loginName}”？`,
                            onConfirm: () => console.log('删除'),
                        },
                    },
                ];

                return (<Operator items={items} hasPermission={() => true}/>);
            },
        },
    ];

    toolItems = [
        {
            type: 'primary',
            text: '添加',
            icon: 'plus-circle-o',
            onClick: () => {
                this.props.router.push('/example/users/+add');
            },
        },
        {
            type: 'danger',
            text: '删除选中',
            icon: 'minus-circle-o',
            onClick: () => {
                console.log('删除选中');
            },
        },
    ];

    queryItems = [
        [
            {
                type: 'input',
                field: 'loginName',
                placeholder: '请输入登录名',
                label: '登录名',
                decorator: {},
            },
            {
                type: 'input',
                field: 'name',
                placeholder: '请输入用户名',
                label: '用户名',
                decorator: {},
            },
        ],
        [],
        [],
    ];

    render() {
        return (
            <ListPage
                url="/mock/users"
                queryItems={this.queryItems}
                columns={this.columns}
                toolItems={this.toolItems}
            />
        );
    }
}
