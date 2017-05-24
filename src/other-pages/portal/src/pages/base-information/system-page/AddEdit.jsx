import React, {Component} from 'react';
import {Form, Input, Button, Switch, Row, Col} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    PageContent,
    FontIconModal,
} from 'zk-react/antd';
import './style.less';
import ValidationRule from '../../../commons/validation-rule';

export const PAGE_ROUTE = '/base-information/system_page/+add/:systemId';

const FormItem = Form.Item;

class SystemAdd extends Component {
    state = {
        systemId: null,
        isEdit: false,
        system: {},
        title: '添加系统',
        isFreshRedis: false,
    }

    componentWillMount() {
        const {params: {systemId}} = this.props;
        if (systemId !== ':systemId') {
            this.setState({
                title: '修改系统',
                systemId,
                isEdit: true,
            });
            promiseAjax.get(`/systems/${systemId}`).then(data => {
                this.setState({
                    system: data,
                });
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.status = values.status ? '1' : '0';
                const {systemId} = this.state;
                const {router} = this.props;
                const {isFreshRedis} = this.state;
                if (systemId) {
                    promiseAjax.put(`/systems/${systemId}?isFreshRedis=${isFreshRedis}`, values, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/systems', values, {successTip: '添加成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                }
            }
        });
    }
    handleStatusChange = () => {
        this.setState({isFreshRedis: true});
    }
    render() {
        const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
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
        const {system, systemId, title, isEdit} = this.state;
        const ignoreValues = [];
        if (systemId) {
            ignoreValues.push(system.code);
        }
        return (
            <PageContent className="base-business-system-add">
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ?
                        <FormItem
                            {...formItemLayout}
                            label=""
                        >
                            {getFieldDecorator('id', {
                                initialValue: systemId,
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        :
                        null
                    }
                    <FormItem
                        {...formItemLayout}
                        label="系统编码"
                    >
                        {getFieldDecorator('code', {
                            initialValue: system.code,
                            rules: [
                                {
                                    required: true, message: '请输入系统编码!',
                                },
                                ValidationRule.checkSystemCode(ignoreValues),
                            ],
                        })(
                            <Input placeholder="请输入系统编码" disabled={isEdit}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="系统名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: system.name,
                            rules: [
                                {
                                    required: true, message: '请输入系统名称!',
                                },
                                {
                                    max: 10, message: '系统名称不能超过10个字！',
                                },
                            ],
                        })(
                            <Input placeholder="请输入系统名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="系统是否可用"
                    >
                        {getFieldDecorator('status', {
                            initialValue: system.status === undefined ? true : system.status === 1,
                            valuePropName: 'checked',
                            onChange: this.handleStatusChange,
                        })(
                            <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="系统url"
                    >
                        {getFieldDecorator('url', {
                            initialValue: system.url,
                            rules: [
                                {
                                    required: false, message: '请输入系统url!',
                                },
                            ],
                        })(
                            <Input placeholder="请输入http开头的完整url"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="系统路径"
                    >
                        {getFieldDecorator('path', {
                            initialValue: system.path,
                            rules: [
                                {
                                    required: true, message: '请输入系统路径!',
                                },
                            ],
                        })(
                            <Input placeholder="请输入系统路径"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="排序"
                    >
                        {getFieldDecorator('sort', {
                            initialValue: system.sort,
                            rules: [
                                {
                                    required: true, message: '请输入排序!',
                                },
                                ValidationRule.number('排序必须是正整数!'),
                            ],
                        })(
                            <Input placeholder="请输入排序"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="图标"
                    >
                        <Row>
                            <Col span={12}>
                                {getFieldDecorator('icon', {
                                    initialValue: system.icon,
                                    rules: [],
                                })(
                                    <Input placeholder="请输入图标" size="large"/>
                                )}
                            </Col>
                            <Col span={12}>
                                <FontIconModal value={getFieldValue('icon')} onSelect={type => setFieldsValue({icon: type})}/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            initialValue: system.remark,
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

export default Form.create()(SystemAdd);
