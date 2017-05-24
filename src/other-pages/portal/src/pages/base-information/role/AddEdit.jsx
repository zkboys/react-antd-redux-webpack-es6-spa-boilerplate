import React, {Component} from 'react';
import {Form, Row, Col, Select, Input, Switch, Button, Tree} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    PageContent,
    FontIcon,
} from 'zk-react/antd';

import {
    generateTreeNodes,
    appendChildrenByKey,
    convertToTree,
    renderNode,
    getCheckedKeys,
} from 'zk-react/utils/tree-utils';

export const PAGE_ROUTE = '/base-information/roles/+add/:roleId';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;

class AddEdit extends Component {
    state = {
        roleId: null,
        isEdit: false,
        role: {},
        systems: [],
        title: '添加角色',
        treeData: [],
        treeCheckedKeys: [],
        gettingMenus: false,
        visible: false,
        isFreshRedis: true,
        isTreeChang: true,
        beginTreeCheckedKeys: [],
    }

    componentDidMount() {
        const {params: {roleId}} = this.props;
        if (roleId !== ':roleId') {
            promiseAjax.get('/role/detail', {id: roleId}).then(data => {
                if (data) {
                    console.log(`role: ${data}`);
                    this.setState({
                        title: '修改角色',
                        isEdit: true,
                        roleId,
                        role: data,
                    });
                    this.getMenus(data.systemId, data.authorityId.split(','));
                }
            });
        } else {
            this.getMenus();
        }
    }

    getMenus(systemId, treeCheckedKeys = []) {
        this.setState({gettingMenus: true});
        promiseAjax.get('/systems', {pageSize: 99999}).then(data => {
            if (data && data.list && data.list.length) {
                this.setState({
                    systems: data.list,
                });
                systemId = systemId || data.list[0].id;
                this.getTreeData(systemId, treeCheckedKeys);
            }
        });
    }

    cachedTreeData = {};

    getTreeData(systemId, treeCheckedKeys = []) {
        const ctd = this.cachedTreeData[systemId];
        if (ctd) {
            this.setState({treeData: ctd.treeData, treeCheckedKeys: ctd.treeCheckedKeys});
            return;
        }
        promiseAjax.get(`/authority/getMenuListBySystemId/${systemId}`).then(d => {
            let treeData = [];
            if (d && d.length) {
                treeData = d;
            }
            this.cachedTreeData[systemId] = {
                treeData,
                treeCheckedKeys,
            };
            this.setState({treeData, treeCheckedKeys});
        }).finally(() => {
            this.setState({gettingMenus: false});
        });
    }

    onLoadData = (treeNode) => {
        const {children, eventKey: currentKey} = treeNode.props;
        if (children && children.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }

        return promiseAjax.get(`/authority/getMenuByParentsId/${currentKey}`).then(data => {
            const treeData = [...this.state.treeData];
            appendChildrenByKey(treeData, currentKey, generateTreeNodes(data));
            this.setState({treeData});
        });
    }

    handleTreeCheck = (checkedKeys, e) => {
        const checked = e.checked;
        const checkNodeKey = e.node.props.eventKey;
        const treeData = convertToTree(this.state.treeData);
        // Tree 要使用 checkStrictly 属性
        const allKeys = getCheckedKeys(treeData, checkedKeys, checked, checkNodeKey);
        this.setState({treeCheckedKeys: allKeys});
        const {getFieldValue} = this.props.form;
        const systemId = getFieldValue('systemId');
        const ctd = this.cachedTreeData[systemId];
        if (ctd) {
            ctd.treeCheckedKeys = allKeys;
        }
        /**
         * 设置被选中的初始值给beginTreeCheckedKeys数组，用于提交时判断这个树是否被改变过
         */
        if (this.state.isTreeChang) {
            this.setState({beginTreeCheckedKeys: this.state.treeCheckedKeys});
            this.setState({isTreeChang: false});
        }
    }

    handleSystemSelect = (systemId) => {
        this.getTreeData(systemId);
    }
    handleOk = () => {
        this.setState({isFreshRedis: true, visible: false}, () => {
            this.handleSubmit();
        });
    }
    handleCancel = () => {
        this.setState({isFreshRedis: false, visible: false}, () => {
            this.handleSubmit();
        });
    }
    handleStatusChange = () => {
        this.setState({isFreshRedis: true});
    }
    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {roleId, isEdit, treeCheckedKeys, isFreshRedis} = this.state;
                const {router} = this.props;
                values.status = values.status ? '1' : '0';
                values.code = (new Date()).getTime(); // FIXME code 不知道干嘛用的
                values.authorityId = treeCheckedKeys.join(',');

                let params = {
                    ...values,
                    id: roleId,

                };

                if (isEdit) {
                    promiseAjax.post(`/role/update?isFreshRedis=${isFreshRedis}`, params, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/role/add', values, {successTip: '添加成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                }
            }
        });
    }

    renderSystemOptions = () => {
        return this.state.systems.map(sys => <Option key={sys.id}>{sys.name}</Option>);
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {role, systems, isEdit, title, treeData, treeCheckedKeys} = this.state;
        /* eslint-disable */
        const formItemLayout = {
            labelCol: {
                xs: {span: 10},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 0},
                sm: {span: 14},
            },
        };
        let systemId = '';
        if (isEdit) {
            systemId = role.systemId || '';
        } else {
            systemId = systems && systems.length ? systems[0].id : '';
        }
        treeData.forEach(td => {
            td.key = td.id;
            td.parentKey = td.parentsId;
        });

        const treeNodes = renderNode(convertToTree(treeData), (item, children) => {
            const title = item.icon && item.type !== '2' ? <span><FontIcon type={item.icon} style={{marginRight: 8}}/>{item.name}</span> : item.name;
            if (children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {children}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title}/>;
        });

        // const treeNodes = renderNode(convertToTree(treeData),
        //     item => {
        //         return item.icon && item.type !== '2' ? <span><FontIcon type={item.icon} style={{marginRight: 8}}/>{item.name}</span> : item.name;
        //     });
        return (
            <PageContent>
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Row>
                    <Col span={12}>
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label="所属系统">
                                {getFieldDecorator('systemId', {
                                    initialValue: systemId,
                                    rules: [{required: true, message: '请选择角色所属系统！'}],
                                })(
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="请选择系统"
                                        onSelect={this.handleSystemSelect}
                                        notFoundContent="暂无数据"
                                    >
                                        {this.renderSystemOptions()}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="角色名称">
                                {getFieldDecorator('name', {
                                    initialValue: role.name,
                                    rules: [{required: true, message: '请输入角色名称！'}],
                                })(
                                    <Input placeholder="请输入角色名称"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="是否可用"
                            >
                                {getFieldDecorator('status', {
                                    initialValue: role.status === undefined ? true : role.status === '1',
                                    onChange: this.handleStatusChange,
                                    valuePropName: 'checked',
                                    rules: [
                                        {
                                            required: false, message: '请选择是否可用!',
                                        },
                                    ],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注">
                                {getFieldDecorator('remark', {
                                    initialValue: role.remark,
                                })(
                                    <Input placeholder="请输入角色备注"/>
                                )}
                            </FormItem>
                            <FormItem
                                label=" "
                                colon={false}
                                {...formItemLayout}
                            >
                                <Button type="primary" onClick={this.handleSubmit}
                                        style={{marginRight: '16px'}}>{isEdit ? '修改' : '添加' }</Button>
                                <Button
                                    type="ghost" htmlType="reset" size="large"
                                    onClick={() => this.props.form.resetFields()}>
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <div>选择权限</div>
                        <Tree
                            checkable
                            checkStrictly
                            onCheck={this.handleTreeCheck}
                            checkedKeys={{checked: treeCheckedKeys}}
                        >
                            {treeNodes}
                        </Tree>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
export default Form.create()(AddEdit);
