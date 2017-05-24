import React, {Component} from 'react';
import {Form, Input, Button, Card, Row, Col, Switch, Tabs, Checkbox, Spin, Select, Radio, DatePicker} from 'antd';
import {PageContent} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import {arrayRemove} from 'zk-react/utils';
import './style.less';
import {getCurrentLoginUser} from '../../../commons/index';
import ValidationRule from '../../../commons/validation-rule';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
export const PAGE_ROUTE = '/base-information/business/users/+add/:userId';

class UserAdd extends Component {
    state = {
        title: '添加业务人员',
        isEdit: false,
        userId: null,
        gettingUser: false,
        user: {},
        systems: [],
        activeSystemTabKey: null,
        gettingRoles: false,
        systemRoles: {}, // 角色 缓存
        roleIds: [],
        systemIds: [],
        orgNo: [],
        deptNo: [],
    };
    componentWillMount() {
        const {params: {userId}} = this.props;
        if (userId !== ':userId') {
            this.setState({
                title: '修改业务人员',
                userId,
                isEdit: true,
                gettingUser: true,
            });
            promiseAjax.get('/user/findById', {id: userId}).then(data => {
                if (data) {
                    const roleIds = data.roleId ? data.roleId.split(',') : [];
                    const systemIds = data.systemId ? data.systemId.split(',') : [];

                    this.setState({
                        roleIds,
                        systemIds,
                        user: data,
                        logName: data.userCode,
                    });
                }
            }).finally(() => {
                this.setState({
                    gettingUser: false,
                });
            });
        } else {
            promiseAjax.post('/user/getUserCode').then(data => {
                this.setState({
                    logName: data.userCode,
                });
            });
        }

        const loginUserId = getCurrentLoginUser().id;
        promiseAjax.get(`/admins/${loginUserId}`).then(data => {
            if (data && data.systems && data.systems.length) {
                const systems = data.systems.filter(sys => sys.code !== 'PORTAL');
                const activeSystemTabKey = systems[0].id;

                this.setState({
                    systems,
                    activeSystemTabKey,
                });
                this.handleSystemTabClick(activeSystemTabKey);
            }
        });
        promiseAjax.get(`/admins/${loginUserId}`).then(data => {
            if (data && data.orgNo && data.orgNo.length) {
                const orgNo = data.orgNo;
                this.setState({
                    orgNo,
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {form, router} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values.enabled) {
                    values.enabled = 1;
                } else {
                    values.enabled = 0;
                }
                if (values.gender === '男') {
                    values.gender = 0;
                } else {
                    values.gender = 1;
                }
                const {userId, systemIds, roleIds} = this.state;
                values.systemId = systemIds.join(',');
                values.roleId = roleIds.join(',');
                values.userCode = values.loginName;
                if (userId) {
                    promiseAjax.post('/user/update', values).then(() => {
                        router.goBack();
                    });
                } else {
                    promiseAjax.post('/user/add', values).then(() => {
                        router.goBack();
                    });
                }
            }
        });
    }
    handleSystemTabClick = (key) => {
        const {systemRoles} = this.state;
        if (!systemRoles[key]) {
            this.setState({
                gettingRoles: true,
            });
            promiseAjax.get('/role/getRoleBySysId', {systemId: key}).then(data => {
                const roles = data;
                if (roles && roles.length) {
                    systemRoles[key] = roles;
                    this.setState({systemRoles});
                }
            }).finally(() => {
                this.setState({
                    gettingRoles: false,
                });
            });
        }

        this.setState({
            activeSystemTabKey: key,
        });
    }

    handleRoleCheck = (checked, role) => {
        const roleId = role.id;
        const systemId = role.systemId;
        const {roleIds, systemIds} = this.state;
        if (checked) {
            roleIds.push(roleId);
            systemIds.push(systemId);
        } else {
            arrayRemove(roleIds, roleId);
            arrayRemove(systemIds, systemId);
        }
        this.setState({roleIds, systemIds});
    }

    renderDetailTabPanes = () => {
        const {systems, systemRoles, roleIds} = this.state;
        const roleLayout = {
            xs: 8,
            sm: 6,
            md: 4,
            lg: 4,
            xl: 2,
        };
        return systems.map(sys => {
            const roles = systemRoles[sys.id] || [];
            const {params: {userId}} = this.props;
            if (userId !== ':userId') {
                return (
                    <TabPane tab={sys.name} key={sys.id}>
                        <Row>
                            {roles.map(role => {
                                const checked = roleIds.indexOf(role.id) > -1;
                                return (
                                    <Col {...roleLayout} key={role.id}>
                                        <Checkbox
                                            checked={checked}
                                            onChange={e => this.handleRoleCheck(e.target.checked, role)}
                                        >
                                            {role.name}
                                        </Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </TabPane>
                );
            }
            if (userId === ':userId') {
                return (
                    <TabPane tab={sys.name} key={sys.id}>
                        <Row>
                            {roles.map(role => {
                                return (
                                    <Col {...roleLayout} key={role.id}>
                                        <Checkbox
                                            onChange={e => this.handleRoleCheck(e.target.checked, role)}
                                        >
                                            {role.name}
                                        </Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </TabPane>
                );
            }
            return null;
        });
    }

    checkPhoneNumUnique(ignoreValues = []) {
        const {getFieldValue} = this.props.form;
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                const uId = getFieldValue('id');
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .post('/user/checkPhoneNumUnique', {phone: value, id: uId}, {errorTip: false})
                    .then(res => {
                        if (res) {
                            callback('抱歉，该手机号已被占用！');
                        }
                        callback();
                    })
                    .catch(err => {
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    }

    onChange = () => {
        promiseAjax.get('/Access/').then(data => {
            if (data && data.orgNo && data.orgNo.length) {
                this.setState({
                    orgNo: data.orgNo,
                });
            }
        });
    }
    handleChange = (e) => {
        this.setState({
            gender: e.target.console.log('selected'),
        });
    }
    renderOrgNoOptions = () => {
        return this.state.orgNo.map(no => <Option key={no.id}>{no.orgNo}</Option>);
    }
    renderDeptNoOptions = () => {
        return this.state.deptNo.map(dep => <Option key={dep.id}>{dep.orgNo}</Option>);
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {title, user, userId, isEdit, activeSystemTabKey, gettingRoles, logName} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const cardStyle = {
            marginBottom: 16,
        };
        return (
            <PageContent className="base-business-user-add">
                <h1 style={{textAlign: 'center', marginBottom: 16}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Card title="账号信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="登陆名称"
                                >
                                    {getFieldDecorator('loginName', {
                                        initialValue: logName,
                                        rules: [
                                            {
                                                required: true, message: '请输入登陆名称!',
                                            },
                                        ],
                                    })(
                                        <Input disabled/>
                                    )}
                                </FormItem>
                                {
                                    isEdit ?
                                        <FormItem
                                            style={{display: 'none'}}
                                            {...formItemLayout}
                                            label="密码"
                                        >
                                            {getFieldDecorator('password', {
                                                initialValue: user.password,
                                                rules: [
                                                    {
                                                        required: true, message: '请输入密码!',
                                                    },
                                                ],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                        :
                                        <FormItem
                                            {...formItemLayout}
                                            label="密码"
                                        >
                                            {getFieldDecorator('password', {
                                                initialValue: user.password,
                                                rules: [
                                                    {
                                                        required: true, message: '请输入密码!',
                                                    },
                                                ],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                }
                                <FormItem
                                    {...formItemLayout}
                                    label="人员属性"
                                    placeholder="请选择人员属性"
                                >
                                    {getFieldDecorator('userProperty', {
                                        initialValue: user.userProperty,
                                        rules: [
                                            {
                                                required: true, message: '请选择人员属性!',
                                            },
                                        ],
                                    })(
                                        <Select>
                                            <Option value="0">内部人员</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="账号是否可用"
                                >
                                    {getFieldDecorator('enabled', {
                                        initialValue: user.enabled === undefined ? true : user.enabled === 1,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账号是否可用!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="账户是否过期"
                                >
                                    {getFieldDecorator('accountExpired', {
                                        initialValue: user.accountExpired,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账户是否过期!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="账户是否锁定"
                                >
                                    {getFieldDecorator('accountLocked', {
                                        initialValue: user.accountLocked,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账户是否锁定!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                                {isEdit ?
                                    <FormItem
                                        {...formItemLayout}
                                        label=""
                                    >
                                        {getFieldDecorator('id', {
                                            initialValue: userId,
                                        })(
                                            <Input type="hidden"/>
                                        )}
                                    </FormItem>
                                    :
                                    null
                                }
                            </Col>
                        </Row>
                    </Card>
                    <Card title="基本信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="员工编号"
                                >
                                    {getFieldDecorator('deptNo', {
                                        initialValue: user.deptNo,
                                        rules: [
                                            {
                                                required: true, message: '请输入员工编号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="性别"
                                >
                                    {getFieldDecorator('gender', {
                                        initialValue: user.gender,
                                        rules: [
                                            {
                                                required: false, message: '请选择性别!',
                                            },
                                        ],
                                    })(
                                        <RadioGroup onChange={this.onChange} value={this.state.user.gender}>
                                            <Radio value={0}>男</Radio>
                                            <Radio value={1}>女</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="归属机构"
                                >
                                    {getFieldDecorator('orgNo', {
                                        initialValue: user.orgNo,
                                        rules: [
                                            {
                                                required: false, message: '请选择归属机构!',
                                            },
                                        ],
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请选择归属机构"
                                            notFoundContent="暂无数据"
                                            onChange={this.handleChange}>
                                            {this.renderOrgNoOptions()}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号"
                                >
                                    {getFieldDecorator('phone', {
                                        validateTrigger: 'onBlur',
                                        initialValue: user.phone,
                                        rules: [
                                            {
                                                required: true, message: '请输入手机号!',
                                            },
                                            ValidationRule.mobile('请输入手机号'),
                                            this.checkPhoneNumUnique(),
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                >
                                    {getFieldDecorator('idCardName', {
                                        initialValue: user.idCardName,
                                        rules: [
                                            {
                                                required: true, message: '请输入姓名!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="出生日期"
                                >
                                    {getFieldDecorator('birthDate', {
                                        initialValue: user.birthDate,
                                        rules: [
                                            {
                                                required: false, message: '请输入出生日期!',
                                            },
                                        ],
                                    })(
                                        <DatePicker style={{width: '100%'}}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="归属部门"
                                >
                                    {getFieldDecorator('deptNo', {
                                        initialValue: user.deptNo,
                                        rules: [
                                            {
                                                required: false, message: '请选择归属部门!',
                                            },
                                        ],
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请选择归属部门"
                                            notFoundContent="暂无数据">
                                            {this.renderDeptNoOptions()}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="邮箱"
                                >
                                    {getFieldDecorator('email', {
                                        initialValue: user.email,
                                        rules: [
                                            {
                                                required: true, message: '请输入邮箱!',
                                            },
                                            ValidationRule.email('请输入邮箱'),
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="角色设置" style={cardStyle}>
                        <Spin spinning={gettingRoles}>
                            <Tabs type="card" activeKey={activeSystemTabKey} onTabClick={this.handleSystemTabClick}>
                                {this.renderDetailTabPanes()}
                            </Tabs>
                        </Spin>
                    </Card>
                    <div>
                        <Button type="primary" htmlType="submit" size="large" style={{marginRight: 16}}>保存</Button>
                        <Button
                            type="ghost" htmlType="reset" size="large"
                            onClick={() => this.props.form.resetFields()}>
                            重置
                        </Button>
                    </div>
                </Form>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(UserAdd);
