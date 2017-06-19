/*
 * form相关封装的一些基础方法，EditCell、QueryItem、FormPage等组件可能用到
 * */
import React from 'react';
import {InputClear, FormItemLayout} from 'zk-tookit/antd';
import {InputNumber, Input, Select, Checkbox, Radio} from 'antd';

// input number textarea password mobile email select select-tree checkbox radio switch data time data-time cascader
/*
 * item 大多是 FormItemLayout 所需参数 及 表单元素所需参数
 type: 'input',
 field: 'loginName',
 label: '登录名',
 labelSpaceCount: 3,
 width: '25%',
 placeholder: '请输入登录名',
 decorator: {
 rules: [
 {required: false, message: '请输入用户名'},
 ],
 },
 elementProps: {} 元素的一些props，具体参考antd
 *
 * */
function isInputLikeElement(type) {
    return ['input', 'textarea', 'password', 'mobile', 'email'].includes(type);
}

export function getPlaceholder(item) {
    const {type = 'input', label, placeholder, elementProps = {}} = item;
    if (elementProps.placeholder) return elementProps.placeholder;
    if (placeholder) return placeholder;
    if (isInputLikeElement(type)) {
        return `请输入${label}!`;
    }

    return `请选择${label}!`;
}

export function getFormElement(item, form) {
    const {type = 'input', elementProps = {}} = item;
    elementProps.placeholder = getPlaceholder(item);
    /*
     input number textarea password mobile email select select-tree checkbox checkbox-group radio radio-group
     TODO: switch data time data-time cascader
     * */
    if (isInputLikeElement(type)) {
        if (type === 'input') return <InputClear {...elementProps} form={form}/>;
        return <Input {...elementProps}/>;
    }

    if (type === 'number') return <InputNumber {...elementProps}/>;

    if (type === 'select') {
        const Option = Select.Option;
        const {options = []} = elementProps;
        return (
            <Select {...elementProps}>
                {
                    options.map(opt => <Option key={opt.value} {...opt}>{opt.title}</Option>)
                }
            </Select>
        );
    }

    if (type === 'checkbox') return <Checkbox {...elementProps}>{elementProps.title}</Checkbox>;

    if (type === 'checkbox-group') return <Checkbox.Group {...elementProps}/>;

    if (type === 'radio') return <Radio {...elementProps}>{elementProps.title}</Radio>;

    if (type === 'radio-group') return <Radio.Group {...elementProps}/>;

    // TODO 其他类型，碰到需求的时候，再补充
}

export function getFormItem(item, form) {
    const {getFieldDecorator} = form;
    const {field, decorator} = item;
    return (
        <FormItemLayout key={item.field} float {...item}>
            {getFieldDecorator(field, decorator)(getFormElement(item, form))}
        </FormItemLayout>
    );
}
