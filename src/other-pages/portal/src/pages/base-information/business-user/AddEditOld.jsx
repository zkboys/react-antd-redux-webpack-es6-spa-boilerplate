import React, {Component} from 'react';
import {Form, Input, Button, Card, Row, Col, Switch, Tabs, Checkbox, Spin, Select} from 'antd';
import {PageContent} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import {arrayRemove} from 'zk-react/utils';
import './style.less';
import {getCurrentLoginUser} from '../../../commons/index';
import ValidationRule from '../../../commons/validation-rule';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

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
                    if (data.gender === 0) {
                        data.gender = '男';
                    } else {
                        data.gender = '女';
                    }
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

    generateRemarkName = () => {
        const {getFieldValue} = this.props.form;
        const idCardName = getFieldValue('idCardName');
        promiseAjax
            .post('/user/generateRemarkName', {idCardName}, {errorTip: false})
            .then(res => {
                this.props.form.setFieldsValue({
                    remarkName: res.remarkName,
                });
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

    idCardNumToBithAndSex(ignoreValues = []) {
        const {getFieldValue, getFieldError, setFieldsValue} = this.props.form;
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                const val = getFieldValue('idCardNo');
                const error = getFieldError('idCardNo');
                const uId = getFieldValue('id');
                if (!val) {
                    return callback();
                }
                if (error && error.length && (error.indexOf('抱歉，该身份证号已被占用！') < 0)) {
                    return callback();
                }

                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .post('/user/checkIdCardNumUnique', {idCardNo: value, id: uId}, {errorTip: false})
                    .then(res => {
                        if (!res) {
                            return callback('抱歉，该身份证号已被占用！');
                        }
                        callback();
                        promiseAjax
                            .post('/user/IdCardNumToBithAndSex', {idCardNo: val}, {errorTip: false})
                            .then(data => {
                                if (data) {
                                    let gen;
                                    if (data.gender === 1) {
                                        gen = '女';
                                    } else {
                                        gen = '男';
                                    }
                                    setFieldsValue({
                                        birthDate: data.birthDate,
                                        gender: gen,
                                    });
                                }
                            });
                    })
                    .catch(err => {
                        return callback(err);
                    });
            },
        };
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
                                >
                                    {getFieldDecorator('userProperty', {
                                        initialValue: user.userProperty,
                                        rules: [
                                            {
                                                required: true, message: '请输入人员属性!',
                                            },
                                        ],
                                    })(
                                        <Select>
                                            <Option value="1">外部人员</Option>
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
                    <Card title="角色设置" style={cardStyle}>
                        <Spin spinning={gettingRoles}>
                            <Tabs type="card" activeKey={activeSystemTabKey} onTabClick={this.handleSystemTabClick}>
                                {this.renderDetailTabPanes()}
                            </Tabs>
                        </Spin>
                    </Card>
                    <Card title="基本信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号"
                                >
                                    {getFieldDecorator('idCardNo', {
                                        validateTrigger: 'onBlur',
                                        initialValue: user.idCardNo,
                                        rules: [
                                            {
                                                required: true, message: '请输入身份证号!',
                                            },
                                            ValidationRule.idCardNo('请输入身份证号!'),
                                            this.idCardNumToBithAndSex(),
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="身份证姓名"
                                >
                                    {getFieldDecorator('idCardName', {
                                        initialValue: user.idCardName,
                                        rules: [
                                            {
                                                required: true, message: '请输入身份证姓名!',
                                            },
                                        ],
                                    })(
                                        <Input onBlur={this.generateRemarkName}/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="备注名"
                                >
                                    {getFieldDecorator('remarkName', {
                                        initialValue: user.remarkName,
                                        rules: [
                                            {
                                                required: false, message: '请输入备注名!',
                                            },
                                        ],
                                    })(
                                        <Input disabled/>
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
                                                required: false, message: '请输入性别!',
                                            },
                                        ],
                                    })(
                                        <Input disabled/>
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
                                        <Input disabled/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
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

                                <FormItem
                                    {...formItemLayout}
                                    label="座机"
                                >
                                    {getFieldDecorator('telphone', {
                                        initialValue: user.telphone,
                                        rules: [
                                            {
                                                required: false, message: '请输入座机号!',
                                            },
                                            ValidationRule.landline('请输入座机号'),
                                        ],
                                    })(
                                        <Input/>
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
                                                required: false, message: '请输入邮箱!',
                                            },
                                            ValidationRule.email('请输入邮箱'),
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="QQ号"
                                >
                                    {getFieldDecorator('qq', {
                                        initialValue: user.qq,
                                        rules: [
                                            {
                                                required: false, message: '请输入QQ号!',
                                            },
                                            ValidationRule.qq('请输入QQ号！'),
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="微信"
                                >
                                    {getFieldDecorator('wechat', {
                                        initialValue: user.wechat,
                                        rules: [
                                            {
                                                required: false, message: '请输入微信!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="业务信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="银行账户名称"
                                >
                                    {getFieldDecorator('accountName', {
                                        initialValue: user.accountName,
                                        rules: [
                                            {
                                                required: false, message: '请输入银行账户名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="直属机构/所属名称"
                                    style={{display: 'none'}}
                                >
                                    {getFieldDecorator('orgName', {
                                        initialValue: user.orgName,
                                        rules: [
                                            {
                                                required: false, message: '请输入直属机构/所属名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="所属机构"
                                >
                                    {getFieldDecorator('orgNo', {
                                        initialValue: user.orgNo,
                                        rules: [
                                            {
                                                required: false, message: '请选择用户所属机构!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="机构管理者"
                                >
                                    {getFieldDecorator('isCreatePerson', {
                                        initialValue: user.isCreatePerson,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择机构管理者!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="开户行名称"
                                >
                                    {getFieldDecorator('openbankName', {
                                        initialValue: user.openbankName,
                                        rules: [
                                            {
                                                required: false, message: '请输入开户行名称!',
                                            },
                                        ],
                                    })(
                                        <Select>
                                            <Option value="1">1</Option>
                                            <Option value="0">0</Option>
                                        </Select>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="联行行号"
                                >
                                    {getFieldDecorator('cnapsCode', {
                                        initialValue: user.cnapsCode,
                                        rules: [
                                            {
                                                required: false, message: '请输入联行行号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="结算账号"
                                >
                                    {getFieldDecorator('settleAccount', {
                                        initialValue: user.settleAccount,
                                        rules: [
                                            {
                                                required: false, message: '请输入结算账号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>
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
