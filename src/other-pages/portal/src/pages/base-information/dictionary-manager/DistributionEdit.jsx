import React, {Component} from 'react';
import {Form, Input, Button, Table, Modal, Select} from 'antd';
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
import ValidationRule from '../../../commons/validation-rule';

const PERMISSION_CODE_DELETE = 'VIRTUAL_PORTAL_ADMINS_UPDATE';
const PERMISSION_CODE_UPDATE = 'VIRTUAL_PORTAL_ADMINS_UPDATE';
const PERMISSION_CODE_ADD = 'VIRTUAL_PORTAL_ADMINS_SAVE';
// const PERMISSION_CODE_DIVIDE = 'VIRTUAL_PORTAL_UPDATE';

export const PAGE_ROUTE = '/base-information/dictionary-manager/+distribution/:id/:virtualCode/:systemId';

const FormItem = Form.Item;

class DistributionList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingaccess: false,
        access: [],
        total: 0,
        statusLoading: {},
        isEdit: false,
        visible: false,
        id: null,
        admin: {},
        title: '添加权限组',
        systems: [],
        add: null,
        idPut: null,
    };
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '权限组编码', dataIndex: 'authorityVirtual', key: 'virtualCode', width: '15%', render: (...args) => this.renderVirColumn(...args)},
        {title: '权限组描述', dataIndex: 'authorityVirtual', key: 'virtualDescription', width: '15%', render: (...args) => this.renderDisColumn(...args)},
        {title: '权限编码', dataIndex: 'authorityCode', key: 'authorityCode', width: '15%'},
        {title: '权限描述', dataIndex: 'authorityDescription', key: 'authorityDescription', width: '15%'},
        {title: '系统', dataIndex: 'authorityVirtual', key: 'system', render: (...args) => this.renderSystemColumn(...args)},
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
    renderDisColumn = (text) => {
        console.log(text);
        return text.virtualDescription;
    };
    renderVirColumn = (text) => {
        return text.virtualCode;
    };
    renderSystemColumn = (text) => {
        return text.system.name;
    };
    renderOperatorColumn = (text, record) => {
        const items = [
            {
                label: '修改',
                permission: PERMISSION_CODE_UPDATE,
                onClick: () => this.handleEdit(record.id),
            },
            {
                label: '删除',
                permission: PERMISSION_CODE_DELETE,
                confirm: {
                    title: `您确定要删除“${record.authorityVirtual.virtualCode}”？`,
                    onConfirm: () => this.handleDelete(record),
                },
            },
        ];

        return (<Operator items={items} hasPermission={hasPermission}/>);
    };
    handleRefresh = () => {
        this.search();
    }
    search = (args) => {
        const {params: {id, virtualCode, systemId}} = this.props;
        const {form: {getFieldsValue}} = this.props;
        const {pageNum, pageSize} = this.state;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
            id,
            virtualCode,
            systemId,
        };
        this.setState({
            gettingaccess: true,
        });
        promiseAjax.get('/authorityVirtualSlave/list', params).then(data => {
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
    handleEdit = (id) => {
        this.setState({add: 1, idPut: id});
        promiseAjax.get('/authorityVirtualSlave/findForUpdate', {id}).then(data => {
            const {setFieldsValue} = this.props.form;
            if (data && data.authorityVirtual && data.authorityVirtual.system) {
                setFieldsValue({virtualDescription: data.authorityVirtual.virtualDescription});
                setFieldsValue({virtualCode: data.authorityVirtual.virtualCode});
                setFieldsValue({virtualDescription: data.authorityVirtual.virtualDescription});
                setFieldsValue({systems: data.authorityVirtual.system.name});
                setFieldsValue({authorityCode: data.authorityCode});
                setFieldsValue({authorityDescription: data.authorityDescription});
                setFieldsValue({remark: data.remark});
            }
            this.setState({
                visible: true,
            });
        });
    };
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.authorityVirtual.virtualCode}"成功`,
            errorTip: `删除"${record.authorityVirtual.virtualCode}"失败`,
        };
        let idDel = {
            id: record.id,
        };
        promiseAjax.get('/authorityVirtualSlave/del', idDel, options).then(() => {
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

    showModal = () => {
        const {params: {id, virtualCode}} = this.props;
        let params = {
            id,
            virtualCode,
        };
        const {setFieldsValue, resetFields} = this.props.form;
        resetFields();
        promiseAjax.get('/authorityVirtualSlave/findForSave', params).then((data) => {
            setFieldsValue({virtualCode: data.virtualCode});
            setFieldsValue({virtualDescription: data.virtualDescription});
            setFieldsValue({systems: data.system.name});
        });
        this.setState({add: 0});
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    renderSystemOptions = () => {
        return this.state.systems.filter(sys => sys.code !== 'PORTAL').map(sys => <Option key={sys.id}>{sys.name}</Option>);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {add} = this.state;
                const {params: {id}} = this.props;
                const idAuth = id;
                let authorityVirtualSlave = {
                    authorityCode: values.authorityCode,
                    remark: values.remark,
                    authorityDescription: values.authorityDescription,
                    authorityVirtual: {
                        id: idAuth,
                        virtualCode: values.virtualCode,
                        virtualDescription: values.virtualDescription,
                    },
                };
                const {idPut} = this.state;
                let authorityVirtualSlaves = {
                    id: idPut,
                    authorityCode: values.authorityCode,
                    remark: values.remark,
                    authorityDescription: values.authorityDescription,
                    authorityVirtual: {
                        id: idAuth,
                        virtualCode: values.virtualCode,
                        virtualDescription: values.virtualDescription,
                    },
                };
                if (add !== 0) {
                    promiseAjax.post('/authorityVirtualSlave/update', authorityVirtualSlaves, {successTip: '修改成功'}).then(() => {
                        this.setState({visible: false});
                        setTimeout(() => {
                            this.search();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/authorityVirtualSlave/add', authorityVirtualSlave, {successTip: '添加成功'}).then(() => {
                        this.setState({visible: false});
                        setTimeout(() => {
                            this.search();
                        }, 1000);
                    });
                }
            }
        });
    }
    goBack = () => {
        const {router} = this.props;
        router.goBack();
    }

    render() {
        const {
            form,
            form: {getFieldDecorator},
        } = this.props;

        const {
            gettingAdmins,
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
        const {access} = this.state;
        let ignoreValues = [];
        let systemOptionValue = [];
        if (access && access.system) {
            systemOptionValue = access.system.name;
        }
        return (
            <PageContent className="base-manager">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline">
                        <FormItem
                            style={{marginBottom: 16}}
                            {...formItemLayout}
                            label="权限组编码">
                            {getFieldDecorator('accessCode')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入权限组编码"
                                    suffix={<InputCloseSuffix form={form} field="accessCode" dom={this.lni}/>}
                                />
                            )}
                        </FormItem>
                        <Button type="primary" size="large" htmlType="submit">查询</Button>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={PERMISSION_CODE_ADD} hasPermission={hasPermission}>
                        <Button type="primary" onClick={this.showModal}>添加</Button>
                        <Button type="primary" onClick={this.goBack}>返回</Button>
                        <Modal footer={null} title="添加权限组" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                        >
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    {...formItemLayout}
                                    label="权限组编码"
                                >
                                    {getFieldDecorator('virtualCode', {
                                        initialValue: access.virtualCode,
                                        validateTrigger: 'onBlur',
                                        rules: [
                                            {
                                                required: true, message: '请输入权限组编码!',
                                            },
                                            ValidationRule.checkAdminLoginName(ignoreValues),
                                        ],
                                    })(
                                        <Input placeholder="请输入权限组编码" disabled/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="权限组描述"
                                >
                                    {getFieldDecorator('virtualDescription', {
                                        initialValue: access.virtualDescription,
                                        validateTrigger: 'onBlur',
                                        rules: [
                                            {
                                                ruquired: false, message: '请输入权限组描述！',
                                            },
                                            ValidationRule.checkAdminLoginName(ignoreValues),
                                        ],
                                    })(
                                        <Input placeholder="请输入权限组描述" disabled/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="系统"
                                >
                                    {getFieldDecorator('systems', {
                                        initialValue: systemOptionValue,
                                        rules: [
                                            {
                                                required: true, message: '请选择系统!',
                                            },
                                        ],
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请选择系统"
                                            notFoundContent="暂无数据"
                                            disabled
                                        >
                                            {this.renderSystemOptions()}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="权限编码"
                                >
                                    {getFieldDecorator('authorityCode', {
                                        initialValue: access.authorityCode,
                                        rules: [
                                            {
                                                required: true, message: '请输入权限组编码!',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入权限组编码"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="权限描述"
                                >
                                    {getFieldDecorator('authorityDescription', {
                                        initialValue: access.authorityDescription,
                                        rules: [
                                            {
                                                required: true, message: '请输入权限组描述！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入权限组描述"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="备注"
                                >
                                    {getFieldDecorator('remark', {
                                        initialValue: access.remark,
                                        rules: [
                                            {
                                                required: false, message: '请输入备注!',
                                            },
                                        ],
                                    })(
                                        <Input type="textarea" placeholder="请输入备注"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label=" "
                                    colon={false}
                                >
                                    <Button type="primary" htmlType="submit" size="large" style={{marginRight: 16}}>保存</Button>
                                    <Button
                                        type="ghost" htmlType="reset" size="large"
                                        onClick={() => this.props.form.resetFields()}>
                                        重置
                                    </Button>
                                </FormItem>
                            </Form>
                        </Modal>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingAdmins}
                        size="large"
                        rowKey={(record) => record.id}
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

export default Form.create()(DistributionList);
