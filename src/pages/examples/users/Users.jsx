import React, {Component} from 'react';
import {Link} from 'react-router';
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
        date1: null,
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
            type: 'date',
            field: 'data1',
            label: '日期1',
            labelSpaceCount: 3,
            width: 200,
            decorator: {
                onChange: (value) => {
                    this.setState({date1: value});
                    console.log(value);
                },
            },
            elementProps: {},
        },
        {
            type: 'date',
            field: 'data2',
            label: '日期2',
            labelSpaceCount: 3,
            width: 200,
            elementProps: {
                disabledDate: (current) => {
                    const {date1} = this.state;
                    console.log(date1);
                    if (!date1 || !current) return false;
                    const date1Year = date1.format('YYYY');
                    const currentYear = current.format('YYYY');
                    console.log(currentYear, date1Year);
                    if (currentYear === date1Year) return current.valueOf() < date1.valueOf();
                    return currentYear !== date1Year;
                },
            },
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
            visible: hasPermission('SYSTEM_ADD_USER'),
            onClick: () => {
                this.props.router.push('/example/users/+add/:userId?tabName=添加用户');
            },
        },
        {
            visible: hasPermission('SYSTEM_ADD_USER'),
            component: <a href="https://www.baidu.com">baidu</a>,
        },
        {
            visible: hasPermission('SYSTEM_ADD_USER'),
            getComponent: () => {
                const {params = {}} = this.state;
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
            title: '状态',
            dataIndex: 'isEnable',
            key: 'isEnable',
            className: 'icon-status-table-col',
            render: (text, record) => {
                const {id, name} = record;
                const isEnable = text !== '1';
                const tip = isEnable ? '禁用' : '启用';
                const items = [
                    {
                        visible: true,
                        disabled: false,
                        statusSwitch: {
                            status: isEnable,
                            title: `您确定要${tip}“${name}”？`,
                            onConfirm: () => {
                                // TODO 修改这个请求
                                this.props.$ajax.del(
                                    `/v1/roomType/${id}`,
                                    null,
                                    {successTip: `${tip}“${name}”成功！`}
                                ).then(() => {
                                    this.handleSearch();
                                });
                            },
                        },
                    },
                ];

                return (<Operator items={items}/>);
            },
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const {id} = record;
                const {promptVisible = {}} = this.state;
                const items = [
                    {
                        label: <Link to={`/users/detail/${id}`}>详情</Link>,
                        // isMore: true,
                    },
                    {
                        label: '修改',
                        disabled: true,
                        visible: hasPermission('CODE-MODIFY'),
                        onClick: () => this.props.router.push(`/example/users/+add/${record.id}?tabName=修改用户`),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        // isMore: true,
                        disabled: true,
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
                        prompt: { // 这个加入更多，弹出之后，输入，输入框会出现无法定位bug，prompt尽量不要加入更多，或者改为弹框等其他形式。
                            title: '驳回原因',
                            okText: '确定',
                            cancelText: '取消',
                            onCancel: () => console.log('cancel'),
                            onConfirm: value => console.log(value),
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
                        label: '驳回2',
                        loading: false,
                        color: 'green',
                        prompt: { // 这个加入更多，弹出之后，输入，输入框会出现无法定位bug，prompt尽量不要加入更多，或者改为弹框等其他形式。
                            visible: promptVisible[id],
                            title: '驳回原因',
                            okText: '确定',
                            cancelText: '取消',
                            onClickLabel: () => {
                                Object.keys(promptVisible).forEach(item => promptVisible[item] = false);
                                promptVisible[id] = true;
                                this.setState({promptVisible});
                            },
                            onCancel: () => {
                                promptVisible[id] = false;
                                this.setState({promptVisible});
                            },
                            onConfirm: values => {
                                console.log(values);
                                promptVisible[id] = false;
                                this.setState({promptVisible});
                            },
                            items: [
                                {
                                    type: 'data',
                                    field: 'comeDate',
                                    label: '入住日期',
                                    labelSpaceCount: 4,
                                    decorator: {
                                        rules: [
                                            {required: true, message: '请输入入住日期'},
                                        ],
                                    },
                                },
                                {
                                    type: 'data',
                                    field: 'leaveDate',
                                    label: '离店日期',
                                    labelSpaceCount: 4,
                                    decorator: {
                                        rules: [
                                            {required: true, message: '请输入离店日期'},
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        label: <a href="https://www.baidu.com">百度</a>,
                        // isMore: true,
                    },
                ];

                return (<Operator items={items}/>);
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
        const aa = 'data:image/jpeg;base64,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';
        console.log(aa.length);
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
