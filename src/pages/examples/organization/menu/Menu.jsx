import React, {Component} from 'react';
import {Form, Row, Col, Button, Tree, Input, InputNumber, Select, message, Popconfirm} from 'antd';
import {PageContent, FontIcon, FormItemLayout, FontIconModal} from 'zk-tookit/antd';
import {uniqueArray} from 'zk-tookit/utils';
import {
    renderNode,
    convertToTree,
} from 'zk-tookit/utils/tree-utils';

const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const NEW_NODE_KEY = 'NEW_NODE_KEY';

export const PAGE_ROUTE = '/organization/menus';

@Form.create()
export default class extends Component {
    state = {
        treeData: [],
        data: [],
        expandedKeys: [],
        selectedKeys: [],
    };

    componentWillMount() {
        // TODO ajax 获取后端menu数据
        const data = [
            {
                key: '1',
                type: 'menu',
                text: '顶级节点1',
                icon: 'fa-users',
                path: '',
            },
            {
                key: '11',
                type: 'menu',
                parentKey: '1',
                text: '子节点11',
                icon: 'fa-users',
                path: '/example/1',
            },
            {
                key: '12',
                type: 'menu',
                parentKey: '1',
                text: '子节点12',
                icon: 'fa-users',
                path: '/users/add',
            },
            {
                key: '123',
                type: 'menu',
                parentKey: '12',
                text: '子节点123',
                icon: 'fa-users',
                path: '/users/add/adsf',
            },
            {
                key: '124',
                type: 'menu',
                parentKey: '12',
                text: '子节点124',
                icon: 'fa-users',
                path: '/users/add/adsf',
            },
            {
                key: '1241',
                type: 'menu',
                parentKey: '124',
                text: '子节点1241',
                icon: 'fa-users',
                path: '/users/add/adsf',
            },
            {
                key: '1242',
                type: 'menu',
                parentKey: '124',
                text: '子节点1242',
                icon: 'fa-users',
                path: '/users/add/adsf',
            },
            {
                key: '2',
                type: 'menu',
                text: '顶级节点2',
                icon: 'fa-users',
                path: '',
            },
            {
                key: '21',
                type: 'menu',
                parentKey: '2',
                text: '子节点21',
                icon: 'fa-users',
                path: '/role/list',
            },
            {
                key: '22',
                type: 'menu',
                parentKey: '2',
                text: '子节点22',
                icon: 'fa-users',
                path: '/role/list',
            },
        ];
        this.setState({data});
    }

    handleAddNewNode = (type) => {
        const selectedKeys = [...this.state.selectedKeys];
        const data = [...this.state.data];
        const {setFieldsValue} = this.props.form;
        // 未选中父节点，不添加子节点
        if (type === 'subNode' && (!selectedKeys || !selectedKeys.length)) {
            return message.error('请选择一个父节点！', 3);
        }
        // 有新添加的节点未保存
        const existedNewNode = data.find(item => item.key === NEW_NODE_KEY);
        if (existedNewNode) {
            return message.error('您有未保存的新增节点！', 3);
        }

        const parentKey = type === 'topNode' ? '' : selectedKeys[0];
        const newNode = {
            key: NEW_NODE_KEY,
            parentKey,
            type: 'menu',
            text: '新增节点',
            icon: 'fa-lock',
            path: '',
            order: 100, // 越大优先级越高，越靠前
        };
        data.push(newNode);
        setFieldsValue(newNode);
        this.setState({data});
        let expandedKeys = [...this.state.expandedKeys];
        expandedKeys.push(NEW_NODE_KEY);
        expandedKeys.push(parentKey);
        expandedKeys = uniqueArray(expandedKeys);
        this.setState({selectedKeys: [NEW_NODE_KEY], expandedKeys});
    };

    handleExpand = (expandedKeys) => {
        this.setState({expandedKeys});
    };

    getTreeData() {
        const {data} = this.state;
        // 根据order 排序
        const orderedData = [...data].sort((a, b) => {
            const aOrder = a.order || 0;
            const bOrder = b.order || 0;

            // 如果order都不存在，根据 text 排序
            if (!aOrder && !bOrder) {
                return a.text > b.text ? 1 : -1;
            }
            return bOrder - aOrder;
        });
        return convertToTree(orderedData);
    }

    handleTreeSelect = (selectedKeys) => {
        const {data} = this.state;

        // 有新添加的节点未保存
        const existedNewNode = data.find(item => item.key === NEW_NODE_KEY);
        if (existedNewNode) {
            return message.error('您有未保存的新增节点！', 3);
        }

        const selectedNode = data.find(item => item.key === selectedKeys[0]);
        if (selectedNode) {
            const {setFieldsValue} = this.props.form;
            if (selectedNode.type === 'menu') {
                setFieldsValue({
                    key: selectedNode.key,
                    parentKey: selectedNode.parentKey,
                    type: selectedNode.type,
                    text: selectedNode.text,
                    path: selectedNode.path,
                    icon: selectedNode.icon,
                    order: selectedNode.order,
                });
            }
            if (selectedNode.type === 'function') {
                setFieldsValue({
                    key: selectedNode.key,
                    parentKey: selectedNode.parentKey,
                    type: selectedNode.type,
                    text: selectedNode.text,
                    code: selectedNode.code,
                });
            }
            this.setState({
                selectedKeys,
            });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // 三种情况：添加顶级 添加子级 修改节点
                // TODO ajax 保存数据
                values.key = `${new Date().getTime()}`;
                const savedMenu = values; // FIXME 保存成功之后，返回的数据，key已经改为后端的_id
                const {data} = this.state;
                let newData = [...data];
                const existedNewMenu = data.find(item => item.key === NEW_NODE_KEY);
                if (existedNewMenu) { // 添加顶级 添加子级
                    newData = data.filter(item => item.key !== NEW_NODE_KEY);
                    newData.push(savedMenu);
                    this.setState({data: newData});
                    this.setState({selectedKeys: [savedMenu.key]});
                }
            }
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleDelete = () => {
        const {selectedKeys, data} = this.state;
        const key = selectedKeys[0];
        if (key === NEW_NODE_KEY) {
            const newData = data.filter(item => item.key !== NEW_NODE_KEY);
            this.setState({data: newData});
            this.props.form.resetFields();
            this.setState({selectedKeys: []});
        } else {
            // TODO 发送ajax 请求，删除后端数据
            const newData = data.filter(item => item.key !== key);
            this.setState({data: newData});
            this.props.form.resetFields();
            this.setState({selectedKeys: []});
        }
    }

    render() {
        const {form: {getFieldDecorator, getFieldValue, setFieldsValue}} = this.props;
        const {selectedKeys, expandedKeys} = this.state;
        const treeData = this.getTreeData();

        const treeNode = renderNode(treeData, (item, children) => {
            let text = item.text;
            const key = item.key;
            const icon = item.icon;

            if (icon) {
                text = <span><FontIcon type={icon}/> {item.text}</span>;
            }

            if (key === NEW_NODE_KEY) {
                text = <span style={{color: 'red'}}>{text}</span>;
            }

            if (children) {
                return (
                    <TreeNode key={key} title={text}>
                        {children}
                    </TreeNode>
                );
            }
            return <TreeNode key={key} title={text}/>;
        });

        const formItemWidth = 300;
        const disabled = !selectedKeys || !selectedKeys.length;
        return (
            <PageContent>
                <Row>
                    <Col span={8}>
                        <Button type="primary" onClick={() => this.handleAddNewNode('topNode')}>添加顶级</Button>
                        <Tree
                            selectedKeys={selectedKeys}
                            expandedKeys={expandedKeys}
                            onExpand={this.handleExpand}
                            onSelect={this.handleTreeSelect}
                        >
                            {treeNode}
                        </Tree>
                    </Col>
                    <Col span={16}>
                        <Button type="ghost" onClick={() => this.handleAddNewNode('subNode')} disabled={disabled}>添加子节点</Button>
                        <Popconfirm placement="bottom" title="您确定删除此节点吗？其子节点也将一并被删除！" onConfirm={this.handleDelete}>
                            <Button type="danger" style={{marginLeft: 8}} disabled={disabled}>删除</Button>
                        </Popconfirm>
                        <Form onSubmit={this.handleSubmit} style={{marginTop: 12}}>
                            {getFieldDecorator('key')(<Input type="hidden"/>)}
                            {getFieldDecorator('parentKey')(<Input type="hidden"/>)}
                            <FormItemLayout
                                label="类型"
                                labelSpaceCount={2}
                                width={formItemWidth}
                            >
                                {getFieldDecorator('type', {
                                    initialValue: 'menu',
                                    rules: [{required: true, message: '请选择类型'}],
                                })(
                                    <Select disabled={disabled}>
                                        <Option value="menu">菜单</Option>
                                        <Option value="function">功能</Option>
                                    </Select>
                                )}
                            </FormItemLayout>
                            <FormItemLayout
                                label="名称"
                                labelSpaceCount={2}
                                width={formItemWidth}
                            >
                                {getFieldDecorator('text', {
                                    rules: [{required: true, message: '请输入菜单名称'}],
                                })(
                                    <Input placeholder="请输入菜单名称" disabled={disabled}/>
                                )}
                            </FormItemLayout>
                            <FormItemLayout
                                label="编码"
                                labelSpaceCount={2}
                                width={formItemWidth}
                                style={{display: getFieldValue('type') === 'function' ? 'block' : 'none'}}
                            >
                                {getFieldDecorator('code', {
                                    rules: [{required: getFieldValue('type') === 'function', message: '请输入功能编码'}],
                                })(
                                    <Input placeholder="请输入功能编码" disabled={disabled}/>
                                )}
                            </FormItemLayout>
                            <div style={{display: getFieldValue('type') === 'menu' ? 'block' : 'none'}}>
                                <FormItemLayout
                                    label="路径"
                                    labelSpaceCount={2}
                                    width={formItemWidth}
                                >
                                    {getFieldDecorator('path', {
                                        rules: [{required: false, message: '请输入菜单路径'}],
                                    })(
                                        <Input placeholder="请输入菜单路径" disabled={disabled}/>
                                    )}
                                </FormItemLayout>
                                <div>
                                    <FormItemLayout
                                        label="图标"
                                        labelSpaceCount={2}
                                        width={formItemWidth - 110}
                                        float
                                    >
                                        {getFieldDecorator('icon', {
                                            rules: [{required: false, message: '请输入菜单图标'}],
                                        })(
                                            <Input placeholder="请输入菜单图标" disabled={disabled}/>
                                        )}
                                    </FormItemLayout>
                                    <div style={{float: 'left', width: 110, textAlign: 'right'}}>
                                        <FontIconModal disabled={disabled} value={getFieldValue('icon')} onSelect={type => setFieldsValue({icon: type})}/>
                                    </div>
                                    <div style={{clear: 'both'}}/>
                                </div>
                                <FormItemLayout
                                    label="排序"
                                    labelSpaceCount={2}
                                    width={formItemWidth}
                                >
                                    {getFieldDecorator('order', {
                                        rules: [{required: false, message: '请输入菜单排序'}],
                                    })(
                                        <InputNumber style={{width: '100%'}} step={1} placeholder="请输入整数" disabled={disabled}/>
                                    )}
                                </FormItemLayout>
                            </div>
                            <Button type="primary" htmlType="submit" disabled={disabled}>保存</Button>
                            <Button type="ghost" style={{marginLeft: 8}} onClick={this.handleReset} disabled={disabled}>重置</Button>
                        </Form>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
