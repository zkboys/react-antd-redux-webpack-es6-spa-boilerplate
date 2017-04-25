import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Input} from 'antd';
import {InputCloseSuffix, FontIcon} from 'zk-react/antd';

const FormItem = Form.Item;

class FormComponent extends Component {
    static defaultProps = {
        layout: 'inline',
        items: [],
        onSubmit: () => {
        },
    }
    static propTypes = {
        onSubmit: PropTypes.func,
        items: PropTypes.array,
        layout: PropTypes.string,
    };
    state = {}
    inputs = {}
    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit} = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
            }
        });
    }

    getPlaceholder(item) {
        const {type = 'input', label, placeholder} = item;
        if (placeholder) return placeholder;

        if (type === 'input') {
            return `请输入${label}!`;
        }
    }

    getFormItemLayout(/* item */) {
        return {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
    }

    getFormItem(item) {
        const {form, layout} = this.props;
        const {getFieldDecorator} = form;
        const {label, field, decorator = {}} = item;
        const formItemLayout = this.getFormItemLayout(item);
        let itemStyle = {};

        if (layout === 'inline') {
            itemStyle = {
                marginBottom: 16,
            };
        }

        return (
            <FormItem
                style={itemStyle}
                {...formItemLayout}
                label={label}>
                {getFieldDecorator(field, decorator)(this.getFormElement(item))}
            </FormItem>
        );
    }

    getFormElement(item) {
        const {form} = this.props;
        const {type = 'input', field} = item;
        if (type === 'input') {
            return (
                <Input
                    ref={node => this.inputs[field] = node}
                    placeholder={this.getPlaceholder(item)}
                    suffix={<InputCloseSuffix form={form} field={field} dom={this.inputs[field]}/>}
                />
            );
        }
    }

    render() {
        const {items, layout} = this.props;
        return (
            <Form onSubmit={this.handleSubmit} layout={layout}>
                {
                    items.map(data => {
                        return data.map(item => {
                            return this.getFormItem(item);
                        });
                    })
                }

                <Button type="primary" size="large" htmlType="submit">查询<FontIcon type="search"/></Button>
            </Form>
        );
    }
}
export default Form.create()(FormComponent);
