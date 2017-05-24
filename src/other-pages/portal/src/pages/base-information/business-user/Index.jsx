import React, {Component} from 'react';
import {Form, Input, Button, Table, Select, TreeSelect, Row, Col} from 'antd';
import {Link} from 'react-router';
import {PageContent, Operator, QueryBar, QueryResult, ToolBar, PaginationComponent, Permission} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import './style.less';
import {hasPermission} from '../../../commons';
import {PAGE_ROUTE as ADD_PAGE_ROUTE} from './AddEdit';
import {PAGE_ROUTE as DETAIL_PAGE_ROUTE} from './Detail';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

const PERMISSION_CODE_DETAIL = 'PORTAL_USER_FINDBYID';
const PERMISSION_CODE_ADD = 'VIRTUAL_PORTAL_USER_ADD';
const PERMISSION_CODE_UPDATE = 'VIRTUAL_PORTAL_USER_UPDATE';

export const PAGE_ROUTE = '/base-information/business/users';

class UserList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingUsers: false,
        users: [],
        total: 0,
        statusLoading: {},
    }
    columns = [
        {
            title: '#',
            render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize),
        },
        {
            title: '登陆名称',
            dataIndex: 'loginName',
            key: 'loginName',
        },
        // {
        //     title: '身份证姓名',
        //     dataIndex: 'idCardName',
        //     key: 'idCardName',
        // },
        //
        // {
        //     title: '备注名',
        //     dataIndex: 'remarkName',
        //     key: 'remarkName',
        // },
        // {
        //     title: '身份证号',
        //     dataIndex: 'idCardNo',
        //     key: 'idCardNo',
        // },

        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },


        {
            title: '出生日期',
            dataIndex: 'birthDate',
            key: 'birthDate',
        },
        // {
        //     title: '登录次数',
        //     dataIndex: 'oginCount',
        //     key: 'oginCount',
        // },
        // {
        //     title: '身份证号',
        //     dataIndex: 'idCardNo',
        //     key: 'idCardNo',
        // },
        // {
        //     title: '身份证姓名',
        //     dataIndex: 'idCardName',
        //     key: 'idCardName',
        // },
        // {
        //     title: '账户名称',
        //     dataIndex: 'accountName',
        //     key: 'accountName',
        // },
        // {
        //     title: '账号是否过期',
        //     dataIndex: 'accountExpired',
        //     key: 'accountExpired',
        // },
        // {
        //     title: '账号是否锁定',
        //     dataIndex: 'accountLocked',
        //     key: 'accountLocked',
        // },
        // {
        //     title: '结算账号',
        //     dataIndex: 'settleAccount',
        //     key: 'settleAccount',
        // },
        // {
        //     title: '联行行号',
        //     dataIndex: 'cnapsCode',
        //     key: 'cnapsCode',
        // },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },

        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },


        // {
        //     title: 'QQ号',
        //     dataIndex: 'qq',
        //     key: 'qq',
        // },
        //
        //
        // {
        //     title: '微信',
        //     dataIndex: 'wechat',
        //     key: 'wechat',
        // },


        // {
        //     title: '所属机构',
        //     dataIndex: 'orgNo',
        //     key: 'orgNo',
        // },
        // {
        //     title: '直属机构',
        //     dataIndex: 'orgName',
        //     key: 'orgName',
        // },
        // {
        //     title: '实名认证',
        //     dataIndex: 'authentication',
        //     key: 'authentication',
        // },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const {router} = this.props;
                const items = [
                    {
                        label: '查看',
                        permission: PERMISSION_CODE_DETAIL,
                        onClick: () => {
                            router.push(DETAIL_PAGE_ROUTE.replace(':userId', record.id));
                        },
                    },
                    {
                        label: '修改',
                        permission: PERMISSION_CODE_UPDATE,
                        onClick: () => this.handleEdit(record),
                    },
                ];

                return (<Operator items={items} hasPermission={hasPermission}/>);
            },
        },
    ];

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
            gettingUsers: true,
        });
        promiseAjax.get('/user/list', params).then(data => {
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].gender === 0) {
                    data.list[i].gender = '男';
                }
                if (data.list[i].gender === 1) {
                    data.list[i].gender = '女';
                }
            }
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                users: data.list,
            });
        }).finally(() => {
            this.setState({
                gettingUsers: false,
            });
        });
    }

    handleAdd = () => {
        console.log('add');
    }

    handleEdit = (record) => {
        this.props.router.push(ADD_PAGE_ROUTE.replace(':userId', record.id));
    }
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.loginName}"成功`,
            errorTip: `删除"${record.loginName}"失败`,
        };
        promiseAjax.get('/user/del', {id: record.id}, options).then(() => {
            const users = this.state.users.filter(user => user.id !== record.id);
            this.setState({users});
        });
    }
    handleQuery = (e) => {
        e.preventDefault();
        this.search({
            pageNum: 1,
        });
    }

    handlePageNumChange = (pageNum) => {
        this.setState({
            pageNum,
        });
        this.search({
            pageNum,
        });
    }
    handlePageSizeChange = pageSize => {
        this.setState({
            pageNum: 1,
            pageSize,
        });
        this.search({
            pageNum: 1,
            pageSize,
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
        // 页面渲染完成，进行一次查询
        this.search();
    }

    render() {
        const {
            gettingUsers,
            users,
            total,
            pageNum,
            pageSize,
        } = this.state;
        const {form: {getFieldDecorator}} = this.props;
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
        const queryItemLayout = {
            xs: 12,
            md: 8,
            lg: 6,
        };
        return (
            <PageContent className="base-business-user">
                <QueryBar>
                    <Form onSubmit={this.handleQuery}>
                        <Row gutter={16}>
                            <Col {...queryItemLayout}>
                                <FormItem
                                    {...formItemLayout}
                                    label="登录账号">
                                    {getFieldDecorator('loginName')(
                                        <Input placeholder="请输入登录账号" style={{width: '100%'}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout} style={{display: 'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="备注名">
                                    {getFieldDecorator('remarkName')(
                                        <Input placeholder="请输入备注名"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout} style={{display: 'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证姓名">
                                    {getFieldDecorator('idCardName')(
                                        <Input placeholder="请输入身份证姓名"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout} style={{display: 'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="状态">
                                    {getFieldDecorator('status')(
                                        <Select>
                                            <Option value="1">正常</Option>
                                            <Option value="0">停用</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout} style={{display: 'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号">
                                    {getFieldDecorator('phone')(
                                        <Input placeholder="请输入手机号"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout} style={{display: 'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="归属机构">
                                    {getFieldDecorator('orgNo')(
                                        <TreeSelect
                                            showSearch
                                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                            placeholder="请选择归属机构"
                                            allowClear
                                            treeDefaultExpandAll
                                        >
                                            <TreeNode value="parent 1" title="parent 1" key="0-1">
                                                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                                                    <TreeNode value="leaf1" title="my leaf" key="random"/>
                                                    <TreeNode value="leaf2" title="your leaf" key="random1"/>
                                                </TreeNode>
                                                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                                                    <TreeNode
                                                        value="sss"
                                                        title={<b style={{color: '#08c'}}>sss</b>}
                                                        key="random3"/>
                                                </TreeNode>
                                            </TreeNode>
                                        </TreeSelect>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout}>
                                <FormItem
                                    label=" "
                                    colon={false}
                                    {...formItemLayout}
                                >
                                    <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>查询</Button>
                                    <Button type="ghost" onClick={() => this.props.form.resetFields()}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={PERMISSION_CODE_ADD} hasPermission={hasPermission}>
                        <Link to={ADD_PAGE_ROUTE}>
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingUsers}
                        size="middle"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={users}
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

export default Form.create()(UserList);
