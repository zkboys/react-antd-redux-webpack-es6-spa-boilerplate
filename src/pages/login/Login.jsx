import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Icon, Button} from 'antd';
import {setCurrentLoginUser} from '../../commons';
import service from '../../services/service-hoc';
import './style.less';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

if (process.env.NODE_ENV === 'development') {
    require('../../mock/index');

    console.log('current mode is debug, mock is started');
}

@Form.create()
@service()
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
                const {userName, password} = values;

                this.setState({loading: true, errorMessage: ''});

                this.props.$service.systemService
                    .login({userName, password}, {errorTip: false})
                    .then(res => {
                        const currentLoginUser = {
                            id: res.id,
                            name: res.name,
                            loginName: res.loginName,
                            avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503905795&di=5ce1df5955d014e0c537b4459ea50136&imgtype=jpg&er=1&src=http%3A%2F%2Fimg1.touxiang.cn%2Fuploads%2F20120822%2F22-063649_260.jpg',
                        };
                        setCurrentLoginUser(currentLoginUser);
                        window.location.href = '/';
                    })
                    .catch(error => {
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
            <div styleName="root">
                <div styleName="box">
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
                    <div style={{textAlign: 'center', color: 'red'}}>用户名/密码：test/111111</div>
                    <div styleName="error-message">
                        {errorMessage}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('main'));
