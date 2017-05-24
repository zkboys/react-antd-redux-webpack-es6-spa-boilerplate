import React, {Component} from 'react';
import {Row, Col, Tree, Form, Select, Button, Input, message, Popconfirm, InputNumber} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    generateTreeNodes,
    appendChildrenByKey,
    getNodeByKey,
    removeNodeByKey,
    addNodeChildByKey,
    updateNode,
    renderNode,
} from 'zk-react/utils/tree-utils';
import {
    FontIcon,
    FontIconModal,
    PageContent,
    Permission,
} from 'zk-react/antd';
import './style.less';
import ValidationRule from '../../../commons/validation-rule';
import {hasPermission} from '../../../commons';


export const PAGE_ROUTE = '/base-information/menu_permission';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;


class MenuPerimisson extends Component {
    state = {
        gettingMenus: false,
        treeData: [],
        selectedNode: null,
        childFormVisible: false,
        isFreshRedis: false,
        change: null,
        del: null,
    }

    getMenus() {
        this.setState({gettingMenus: true});
        promiseAjax.get('/authority/getSystemMenu').then(data => {
            if (data && data.length) {
                const treeData = data.map(d => {
                    return {name: d.name, key: d.id, ...d};
                });
                this.setState({treeData});
            }
        }).finally(() => {
            this.setState({gettingMenus: false});
        });
    }

    componentDidMount() {
        this.getMenus();
    }

    onSelect = (info) => {
        if (info && info.length) {
            const {setFieldsValue, resetFields} = this.props.form;
            resetFields();
            const treeData = [...this.state.treeData];
            const key = info[0];
            const selectedNode = getNodeByKey(treeData, key);
            this.setState({
                isFreshRedis: false,
                change: selectedNode.status,
                del: selectedNode.status,
            });
            this.setState({selectedNode, childFormVisible: false});
            setFieldsValue({
                code: selectedNode.code,
                type: selectedNode.type,
                name: selectedNode.name,
                icon: selectedNode.icon,
                path: selectedNode.path,
                status: selectedNode.status,
                url: selectedNode.url,
            });
        }
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

    handleUpdateNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        let id = selectedNode && selectedNode.id;
        if (!selectedNode || !id) {
            return message.info('请选择您要修改的菜单');
        }
        this.props.form.validateFieldsAndScroll([
            'code',
            'type',
            'name',
            'icon',
            'path',
            'status',
            'url',
            'sort',
        ], (err, values) => {
            const {isFreshRedis} = this.state;
            if (!err) {
                promiseAjax.post(`/authority/update?isFreshRedis=${isFreshRedis}`, {...values, id}, {successTip: '更新成功！'}).then(() => {
                    const newNode = {...selectedNode, ...values};
                    const treeData = [...this.state.treeData];
                    updateNode(treeData, newNode);
                    this.setState({treeData});
                });
            }
        });
    }
    handleDeleteNode = () => {
        const {selectedNode} = this.state;
        const id = selectedNode.id;
        return promiseAjax.get('/authority/del', {id}, {successTip: '删除成功！'}).then(() => {
            const treeData = [...this.state.treeData];
            removeNodeByKey(treeData, id);
            this.setState({treeData});
        });
    }
    handleShowAddChildrenFrom = () => {
        this.setState({childFormVisible: true});
    }
    childrenFields = [
        'childCode',
        'childType',
        'childName',
        'childIcon',
        'childPath',
        'childUrl',
        'childSort',
        'childStatus',
    ];
    handleAddChildrenNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        this.props.form.validateFieldsAndScroll(this.childrenFields, (err, values) => {
            if (!err) {
                let data = {
                    parentsId: selectedNode.id,
                    systemId: selectedNode.systemId,

                    code: values.childCode,
                    name: values.childName,
                    icon: values.childIcon,
                    path: values.childPath,
                    type: values.childType,
                    url: values.childUrl,
                    sort: values.childSort,
                    status: values.childStatus,
                };
                const {isFreshRedis} = this.state;
                return promiseAjax.post(`/authority/add?isFreshRedis=${isFreshRedis}`, data, {successTip: '添加成功！'}).then(res => {
                    data.id = String(res.id);
                    data.key = String(res.id);
                    this.handleResetChildrenFrom();
                    const treeData = [...this.state.treeData];
                    addNodeChildByKey(treeData, selectedNode.id, data);
                    this.setState({treeData});
                });
            }
        });
    }
    handleResetChildrenFrom = () => {
        this.props.form.resetFields(this.childrenFields);
    }
    handleStatusChange = () => {
        const {change} = this.state;
        const {getFieldValue} = this.props.form;
        let value = getFieldValue('status');
        if (value === '1') {
            value = '0';
        } else {
            value = '1';
        }
        if (value !== String(change)) {
            this.setState({isFreshRedis: true});
        } else {
            this.setState({isFreshRedis: false});
        }
    }

    render() {
        const {form: {getFieldDecorator, getFieldValue, getFieldError, setFieldsValue}} = this.props;
        let {selectedNode, childFormVisible, treeData} = this.state;
        const treeNodes = renderNode(treeData, (item, children) => {
            const isFunction = item.type === '2';
            const disabled = item.status === '0';
            let style = {};
            if (disabled) {
                style = {
                    color: 'red',
                };
            }
            const title = item.icon && !isFunction ? <span style={style}><FontIcon type={item.icon} style={{marginRight: 8}}/>{item.name}</span> : <span style={style}>{item.name}</span>;
            if (children) {
                return (
                    <TreeNode key={item.key} title={title} isLeaf={isFunction}>
                        {children}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} isLeaf={isFunction}/>;
        });

        if (!selectedNode) selectedNode = {};

        const disabled = !selectedNode.type || selectedNode.type === '0';
        const isFunctionNode = getFieldValue('type') === '2';
        const isChildFunctionNode = getFieldValue('childType') === '2';

        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const queryItemLayout = {
            xs: 48,
            md: 32,
            lg: 12,
        };

        return (
            <PageContent className="base-business-menu-permission">
                <Row>
                    <Col span={6}>
                        <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
                            {treeNodes}
                        </Tree>
                    </Col>
                    <Col span={18}>
                        <Form onSubmit={this.handleUpdateNode}>
                            <Row gutter={16}>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="名称">
                                        {getFieldDecorator('name', {
                                            initialValue: selectedNode.name || '',
                                            rules: [{required: true, message: '请输入名称！'}],
                                        })(
                                            <Input placeholder="菜单名称" disabled={disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="编码">
                                        {getFieldDecorator('code', {
                                            initialValue: selectedNode.code || '',
                                            rules: [{required: true, message: '请输入编码！'}],
                                        })(
                                            <Input placeholder="菜单编码" disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="类型">
                                        {getFieldDecorator('type', {
                                            initialValue: selectedNode.type || '',
                                            rules: [{required: true, message: '请选择类型！'}],
                                            onChange: value => {
                                                // 为了切换时清除校验状态
                                                if (value === '2' && getFieldError('path')) {
                                                    setFieldsValue({path: getFieldValue('path')});
                                                }
                                            },
                                        })(
                                            <Select disabled={disabled}>
                                                <Option value="0" disabled>系统</Option>
                                                <Option value="1">菜单</Option>
                                                <Option value="2">功能</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="图标">
                                        <Row>
                                            <Col span={12}>
                                                {getFieldDecorator('icon', {
                                                    initialValue: selectedNode.icon || '',
                                                    rules: [{required: false, message: '请选择图标'}],
                                                })(
                                                    <Input size="large" placeholder="菜单图标" disabled={disabled}/>
                                                )}
                                            </Col>
                                            <Col span={12}>
                                                <FontIconModal disabled={disabled} value={getFieldValue('icon')} onSelect={type => setFieldsValue({icon: type})}/>
                                            </Col>
                                        </Row>
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="路径">
                                        {getFieldDecorator('path', {
                                            initialValue: selectedNode.path || '',
                                            rules: [
                                                {required: !isFunctionNode, message: '请输入路径'},
                                            ],
                                        })(
                                            <Input placeholder="菜单路径" disabled={isFunctionNode || disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="url">
                                        {getFieldDecorator('url', {
                                            initialValue: selectedNode.url || '',
                                            rules: [],
                                        })(
                                            <Input placeholder="iframe页面所用url！！" disabled={isFunctionNode || disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="状态">
                                        {getFieldDecorator('status', {
                                            initialValue: String(selectedNode.status || ''),
                                            rules: [{required: true, message: '请选择状态'}],
                                            onChange: this.handleStatusChange,
                                        })(
                                            <Select style={{width: 150}} disabled={disabled}>
                                                <Option value="1">正常</Option>
                                                <Option value="0">停用</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="排序">
                                        {getFieldDecorator('sort', {
                                            initialValue: selectedNode.sort || '',
                                            rules: [
                                                ValidationRule.number('请输入一个正整数！'),
                                            ],
                                        })(
                                            <InputNumber min={0} max={10000} disabled={disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        label=" "
                                        colon={false}
                                        {...formItemLayout}
                                    >
                                        <Permission code="PORTAL_AUTHORITY_UPDATE" hasPermission={hasPermission}>
                                            <Button type="primary" htmlType="submit" style={{marginRight: '16px'}} disabled={disabled}>更新</Button>
                                        </Permission>
                                        <Popconfirm
                                            placement="topRight"
                                            title={<span>您确定删除"{selectedNode.name}"吗？<br/>{selectedNode.type === '2' ? '' : '如有子节点，也将一并删除！'}</span>}
                                            onConfirm={this.handleDeleteNode}
                                        >
                                            {hasPermission('PORTAL_AUTHORITY_DELBYID') && this.state.del === '0' ?
                                                <Button style={{marginRight: '16px'}} size="large" disabled={disabled}>删除</Button>
                                                :
                                                <Button style={{marginRight: '16px'}} size="large" disabled>删除</Button>
                                            }
                                        </Popconfirm>
                                        {
                                            !isFunctionNode ?
                                                <Permission code="VIRTUAL_PORTAL_AUTHORITY_ADD" hasPermission={hasPermission}>
                                                    <Button style={{marginRight: '16px'}} onClick={this.handleShowAddChildrenFrom}>添加子节点</Button>
                                                </Permission>
                                                :
                                                null
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        {
                            childFormVisible ?
                                <Form onSubmit={this.handleAddChildrenNode}>
                                    <Row gutter={16}>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="名称">
                                                {getFieldDecorator('childName', {
                                                    rules: [{required: true, message: '请输入名称！'}],
                                                })(
                                                    <Input placeholder="菜单名称"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="编码">
                                                {getFieldDecorator('childCode', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [
                                                        {required: true, message: '请输入编码！'},
                                                        ValidationRule.checkPermissionCode(),
                                                    ],
                                                })(
                                                    <Input placeholder="菜单编码"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="类型">
                                                {getFieldDecorator('childType', {
                                                    initialValue: '1',
                                                    rules: [{required: true, message: '请选择类型！'}],
                                                    onChange: value => {
                                                        // 为了切换时清除校验状态
                                                        if (value === '2' && getFieldError('childPath')) {
                                                            setFieldsValue({childPath: getFieldValue('childPath')});
                                                        }
                                                    },
                                                })(
                                                    <Select>
                                                        <Option value="1">菜单</Option>
                                                        <Option value="2">功能</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="图标">
                                                <Row>
                                                    <Col span={12}>
                                                        {getFieldDecorator('childIcon', {
                                                            rules: [{required: false, message: '请选择图标'}],
                                                        })(
                                                            <Input size="large" placeholder="菜单图标"/>
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        <FontIconModal value={getFieldValue('childIcon')} onSelect={type => setFieldsValue({childIcon: type})}/>
                                                    </Col>
                                                </Row>
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="路径">
                                                {getFieldDecorator('childPath', {
                                                    rules: [
                                                        {required: !isChildFunctionNode, message: '请输入路径'},
                                                    ],
                                                })(
                                                    <Input placeholder="菜单路径" disabled={isChildFunctionNode}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="url">
                                                {getFieldDecorator('childUrl', {
                                                    rules: [],
                                                })(
                                                    <Input placeholder="iframe页面所用url！！" disabled={isChildFunctionNode}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="状态">
                                                {getFieldDecorator('childStatus', {
                                                    initialValue: selectedNode.childStatus || '1',
                                                    rules: [{required: true, message: '请选择状态'}],
                                                    onChange: this.handleStatusChange,
                                                })(
                                                    <Select style={{width: 150}}>
                                                        <Option value="1">正常</Option>
                                                        <Option value="0">停用</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="排序">
                                                {getFieldDecorator('childSort', {
                                                    initialValue: 0,
                                                    rules: [
                                                        ValidationRule.number('请输入一个正整数！'),
                                                    ],
                                                })(
                                                    <InputNumber min={0} max={10000}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                label=" "
                                                colon={false}
                                                {...formItemLayout}
                                            >
                                                <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>保存</Button>
                                                <Button style={{marginRight: '16px'}} onClick={this.handleResetChildrenFrom}>重置</Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                                : null
                        }
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
export default Form.create()(MenuPerimisson);
