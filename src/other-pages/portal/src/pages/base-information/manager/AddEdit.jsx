import React, {Component} from 'react';
import {Form, Input, Button, Switch, Select} from 'antd';
import {PageContent} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import './style.less';
import ValidationRule from '../../../commons/validation-rule';


export const PAGE_ROUTE = '/base-information/manager/+add/:adminId';

const FormItem = Form.Item;
const Option = Select.Option;

class AdminAdd extends Component {
    state = {
        adminId: null,
        admin: {},
        title: '添加管理人员',
        systems: [],
        isEdit: false,
    }

    componentWillMount() {
        const {params: {adminId}} = this.props;
        if (adminId !== ':adminId') {
            this.setState({
                title: '修改管理人员',
                adminId,
                isEdit: true,
            });
            promiseAjax.get(`/admins/${adminId}`).then(data => {
                this.setState({
                    admin: data,
                });
            });
        }
        promiseAjax.get('/systems', {pageSize: 99999}).then(data => {
            if (data && data.list && data.list.length) {
                this.setState({
                    systems: data.list,
                });
            }
        });
    }

    // PORTAL
    renderSystemOptions = () => {
        return this.state.systems.filter(sys => sys.code !== 'PORTAL').map(sys => <Option key={sys.id}>{sys.name}</Option>);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.status = values.status ? '1' : '0';
                values.systems = values.systems.map(sysId => ({id: sysId}));
                values.adminAdminCode = values.loginName;
                const {adminId} = this.state;
                const {router} = this.props;
                if (adminId) {
                    promiseAjax.put(`/admins/${adminId}`, values, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/admins', values, {successTip: '添加成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                }
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
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
        const {admin, adminId, title, isEdit} = this.state;
        let ignoreValues = [];
        if (isEdit) {
            ignoreValues.push(admin.loginName);
        }
        let systemOptionValues = [];
        if (admin.systems && admin.systems.length) {
            systemOptionValues = admin.systems.map(sys => sys.id);
        }
        return (
            <PageContent className="base-business-admin-add">
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ?
                        <FormItem
                            {...formItemLayout}
                            label=""
                        >
                            {getFieldDecorator('id', {
                                initialValue: adminId,
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        :
                        null
                    }
                    <FormItem
                        {...formItemLayout}
                        label="登录名称"
                    >
                        {getFieldDecorator('loginName', {
                            initialValue: admin.loginName,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true, message: '请输入登录名称!',
                                },
                                ValidationRule.checkAdminLoginName(ignoreValues),
                            ],
                        })(
                            <Input placeholder="请输入登录名" disabled={isEdit}/>
                        )}
                    </FormItem>
                    {this.state.adminId !== null ?
                        null
                        :
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            {getFieldDecorator('password', {
                                initialValue: admin.password,
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
                        label="账号是否可用"
                    >
                        {getFieldDecorator('status', {
                            initialValue: admin.status === undefined ? true : admin.status,
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
                        label="系统"
                    >
                        {getFieldDecorator('systems', {
                            initialValue: systemOptionValues,
                            rules: [
                                {
                                    required: true, message: '请选择系统!',
                                },
                            ],
                        })(
                            <Select
                                mode="multiple"
                                style={{width: '100%'}}
                                placeholder="请选择系统"
                                notFoundContent="暂无数据"
                            >
                                {this.renderSystemOptions()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            initialValue: admin.remark,
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
            </PageContent>
        );
    }
}

export default Form.create()(AdminAdd);
