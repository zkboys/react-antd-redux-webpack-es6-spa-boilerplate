import React, {Component} from 'react';
import {Form, Input, Button, Select} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    PageContent,
} from 'zk-react/antd';
import './style.less';


export const PAGE_ROUTE = '/base-information/whiteList/+add/:whiteListId';

const FormItem = Form.Item;
const Option = Select.Option;

class AdminAdd extends Component {
    state = {
        whiteListId: null,
        whiteList: {},
        title: '添加白名单',
        systems: [],
        isEdit: false,
        systemId: {},
    }

    componentWillMount() {
        const {params: {whiteListId}} = this.props;
        if (whiteListId !== ':whiteListId') {
            this.setState({
                title: '修改白名单',
                whiteListId,
                isEdit: true,
            });
            promiseAjax.get(`/whiteList/${whiteListId}`).then(data => {
                this.setState({
                    whiteList: data,
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
                values.systemId = values.systems;
                const {whiteListId} = this.state;
                const {router} = this.props;
                if (whiteListId) {
                    promiseAjax.put(`/whiteList/${whiteListId}`, values, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/whiteList/save', values, {successTip: '添加成功'}).then(() => {
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
        const {whiteList, whiteListId, title, isEdit} = this.state;
        let ignoreValues = [];
        if (isEdit) {
            ignoreValues.push(whiteList.authority);
        }
        let systemOptionValues = [];
        if (whiteList.systemId && whiteList.systemId.length) {
            systemOptionValues = whiteList.systemId;
        }
        return (
            <PageContent className="base-business-whiteList-add">
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ?
                        <FormItem
                            {...formItemLayout}
                            label=""
                        >
                            {getFieldDecorator('id', {
                                initialValue: whiteListId,
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        :
                        null
                    }
                    <FormItem
                        {...formItemLayout}
                        label="权限"
                    >
                        {getFieldDecorator('authority', {
                            initialValue: whiteList.authority,
                            validateTrigger: 'onBlur',
                            rules: [
                                {
                                    required: true, message: '请输入权限!',
                                },
                            ],
                        })(
                            <Input placeholder="请输入权限" disabled={isEdit}/>
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
                                disabled={isEdit}
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
                            initialValue: whiteList.remark,
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
