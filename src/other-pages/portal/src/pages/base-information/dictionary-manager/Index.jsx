import React, {Component} from 'react';
import {Form, Input, Button, Table} from 'antd';
import {Link} from 'react-router';
import {promiseAjax} from 'zk-react';
import {
    Operator,
    PageContent,
    QueryResult,
    QueryBar,
    ToolBar,
    PaginationComponent,
    Permission,
    EditableCell,
    InputCloseSuffix,
} from 'zk-react/antd';
import './style.less';
import {hasPermission} from '../../../commons';
import {PAGE_ROUTE as ADD_PAGE_ROUTE} from './AddEdit';

const PERMISSION_CODE_DELETE = 'VIRTUAL_PORTAL_ADMINS_UPDATE';
const PERMISSION_CODE_UPDATE = 'VIRTUAL_PORTAL_ADMINS_UPDATE';
const PERMISSION_CODE_ADD = 'VIRTUAL_PORTAL_ADMINS_SAVE';
// const PERMISSION_CODE_DIVIDE = 'VIRTUAL_PORTAL_UPDATE';

export const PAGE_ROUTE = '/base-information/dictionary-manager';

const FormItem = Form.Item;

class DictionaryList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingaccess: false,
        access: [],
        total: 0,
        statusLoading: {},
    };
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '权限组编码', dataIndex: 'virtualCode', key: 'virtualCode', width: '30%'},
        {title: '权限组描述', dataIndex: 'description', key: 'description', width: '20%'},
        {title: '系统', dataIndex: 'system', key: 'system', render: (...args) => this.renderSystemColumn(...args)},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {title: '操作', key: 'operator', render: (...args) => this.renderOperatorColumn(...args)},
    ];

    renderLoginNameColumn = (text) => {
        return (
            <EditableCell
                rules={[{required: true, message: '登录名不能为空！'}]} field="loginName" value={text}
                onChange={value => console.log(value)}/>
        );
    };
    renderSystemColumn = (text) => {
        return text.name;
    };
    renderOperatorColumn = (text, record) => {
        const items = [
            {
                label: '修改',
                permission: PERMISSION_CODE_UPDATE,
                onClick: () => this.handleEdit(record),
            },
            {
                label: '删除',
                permission: PERMISSION_CODE_DELETE,
                confirm: {
                    title: '该操作将会删除权限组下所有权限关系，是否继续？',
                    onConfirm: () => this.handleDelete(record),
                },
            },
            {
                label: '分配',
                permission: PERMISSION_CODE_UPDATE,
                onClick: () => this.handleDistribution(record),
            },
            {
                label: '刷新',
                permission: PERMISSION_CODE_DELETE,
                confirm: {
                    title: `您确定要刷新“${record.virtualCode}”？`,
                    onConfirm: () => this.handleRefresh(record.virtualCode),
                },
            },
        ];

        return (<Operator items={items} hasPermission={hasPermission}/>);
    };
    handleRefresh = (virtualCode) => {
        promiseAjax.get('/authorityVirtual/refresh', virtualCode).then(data => {
            this.setState({
                data: data.list,
            });
        });
    };
    search = (args) => {
        const {form: {getFieldsValue}} = this.props;
        const {pageNum, pageSize} = this.state;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({
            gettingaccess: true,
        });
        promiseAjax.get('/authorityVirtual/list', params).then(data => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                access: data.list,
            });
        }).finally(() => {
            this.setState({
                gettingaccess: false,
            });
        });
    }
    handleEdit = (record) => {
        const {router} = this.props;
        router.push(ADD_PAGE_ROUTE.replace(':vCode', record.virtualCode));
    };
    handleDistribution = (record) => {
        const {router} = this.props;
        router.push(`/base-information/dictionary-manager/+distribution/${record.id}/${record.virtualCode}/${record.systemId}`);
    }
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.virtualCode}"成功`,
            errorTip: `删除"${record.virtualCode}"失败`,
        };
        let idDel = {
            id: record.id,
        };
        promiseAjax.get('/authorityVirtual/del', idDel, options).then(() => {
            const access = this.state.access.filter(adm => adm.id !== record.id);
            this.setState({access});
        });
    }
    handleQuery = (e) => {
        e.preventDefault();
        this.search({pageNum: 1});
    };
    handlePageNumChange = (pageNum) => {
        this.setState({pageNum});
        this.search({pageNum});
    };
    handlePageSizeChange = pageSize => {
        this.setState({
            pageNum: 1,
            pageSize,
        });
        this.search({
            pageNum: 1,
            pageSize,
        });
    };

    componentWillMount() {
        this.search();
    }

    render() {
        const {
            form,
            form: {getFieldDecorator},
        } = this.props;

        const {
            gettingaccess,
            access,
            total,
            pageNum,
            pageSize,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
            <PageContent className="base-manager">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline">
                        <FormItem
                            style={{marginBottom: 16}}
                            {...formItemLayout}
                            label="权限组编码">
                            {getFieldDecorator('virtualCode')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入权限组编码"
                                    suffix={<InputCloseSuffix form={form} field="virtualCode" dom={this.lni}/>}
                                />
                            )}
                        </FormItem>
                        <Button type="primary" size="large" htmlType="submit">查询</Button>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={PERMISSION_CODE_ADD} hasPermission={hasPermission}>
                        <Link to={'/base-information/dictionary-manager/+add/:vCode'}>
                            <Button type="primary">添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingaccess}
                        size="large"
                        rowKey={(record) => record.virtualCode}
                        columns={this.columns}
                        dataSource={access}
                        pagination={false}
                    />
                </QueryResult>
                <PaginationComponent
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    onPageNumChange={this.handlePageNumChange}
                    onPageSizeChange={this.handlePageSizeChange}
                />
            </PageContent>
        );
    }
}

export default Form.create()(DictionaryList);
