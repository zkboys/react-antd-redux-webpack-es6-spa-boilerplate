import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Input} from 'antd';
import {InputCloseSuffix, FontIcon} from 'zk-react/antd';

const FormItem = Form.Item;

class FormComponent extends Component {
    static defaultProps = {
        onSubmit: () => {
        },
    }
    static propTypes = {
        onSubmit: PropTypes.func,
    };
    state = {}
    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit} = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
            }
        });
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        return (
            <Form onSubmit={this.handleSubmit} layout="inline">
                <FormItem
                    style={{marginBottom: 16}}
                    {...formItemLayout}
                    label="登录名">
                    {getFieldDecorator('loginName')(
                        <Input
                            ref={node => this.lni = node}
                            placeholder="请输入登录账号"
                            suffix={<InputCloseSuffix form={form} field="loginName" dom={this.lni}/>}
                        />
                    )}
                </FormItem>
                <Button type="primary" size="large" htmlType="submit">查询<FontIcon type="search"/></Button>
            </Form>
        );
    }
}
export default Form.create()(FormComponent);
