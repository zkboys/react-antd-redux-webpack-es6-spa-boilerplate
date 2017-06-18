/*
 * form相关封装的一些基础方法，EditCell、QueryItem、FormPage等组件可能用到
 * */
import React from 'react';
import {InputClear, FormItemLayout} from 'zk-tookit/antd';

// input number textarea password mobile email select select-tree checkbox radio switch data time data-time cascader
/*
 * item 大多是 FormItemLayout 所需参数
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
 *
 * */
export function getPlaceholder(item) {
    const {type = 'input', label, placeholder} = item;
    if (placeholder) return placeholder;
    const inputLikeElements = ['number', 'textarea', 'password', 'mobile', 'email'];
    if (inputLikeElements.includes(type)) {
        return `请输入${label}!`;
    }

    return `请选择${label}!`;
}

export function getFormElement(item, form) {
    const {type = 'input'} = item;
    const placeholder = getPlaceholder(item);

    if (type === 'input') return <InputClear form={form} placeholder={placeholder}/>;

    // TODO 其他类型
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
