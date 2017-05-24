import React, {Component} from 'react';
import {Form, Input, Button, Select} from 'antd';
import {PageContent} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import './style.less';

export const PAGE_ROUTE = '/base-information/dictionary-manager/+add/:vCode';

const FormItem = Form.Item;
const Option = Select.Option;

class authorityAdd extends Component {
    state = {
        vCode: null,
        authority: {},
        title: '添加权限组',
        systems: [],
        isEdit: false,
    }

    componentWillMount() {
        const {params: {vCode}} = this.props;
        if (vCode !== ':vCode') {
            this.setState({
                title: '修改权限组',
                vCode,
                isEdit: true,
            });
            promiseAjax.get('/authorityVirtual/findOneForUpdate', {virtualCode: vCode}).then(data => {
                console.log(data);
                this.setState({
                    authority: data,
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
        return this.state.systems.map(sys => <Option key={sys.id}>{sys.name}</Option>);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {authorityId} = this.state;
                const {router} = this.props;
                if (authorityId) {
                    promiseAjax.put(`/authoritys/${authorityId}`, values, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/authorityVirtual/add', values, {successTip: '添加成功'}).then(() => {
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
        const {authority, vCode, title, isEdit} = this.state;
        let ignoreValues = [];
        if (isEdit) {
            ignoreValues.push(authority.loginName);
        }
        let systemOptionValue = [];
        if (authority.system && authority.system) {
            systemOptionValue = authority.system.name;
        }
        return (
            <PageContent className="base-business-authority-add">
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ?
                        <FormItem
                            {...formItemLayout}
                            label=""
                        >
                            {getFieldDecorator('id', {
                                initialValue: vCode,
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        :
                        null
                    }
                    <FormItem
                        {...formItemLayout}
                        label="权限组编码"
                    >
                        {getFieldDecorator('virtualCode', {
                            initialValue: authority.virtualCode,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true, message: '请输入权限组编码!',
                                },
                            ],
                        })(
                            <Input placeholder="请输入权限组编码" disabled={isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="权限组描述"
                    >
                        {getFieldDecorator('virtualDescription', {
                            initialValue: authority.virtualDescription,
                            validateTrigger: 'onBlur',
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
                        label="系统"
                    >
                        {getFieldDecorator('systemId', {
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
                                disabled={isEdit}
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
                            initialValue: authority.remark,
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

export default Form.create()(authorityAdd);
