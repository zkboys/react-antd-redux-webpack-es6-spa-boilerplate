import React, {Component} from 'react';
import {Form, Input, Button, Select, Row, Col, Card, Tree, message} from 'antd';
import {promiseAjax} from 'zk-react';
import _ from 'lodash';
import './style.less';
import * as roleIndex from './Index';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
export const PAGE_ROUTE = '/base-information/roles/+manage/:type/:id';
// 如果要使用 actions.setState方法，PAGE_SCOPE，INIT_STATE，必须定义
export const PAGE_SCOPE = 'baseInformationRoleAdd'; // 用来控制当前页面放入store中的state作用于，防止各页面冲突

function generateTreeNodes(parentNodeId, treeNode) {
    const arr = [];
    treeNode.map((value) => {
        arr.push({
            createTime: value.createTime,
            createUserId: value.createUserId,
            updateTime: value.updateTime,
            updateUserId: value.updateUserId,
            id: `${parentNodeId}-${value.id}`,
            parentsId: value.parentsId,
            code: value.code,
            type: value.type,
            path: value.path,
            url: value.url,
            name: value.name,
            systemId: value.systemId,
            systemName: value.systemName,
            systemCode: value.systemCode,
            sort: value.sort,
            icon: value.icon,
            roleId: value.roleId,
        });
        return null;
    });
    return arr;
}

function setLeaf(treeData, curKey, level) {
    const loopLeaf = (data, lev) => {
        const l = lev - 1;
        data.forEach((item) => {
            if ((item.id.length > curKey.length) ? item.id.indexOf(curKey) !== 0 :
                    curKey.indexOf(item.id) !== 0) {
                return;
            }
            if (item.children) {
                loopLeaf(item.children, l);
            } else if (l < 1) {
                item.isLeaf = true;
            }
        });
    };
    loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey.indexOf(item.id) === 0) {
                if (item.children) {
                    loop(item.children);
                } else {
                    item.children = child;
                }
            }
        });
    };
    loop(treeData);
    setLeaf(treeData, curKey, level);
}

class RoleManager extends Component {
    state = {
        user: {
            systemName: '',
            name: '',
            authorityId: '',
            code: '',
            remark: '',
            status: '',
            systemId: '',
        },
        treeData: [],
        systems: [],
    }

    search(userId) {
        promiseAjax.get('/role/get', {
            pageSize: 20,
            pageNum: 1,
            userId,
        }).then((data) => {
            this.setState({
                user: data.list[0],
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    updateUser(userAdd) {
        let {user} = this.state;
        promiseAjax.post('/role/update', {
            ...userAdd,
            id: user.id,
        }).then(() => {
            this.props.router.replace('/base-information/roles');
        }).catch((err) => {
            console.log(err);
        });
    }

    addUser(userAdd) {
        console.log(userAdd);
        let {authorityId} = this.state;
        promiseAjax.post('/role/add', {
            code: userAdd.code,
            name: userAdd.name,
            remark: userAdd.remark,
            status: userAdd.status,
            systemId: userAdd.systemId.join(','),
            authorityId,
        }).then(() => {
            message.info('添加成功');
            this.props.router.replace('/base-information/roles');
        }).catch((err) => {
            console.log(err);
        });
    }

    getSearch = (systemId) => {
        console.log(systemId);
        promiseAjax.get(`/authority/getMenuByParentsId/${systemId}`).then(data => {
            console.log(data);
            this.setState({
                treeData: data,
            });
        }).finally(() => {
            this.setState({
                gettingUsers: false,
            });
        });
    }

    onLoadData = (treeNode) => {
        return promiseAjax.get(`/authority/getMenuByParentsId/${treeNode.props.eventKey.split('-')[treeNode.props.eventKey.split('-').length - 1]}`).then(data => {
            const treeData = [...this.state.treeData];
            getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode.props.eventKey, data), 10);
            this.setState({treeData});
        }).catch(err => {
            console.log(err);
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {params: {type}, router} = this.props;
        this.props.form.validateFields((err, values) => {
            if (type === 'add' && !err) {
                this.addUser(values);
            } else if (type === 'amend' && !err) {
                this.updateUser(values);
            } else if (type === 'check') {
                router.push('/base-information/roles');
            }
        });
    };

    componentWillMount() {
        const {params} = this.props;
        promiseAjax.get('/systems', {pageSize: 99999}).then(data => {
            if (data && data.list && data.list.length) {
                this.setState({
                    systems: data.list,
                });
                this.getSearch(data.list[0].id);
            }
        });
        if (params.type === 'add') {
            return null;
        }
        this.search(params.id);
    }

    // PORTAL
    renderSystemOptions = () => {
        return this.state.systems.map(sys => <Option value={sys.id} key={sys.id}>{sys.name}</Option>);
    }
    onCheck = (checkedKeys) => {
        let arr = [];
        checkedKeys.map((value) => {
            arr.push(value.split('-')[value.split('-').length - 1]);
            return null;
        });
        const {user} = this.state;
        let userSet = _.omit(user, 'authorityId');
        let data = '';
        arr.map((value, key) => {
            if (key === arr.length - 1) {
                data += value;
            } else {
                data += (`${value},`);
            }
            return null;
        });
        userSet.authorityId = data;
        this.setState({authorityId: data});
    }

    renderTree() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name} key={item.id} isLeaf={item.type === '1'}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name} key={item.id} isLeaf={item.type === '1'}/>;
        });
        const treeNodes = loop(this.state.treeData);
        return (
            <Tree checkable onSelect={this.onSelect} loadData={this.onLoadData} onCheck={this.onCheck}>
                {treeNodes}
            </Tree>
        );
    }

    render() {
        const {form: {getFieldDecorator}, params: {id, type}} = this.props;
        let {user} = this.state || {};
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
        const queryItemLayout = {
            xs: 48,
            md: 32,
            lg: 24,
        };
        let roleTitle = '';
        if (type === 'add') {
            roleTitle = '添加角色';
        } else if (type === 'amend') {
            roleTitle = '修改角色';
        } else if (type === 'check') {
            roleTitle = '查看角色';
        }
        const isAdd = type === 'add';
        let systemId = '';
        if (!isAdd) {
            systemId = user.systemId || '';
        } else {
            const sysList = this.state.systems.filter(sys => sys.code !== 'PORTAL');
            systemId = sysList && sysList.length ? [sysList[0].id] : [];
            console.log(systemId);
        }
        return (
            <Row>
                <Col span="11" style={{marginRight: 30}}>
                    <Card title={roleTitle} style={{minHeight: 900}}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row gutter={16}>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="系统名称">
                                        {getFieldDecorator('systemId', {
                                            initialValue: systemId,
                                            rules: [{required: true, message: '请输入角色系统名称！'}],
                                        })(
                                            <Select
                                                style={{width: '100%'}}
                                                placeholder="请选择系统名称"
                                                onSelect={this.getSearch}
                                                notFoundContent="暂无数据"
                                            >
                                                {this.renderSystemOptions()}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="角色名称">
                                        {getFieldDecorator('name', {
                                            initialValue: user.name,
                                            rules: [{required: true, message: '请输入角色名称！'}],
                                        })(
                                            <Input disabled={type === 'check'} placeholder="请输入角色名称"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="角色编码">
                                        {getFieldDecorator('code', {
                                            initialValue: user.code,
                                            rules: [{required: true, message: '请输入角色编码！'}],
                                        })(
                                            <Input disabled={type === 'check'} placeholder="请输入角色编码"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="状态">
                                        {getFieldDecorator('status', {
                                            initialValue: user.status.toString(),
                                            rules: [{required: true, message: '请输入角色状态！'}],
                                        })(
                                            <Select
                                                disabled={type === 'check'}
                                                notFoundContent="暂无数据"
                                            >
                                                <Option value="1">正常</Option>
                                                <Option value="0">停用</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="备注">
                                        {getFieldDecorator('remark', {
                                            initialValue: user.remark,
                                        })(
                                            <Input disabled={type === 'check'} placeholder="请输入角色备注"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        label=" "
                                        colon={false}
                                        {...formItemLayout}
                                    >
                                        {
                                            (type === 'add' || type === 'amend') &&
                                            <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>{id === 'add' ? '添加' : '修改' }</Button>
                                        }
                                        {
                                            type === 'check' &&
                                            <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>返回</Button>
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                {
                    type !== 'check' &&
                    <Col span="11">
                        <Card title={type === 'add' ? '添加权限' : '修改权限'} style={{minHeight: 900}}>
                            {this.renderTree()}
                        </Card>
                    </Col>
                }
            </Row>
        );
    }
}

export const LayoutComponent = Form.create()(RoleManager);
export function mapStateToProps(state) {
    return {
        ...state.pageState[roleIndex.PAGE_SCOPE],
    };
}
