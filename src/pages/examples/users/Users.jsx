import React, {Component} from 'react';
import {Operator, ListPage} from 'zk-tookit/antd';
import {ajax} from 'zk-tookit/react';
import {hasPermission} from '../../../commons';

export const PAGE_ROUTE = '/example/users';

@ajax()
export default class extends Component {
    state = {
        total: 0,
        dataSource: [],
        selectedRowKeys: [],
    };

    queryItems = [
        [
            {
                type: 'input',
                field: 'loginName',
                label: '登录名',
                labelSpaceCount: 3,
                width: '25%',
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
                label: '可以为空',
                labelSpaceCount: 4,
                // label: '',
                // labelWidth: 0,
                // colon: false,
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
        {
            type: 'number',
            field: 'number',
            label: 'number',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '请输入数字',
            decorator: {},
            elementProps: {
                min: 0,
                max: 100,
                step: 10,
                precision: 2, // 精度
                disabled: false,
                size: 'large',
                formatter: value => value,
                parser: value => value,
            },
        },
        {
            type: 'textarea',
            field: 'textarea',
            label: 'textarea',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '一个文本框',
            decorator: {},
        },
        {
            type: 'password',
            field: 'password',
            label: 'password',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '一个密码框',
            decorator: {},
        },
        {
            type: 'mobile',
            field: 'mobile',
            label: 'mobile',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '一个电话',
            decorator: {},
        },
        {
            type: 'email',
            field: 'email',
            label: 'email',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '一个邮件',
            decorator: {},
        },
        {
            type: 'select',
            field: 'select',
            label: 'select',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '一个select',
            decorator: {},
            elementProps: {
                options: [
                    {value: '0', label: '测试1'},
                    {value: '1', label: '测试2'},
                ],
            },
        },
        {
            type: 'checkbox',
            field: 'checkbox',
            // label: '复选',
            labelSpaceCount: 3,
            width: 200,
            placeholder: '复选框',
            decorator: {},
            elementProps: {
                label: '复选啊',
            },
        },
        {
            type: 'checkbox-group',
            field: 'checkboxGroup',
            label: '复选组',
            labelSpaceCount: 3,
            width: 400,
            elementProps: {
                options: [
                    {label: '苹果', value: 'Apple'},
                    {label: '梨', value: 'Pear'},
                    {label: '橘子', value: 'Orange'},
                ],
            },
        },
        {
            type: 'switch',
            field: 'switch',
            label: '开关',
            labelSpaceCount: 3,
            width: 200,
            decorator: {},
        },
        {
            type: 'data',
            field: 'data',
            label: '日期',
            labelSpaceCount: 3,
            width: 200,
            decorator: {},
        },
        {
            type: 'data',
            field: 'dataTime',
            label: '日期&时间',
            labelSpaceCount: 5,
            width: 300,
            decorator: {},
            elementProps: {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm:ss',
            },
        },
        {
            type: 'month',
            field: 'month',
            label: '月份',
            labelSpaceCount: 3,
            width: 200,
            decorator: {},
        },
        {
            type: 'data-range',
            field: 'data-range',
            label: '日期区间',
            labelSpaceCount: 5,
            width: 400,
            placeholder: ['开始时间', '结束时间'],
            decorator: {
                getValueFromEvent(momentArray, stringArray) {
                    console.log(stringArray);
                    return momentArray;
                },
            },
        },
        {
            type: 'time',
            field: 'time',
            label: '时间',
            labelSpaceCount: 5,
            width: 400,
            // placeholder: ['开始时间', '结束时间'],
            decorator: {},
        },
    ];

    toolItems = [
        {
            type: 'primary',
            text: '添加',
            icon: 'plus-circle-o',
            permission: 'SYSTEM_ADD_USER',
            onClick: () => {
                this.props.router.push('/example/users/+add/:userId?tabName=添加用户');
            },
        },
        {
            permission: 'SYSTEM_ADD_USER',
            component: <a href="https://www.baidu.com">baidu</a>,
        },
        {
            permission: 'SYSTEM_ADD_USER',
            getComponent: () => {
                const {params = {}} = this.state;
                console.log(params.time);
                return <a href="https://www.baidu.com">{String(params.time)}</a>;
            },
        },
        // {
        //     type: 'danger',
        //     text: '删除选中',
        //     icon: 'minus-circle-o',
        //     onClick: () => {
        //         console.log('删除选中');
        //     },
        // },
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
                        permission: 'CODE-MODIFY',
                        onClick: () => this.props.router.push(`/example/users/+add/${record.id}?tabName=修改用户`),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        isMore: true,
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
                    {
                        label: '驳回',
                        loading: false,
                        color: 'green',
                        permission: '',
                        prompt: { // 这个加入更多，弹出之后，输入，输入框会出现无法定位bug，prompt尽量不要加入更多，或者改为弹框等其他形式。
                            title: '驳回原因',
                            okText: 'OK',
                            cancelText: 'CANCEL',
                            onCancel: () => alert('cancel'),
                            onConfirm: value => alert(value),
                            inputProps: {
                                style: {width: 200},
                                placeholder: '请输入驳回原因',
                            },
                            decorator: {
                                rules: [
                                    {required: true, message: '请输入驳回原因'},
                                ],
                            },
                        },
                    },
                    {
                        label: <a href="https://www.baidu.com">百度</a>,
                        isMore: true,
                    },
                ];

                return (<Operator items={items} hasPermission={hasPermission}/>);
            },
        },
    ];

    handleSearch = (params) => {
        console.log(params);
        this.setState({params});
        return this.props.$ajax.get('/mock/users', params, {permission: 'USER_SEARCH'})
            .then(data => {
                this.setState({
                    total: data.total,
                    dataSource: data.list,
                });
            }); // 这个可以隐藏控制台的error输出：.catch(() => false);
    };

    render() {
        const {total, dataSource} = this.state;
        return (
            <ListPage
                queryItems={this.queryItems}
                showSearchButton
                showResetButton={false}
                toolItems={this.toolItems}
                columns={this.columns}
                onSearch={this.handleSearch}
                total={total}
                dataSource={dataSource}
                rowKey={(record) => record.id}
                showPagination
                hasPermission={hasPermission}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: this.state.selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    },
                }}
            />
        );
    }
}
