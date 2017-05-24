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
    InputCloseSuffix,
} from 'zk-react/antd';
import {hasPermission} from '../../../commons';
import './style.less';
import {PAGE_ROUTE as ADD_PAGE_ROUTE} from './AddEdit';

const PERMISSION_CODE_DELETE = 'PORTAL_WHITELIST_DELETE';
const PERMISSION_CODE_UPDATE = 'VIRTUAL_PORTAL_WHITELIST_UPDATE';
const PERMISSION_CODE_ADD = 'VIRTUAL_PORTAL_WHITELIST_SAVE';


export const PAGE_ROUTE = '/base-information/whiteList';

const FormItem = Form.Item;

class AdminList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingShiteList: false,
        whiteList: [],
        total: 0,
    };
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '权限', dataIndex: 'authority', key: 'authority', width: '20%'},
        {title: '系统', dataIndex: 'systemName', key: 'systemId'},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {title: '操作', key: 'operator', render: (...args) => this.renderOperatorColumn(...args)},
    ];
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
                    title: `您确定要删除“${record.authority}”？`,
                    onConfirm: () => this.handleDelete(record),
                },
            },
        ];

        return (<Operator items={items} hasPermission={hasPermission}/>);
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
            gettingShiteList: true,
        });
        promiseAjax.get('/whiteList/find', params).then(data => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                whiteList: data.list,
            });
        }).finally(() => {
            this.setState({
                gettingShiteList: false,
            });
        });
    }
    handleEdit = (record) => {
        const {router} = this.props;
        router.push(ADD_PAGE_ROUTE.replace(':whiteListId', record.id));
    };
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.authority}"成功`,
            errorTip: `删除"${record.authority}"失败`,
        };
        promiseAjax.get(`/whiteList/delete/${record.id}`, {systemId: record.systemId}, options).then(() => {
            const whiteList = this.state.whiteList.filter(white => white.id !== record.id);
            this.setState({whiteList});
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
            gettingShiteList,
            whiteList,
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
                            label="权限">
                            {getFieldDecorator('authority')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入权限"
                                    suffix={<InputCloseSuffix form={form} field="authority" dom={this.lni}/>}
                                />
                            )}
                        </FormItem>
                        <Button type="primary" size="large" htmlType="submit">查询</Button>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={PERMISSION_CODE_ADD} hasPermission={hasPermission}>
                        <Link to={ADD_PAGE_ROUTE}>
                            <Button type="primary">添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingShiteList}
                        size="large"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={whiteList}
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

export default Form.create()(AdminList);
