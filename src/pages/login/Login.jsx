import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Icon, Button} from 'antd';
import * as promiseAjax from 'zk-react/utils/promise-ajax';
import {init as initStorage} from 'zk-react/utils/storage';
import {convertToTree} from 'zk-react/utils/tree-utils';
import {setCurrentLoginUser, setMenuTreeData, isMock, getAjaxBaseUrl} from '../../commons';
import './style.less';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

if (process.env.NODE_ENV === 'development') {
    require('../../mock/index');

    console.log('current mode is debug, mock is started');
}

promiseAjax.init({
    setOptions: (instance) => {
        instance.defaults.baseURL = getAjaxBaseUrl();
    },
    isMock,
});

@Form.create()
class Login extends Component {
    state = {
        loading: false,
        errorMessage: '',
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.loading) {
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {userName, password} = values;
                this.setState({loading: true, errorMessage: ''});
                // TODO 修改url，考虑着两个请求是否可以合并为一个？
                promiseAjax.post('/mock/login', {userName, password}, {errorTip: false}).then(res => {
                    const currentLoginUser = {
                        id: res.id,
                        name: res.name,
                        loginName: res.loginName,
                    };
                    initStorage({
                        keyPrefix: currentLoginUser.id,
                    });
                    promiseAjax.get('/mock/system/menus', null, {errorTip: false}).then(response => {
                        const menuTreeData = convertToTree(response);
                        setMenuTreeData(menuTreeData);
                        setCurrentLoginUser(currentLoginUser);
                        window.location.href = '/';
                    }).finally(() => {
                        this.setState({loading: false});
                    });
                }).catch(error => {
                    console.log(error);
                    this.setState({loading: false, errorMessage: error.message});
                });
            }
        });
    }

    render() {
        const {loading, errorMessage} = this.state;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        // 账号/密码：test/111111
        return (
            <div className="login">
                <div className="login-box">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: '请输入用户名！'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                            )}
                        </FormItem>
                        <FormItem
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}
                        >
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码！'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password" placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem
                            style={{marginBottom: 8}}
                        >
                            <Button
                                style={{width: '100%'}}
                                loading={loading}
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    <div className="error-message">
                        {errorMessage}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('main'));
