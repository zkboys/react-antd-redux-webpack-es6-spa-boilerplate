import React, {Component} from 'react';
import {Operator} from 'zk-react/antd';
import {ajax} from 'zk-react';
import ListPage from './ListPage';

export const PAGE_ROUTE = '/example/users';

@ajax()
export default class extends Component {
    state = {
        total: 0,
        dataSource: [],
    };

    queryItems = [
        [
            {
                type: 'input',
                field: 'loginName',
                label: '登录名',
                labelSpaceCount: 3,
                width: 200,
                placeholder: '请输入登录名',
                decorator: {
                    rules: [
                        {required: false, message: '请输入用户名'},
                    ],
                },
            },
            {
                type: 'input',
                field: 'name',
                label: '用户名',
                labelSpaceCount: 3,
                width: 200,
                placeholder: '请输入用户名',
                decorator: {},
            },
            {
                type: 'input',
                field: 'name1',
                label: '用户名1',
                labelSpaceCount: 3,
                width: 200,
                placeholder: '请输入用户名',
                decorator: {},
            },
            {
                type: 'input',
                field: 'name3',
                label: '用户名3',
                labelSpaceCount: 3,
                width: 200,
                placeholder: '请输入用户名',
                decorator: {},
            },
        ],
        {
            type: 'input',
            field: 'name2',
            label: '用户名2',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '请输入用户名',
            decorator: {},
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
                            onConfirm: () => {
                                console.log('删除', record);
                                const dataSource = this.state.dataSource.filter(item => item.id !== record.id);
                                this.setState({
                                    dataSource,
                                });
                            },
                        },
                    },
                ];

                return (<Operator items={items} hasPermission={() => true}/>);
            },
        },
    ];

    handleSearch = (params) => {
        return this.props.$ajax.get('/mock/users', params)
            .then(data => {
                this.setState({
                    total: data.total,
                    dataSource: data.list,
                });
            });
    }

    render() {
        const {total, dataSource} = this.state;
        return (
            <ListPage
                dataFilter={data => data}
                queryItems={this.queryItems}
                showSearchButton
                showResetButton={false}
                toolItems={this.toolItems}
                columns={this.columns}
                onSearch={this.handleSearch}
                total={total}
                dataSource={dataSource}
                showPagination
            />
        );
    }
}
