import React, {Component, PropTypes} from 'react';
import {Form, Input, Button} from 'antd';
import {promiseAjax} from 'zk-react';
import {PageContent} from 'zk-react/antd';
import './style.less';
import {getCurrentLoginUser, getUserType} from '../../../commons/index';

const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}

export const PAGE_ROUTE = '/system/profile/pass';
export class Pass extends Component {
    static defaultProps = {
        loading: false,
    };

    static propTypes = {
        loading: PropTypes.bool,
    };

    componentWillMount() {
        const {actions} = this.props;
        actions.hidePageHeader();
        actions.hideSideBar();
    }

    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        const {loading, form} = this.props;

        if (loading) {
            return;
        }

        e.preventDefault();
        form.validateFields((errors, values) => {
            if (errors) {
                return false;
            }
            const {id} = getCurrentLoginUser();
            const userType = getUserType();
            if (userType === 0 || userType === 1) {
                promiseAjax.patch(`/common/updateAdminPassword/${id}`, values, {successTip: '修改成功'}).then(() => {
                    const {actions: {logout}} = this.props;
                    setTimeout(() => {
                        logout();
                    }, 1000);
                });
            } else if (userType === 2) {
                promiseAjax.patch(`/common/updateUserPassword/${id}`, values, {successTip: '修改成功'}).then(() => {
                    const {actions: {logout}} = this.props;
                    setTimeout(() => {
                        logout();
                    }, 1000);
                });
            }
        });
    }

    checkPass = (rule, value, callback) => {
        const {validateFields} = this.props.form;

        if (value) {
            validateFields(['rePass'], {force: true});
        }
        callback();
    }

    checkRePass = (rule, value, callback) => {
        const {getFieldValue} = this.props.form;

        if (value && value !== getFieldValue('password')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }

    render() {
        const {loading, form: {getFieldDecorator}} = this.props;
        const orPasswdDecorator = getFieldDecorator('oldPass', {
            rules: [
                {required: true, whitespace: true, message: '请填写原密码'},
            ],
        });
        const newPassDecorator = getFieldDecorator('password', {
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
                {validator: this.checkPass},
            ],
        });
        const newPassRepeatDecorator = getFieldDecorator('rePass', {
            rules: [
                {
                    required: true,
                    whitespace: true,
                    message: '请再次输入密码',
                },
                {
                    validator: this.checkRePass,
                },
            ],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };

        return (
            <PageContent className="system-profile-pass">
                <Form layout="horizontal" onSubmit={this.handleSubmit} onReset={this.handleReset}>
                    <FormItem
                        {...formItemLayout}
                        label="原密码："
                    >
                        {orPasswdDecorator(
                            <Input
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新密码："
                    >
                        {newPassDecorator(
                            <Input
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码："
                    >
                        {newPassRepeatDecorator(
                            <Input
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                            />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                        <Button type="primary" loading={loading} htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </PageContent>
        );
    }
}

export const LayoutComponent = createForm()(Pass);
export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
