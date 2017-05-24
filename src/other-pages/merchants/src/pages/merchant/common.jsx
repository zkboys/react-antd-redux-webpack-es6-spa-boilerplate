import React from 'react';
import {Select} from 'antd';
import {getImageData, getImageSizeByBase64, compressImageToSize} from 'zk-react/utils/image-utils';

const Option = Select.Option;
export const IMAGE_SIZE = 300 * 1000;

export function getOpenBankList($ajax, keyword) {
    return $ajax.singleGet(`/billing/getOpenBankList/${keyword}`);
}

export function renderOpenBankList(bankList = []) {
    if (!Array.isArray(bankList)) return null;
    return bankList.map(item => <Option key={item.bankCode} title={item.bankName}>{item.bankName}</Option>);
}

export function validateImage() {
    return {
        validator: (rule, value, callback) => {
            if (typeof value === 'string' && value.startsWith('data:image')) {
                if (getImageSizeByBase64(value) > IMAGE_SIZE) {
                    return callback('图片大小不能超过300K');
                }
            }
            return callback();
        },
    };
}

export function handleImageChange(e, field, form, cb) {
    if (!e.file.type.startsWith('image')) return;
    const {setFieldsValue, validateFields} = form;
    getImageData(e.file).then(data => {
        console.log('压缩前大小：', e.file.size);
        compressImageToSize({
            data,
            type: e.file.type,
            size: IMAGE_SIZE,
        }).then(result => {
            console.log('压缩后大小：', getImageSizeByBase64(result));
            setFieldsValue({[field]: result});
            validateFields([field]); // 赋值之后，触发一次校验，否则赋值操作把错误提示去掉了
            cb({
                beforeSize: e.file.size,
                afterSize: getImageSizeByBase64(result),
            });
        });
    });
}

export function checkboxGroupCheckOne(value, form, field) {
    // 只选中一个，也可以都不选
    const {setFieldsValue} = form;
    let newValue = [];
    if (value && value.length) {
        newValue = [value[value.length - 1]];
    }
    setTimeout(() => {
        setFieldsValue({[field]: newValue});
    });
}

export const imageConfig = [
    {text: '营业执照', spell: 'yingyezhizhao', field: 'licensePicBase64Img', index: 1, required: true},
    {text: '税务登记证', spell: 'shuiwudengjizheng', field: 'taxRegistLicensePicBase64Img', index: 2, required: false},
    {text: '组织机构代码证', spell: 'zuzhijigoudaimazheng', field: 'orgCodePicBase64Img', index: 3, required: false},
    {text: '法人身份证正面', spell: 'farenshenfenzhengzhengmian', field: 'legalPersonidPositivePicBase64Img', index: 4, required: true},
    {text: '法人身份证反面', spell: 'farenshenfenzhengfanmian', field: 'legalPersonidOppositePicBase64Img', index: 5, required: true},
    {text: '结算人身份证正面', spell: 'jiesuanrenshenfenzhengzhengmian', field: 'settlePersonIdcardPositiveBase64Img', index: 6, required: true},
    {text: '结算人身份证反面', spell: 'jiesuanrenshenfenzhengfanmian', field: 'settlePersonIdcardOppositeBase64Img', index: 7, required: true},
    {text: '手持身份证', spell: 'shouchishenfenzheng', field: 'handIdcardPicBase64Img', index: 22, required: true},
    {text: '开户许可证', spell: 'kaihuxukezheng', field: 'openingAccountLicensePicBase64Img', index: 8, required: false},
    {text: '银行卡正面', spell: 'yinhangkazhegnmian', field: 'bankCardPositivePicBase64Img', index: 9, required: false},
    {text: '银行卡反面', spell: 'yinhangkafanmian', field: 'bankCardOppositePicBase64Img', index: 10, required: false},
    {text: '商户协议照片', spell: 'shanghuxieyizhaopian', field: 'merchantAgreementPicBase64Img', index: 11, required: true},
    {text: '门头照片', spell: 'mentouzhaopian', field: 'storePicBase64Img', index: 12, required: true},
    {text: '经营场所-含收银台', spell: 'jingyingchansuo-hanshouyintai', field: 'businessPlacePicBase64Img', index: 13, required: false},
    {text: '租赁协议一(封面)', spell: 'zulinxieyiyi(fengmian)', field: 'leaseAgreementOnePicBase64Img', index: 14, required: false},
    {text: '租赁协议二(面积、有效期页)', spell: 'zulinxieyier(mianji、youxiaoqiye)', field: 'leaseAgreementTwoPicBase64Img', index: 15, required: false},
    {text: '租赁协议三(签章页)', spell: 'zulinxieyisan(qianzhangye)', field: 'leaseAgreementThreePicBase64Img', index: 16, required: false},
    {text: '其他资料照片1', spell: 'qitaziliaozhaopian1', field: 'otherMaterialPictureOneBase64Img', index: 17, required: false},
    {text: '其他资料照片2', spell: 'qitaziliaozhaopian2', field: 'otherMaterialPictureTwoBase64Img', index: 18, required: false},
    {text: '其他资料照片3', spell: 'qitaziliaozhaopian3', field: 'otherMaterialPictureThreeBase64Img', index: 19, required: false},
    {text: '其他资料照片4', spell: 'qitaziliaozhaopian4', field: 'otherMaterialPictureFourBase64Img', index: 20, required: false},
    {text: '其他资料照片5', spell: 'qitaziliaozhaopian5', field: 'otherMaterialPictureFiveBase64Img', index: 21, required: false},
];

export function billingPrivateHasValue(data) {
    const fields = [
        'toPrivateAccountName',
        'toPrivateSettleAccountNo',
        'toPrivateCnapsCode',
    ];

    for (let f of fields) {
        if (data[f]) return true;
    }
    return false;
}


export function billingPrivateHasAllValue(data) {
    const fields = [
        'toPrivateAccountName',
        'toPrivateSettleAccountNo',
        'toPrivateCnapsCode',
    ];

    for (let f of fields) {
        if (!data[f]) return false;
    }
    return true;
}


export function billingPublicHasValue(data) {
    const fields = [
        'toPublicAccountName',
        'toPublicSettleAccountNo',
        'toPublicCnapsCode',
    ];

    for (let f of fields) {
        if (data[f]) return true;
    }
    return false;
}


export function billingPublicHasAllValue(data) {
    const fields = [
        'toPublicAccountName',
        'toPublicSettleAccountNo',
        'toPublicCnapsCode',
    ];

    for (let f of fields) {
        if (!data[f]) return false;
    }
    return true;
}

