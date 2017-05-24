import React, {Component} from 'react';
import {Form, Input, Button, Table, Icon, Switch, Select, Modal} from 'antd';
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
} from 'zk-react/antd';
import _ from 'lodash';
import './style.less';
import {hasPermission} from '../../../commons';

const FormItem = Form.Item;
const Option = Select.Option;
const addEditPageRoute = '/base-information/roles/+add';

const PERMISSION_CODE_DELETE = 'PORTAL_ROLE_DELBYID';
const PERMISSION_CODE_UPDATE = 'VIRTUAL_PORTAL_ROLE_UPDATE';

export const PAGE_ROUTE = '/base-information/roles';

class Role extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingRoles: false,
        roles: [],
        total: 0,
        statusLoading: {},
        detailUser: null,
        visible: false,
        isFreshRedis: true,
        record: [],
        disabled: true,
    }
    columns = [
        {
            title: '#',
            render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize),
        },
        {
            title: '系统名称',
            dataIndex: 'systemName',
            key: 'systemName',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: '角色编码',
        //     dataIndex: 'code',
        //     key: 'code',
        // },
        {
            title: '是否可用',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                const id = record.id;
                const status = record.status === '1' || record.status === true;
                const loading = this.state.statusLoading[id];
                const loadingChildren = <Icon type="loading"/>;
                let checkedChildren = '是';
                let unCheckedChildren = '否';
                if (loading) {
                    checkedChildren = loadingChildren;
                    unCheckedChildren = loadingChildren;
                }
                const hasPer = hasPermission('PORTAL_ROLE_PATCH');
                let dis;
                if (!hasPer) {
                    dis = 'disabled';
                }
                return (
                    <Switch
                        unCheckedChildren={unCheckedChildren}
                        checkedChildren={checkedChildren}
                        checked={status}
                        disabled={dis}
                        onChange={checked => {
                            const {statusLoading, roles} = this.state;
                            if (loading) return;
                            statusLoading[id] = true;
                            this.setState({
                                statusLoading,
                            });
                            const user = roles.find(u => u.id === id);
                            const userSet = _.omit(user, 'status');
                            promiseAjax.patch(`/role/patch/${id}`, {
                                ...userSet,
                                status: !status ? 1 : 0,
                            }).then(() => {
                                const role = roles.find(u => u.id === id);
                                if (role) {
                                    role.status = checked;
                                }
                                this.setState({
                                    roles,
                                });
                                statusLoading[id] = false;
                                this.setState({
                                    statusLoading,
                                });
                            });
                        }}
                    />
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const {router} = this.props;
                const items = [
                    {
                        label: '修改',
                        permission: PERMISSION_CODE_UPDATE,
                        onClick: () => {
                            router.push({
                                pathname: `${addEditPageRoute}/${record.id}`,
                                state: {
                                    detailUser: record,
                                },
                            });
                        },
                    },
                ];
                if (record.id !== '40216044270260224' && record.status === '0') {
                    items.push({
                        label: '删除',
                        permission: PERMISSION_CODE_DELETE,
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                            onConfirm: () => this.handleDelete(record),
                        },
                    });
                }
                return (<Operator items={items} hasPermission={hasPermission}/>);
            },
        },
    ];

    search = (args) => {
        const {pageNum, pageSize} = this.state;
        const {form: {getFieldsValue}} = this.props;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({gettingRoles: true});
        promiseAjax.get('/role/get', params).then((data) => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                roles: data.list,
            });
        }).finally(() => {
            this.setState({gettingRoles: false});
        });
    }

    /**
     * 提交弹窗
     *
     */
    showModal = (record1) => {
        this.setState({
            visible: true,
            record: record1,
        });
    }
    handleDelete = (record) => {
        console.log(`isFreshRedis: ${this.state.isFreshRedis}`);
        const options = {
            successTip: `删除"${record.name}"成功`,
            errorTip: `删除"${record.name}"失败`,
        };
        promiseAjax.get(`/role/del?isFreshRedis=${this.state.isFreshRedis}`, {id: record.id}, options).then(() => {
            const roles = this.state.roles.filter(role => role.id !== record.id);
            this.setState({roles});
        });
    }
    handleOk = () => {
        this.setState({isFreshRedis: true, visible: false}, () => {
            this.handleDelete(this.state.record);
        });
    }
    handleCancel = () => {
        this.setState({isFreshRedis: false, visible: false}, () => {
            this.handleDelete(this.state.record);
        });
    }
    handleQuery = (e) => {
        e.preventDefault();
        this.search({pageNum: 1});
    }

    handlePageChange = (pageNum, pageSize) => {
        this.setState({
            pageNum,
            pageSize,
        });

        if (pageSize) {
            this.search({
                pageNum: 1,
                pageSize,
            });
        } else {
            this.search({
                pageNum,
            });
        }
    }

    componentDidMount() {
        this.search();
    }

    render() {
        const {
            gettingRoles,
            roles,
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
        const addPermissionCode = 'VIRTUAL_PORTAL_ROLE_ADD';
        return (
            <PageContent className="base-business-user">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline" style={{marginBottom: 16}}>
                        <FormItem
                            {...formItemLayout}
                            label="角色名称">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入角色名称"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色状态">
                            {getFieldDecorator('status')(
                                <Select style={{width: 150}}>
                                    <Option value="1">正常</Option>
                                    <Option value="0">停用</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label=" "
                            colon={false}
                            {...formItemLayout}
                        >
                            <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>查询</Button>
                        </FormItem>
                        <FormItem
                            label=" "
                            colon={false}
                            {...formItemLayout}
                        >
                            <Modal
                                visible={this.state.visible}
                                title="提示"
                                onOk={this.handleOk}
                                onCancel={() => this.setState({visible: false})}
                                footer={[
                                    <Button key="back" size="large" onClick={this.handleCancel}>否</Button>,
                                    <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                                        是
                                    </Button>,
                                ]}
                            >
                                <p>角色权限信息改变,用户权限是否立即变更</p>
                            </Modal>
                        </FormItem>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={addPermissionCode} hasPermission={hasPermission}>
                        <Link to={`${addEditPageRoute}/:roleId`}>
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingRoles}
                        size="middle"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={roles}
                        pagination={false}
                    />
                </QueryResult>
                <PaginationComponent
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    onChange={this.handlePageChange}
                />
            </PageContent>
        );
    }
}

export default Form.create()(Role);
