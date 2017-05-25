import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Row, Col} from 'antd';
import {FontIcon, InputClear, FormItemLayout} from 'zk-react/antd';

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

    getFormItem(item, count) {
        const {form, layout} = this.props;
        const {getFieldDecorator} = form;
        const {
            label,
            labelWidth,
            labelSpaceCount,
            labelFontSize,
            field,
            decorator = {},
        } = item;
        let itemStyle = {};

        if (layout === 'inline') {
            itemStyle = {
                marginBottom: 16,
            };
        }

        return (
            <Col span={24 / count}>
                <FormItemLayout
                    labelWidth={labelWidth}
                    labelSpaceCount={labelSpaceCount}
                    labelFontSize={labelFontSize}
                    style={itemStyle}
                    label={label}>
                    {getFieldDecorator(field, decorator)(this.getFormElement(item))}
                </FormItemLayout>
            </Col>
        );
    }

    getFormElement(item) {
        const {form} = this.props;
        const {type = 'input', field} = item;
        if (type === 'input') {
            return (
                <InputClear
                    form={form}
                    ref={node => this.inputs[field] = node}
                    placeholder={this.getPlaceholder(item)}
                />
            );
        }
    }

    render() {
        const {items} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    {
                        items.map(data => {
                            return data.map(item => {
                                return this.getFormItem(item, data.length);
                            });
                        })
                    }
                    <Col span={5}>
                        <Button type="primary" size="large" htmlType="submit">查询<FontIcon type="search"/></Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create()(FormComponent);
