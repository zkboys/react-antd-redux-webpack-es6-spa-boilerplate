import {promiseAjax} from 'zk-react';
import {getStringByteLength, stringFormat} from 'zk-react/utils';
import {debounce} from 'lodash/function';
import queryString from 'query-string';

const search = queryString.parse(window.location.search) || {};
const orgNo = search.orgNo;

/**
 * currying function 简化异步校验封装，进行节流，提高性能
 * @param ajax
 * @returns {*}
 */
function remoteCheck(ajax) {
    // 节流
    return debounce((options) => { // options = {rule, value, callback, ignoreValues, [自定义字段]}
        let {value, callback, ignoreValues = []} = options; // ignoreValues 忽略的values，不进行检测，常用与修改的情况
        if (!ignoreValues) ignoreValues = []; // 有可能是 null情况

        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }

        if (!value || ignoreValues.indexOf(value) > -1) {
            return callback();
        }

        ajax(options)
            .catch(err => {
                if (typeof err === 'string') {
                    return callback(err);
                }
                callback((err && err.response && err.response.data && err.response.data.message) || '未知系统错误');
            });
    }, 300);
}

// 这些remote函数必须写到校验对象外面，否则 节流失效
const remoteCheckRegName = remoteCheck(({value, callback, merchType, message}) => {
    return promiseAjax
        .singleGet(`/binfo/isExistRegName/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

const remoteCheckRegNumber = remoteCheck(({value, callback, merchType, message}) => {
    return promiseAjax
        .singleGet(`/binfo/isExistRegNumber/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

const remoteCheckSettlementPerson = remoteCheck(options => {
    const {value, callback, merchType, message} = options;
    return promiseAjax
        .singleGet(`/binfo/isExistSettlementPerson/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

// 多个ajax之间有干扰，先这么写，避免干扰
const remoteSettlementPerson = remoteCheck(options => {
    const {value, callback, merchType} = options;
    return promiseAjax
        .singleGet(`/binfo/isExistSettlementPerson/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            if ((res === 0 || res === false)) {
                return Promise.reject('结算人身份证号的重复次数超出系统限制，请联系相关人员！');
            }
            return promiseAjax
                .singleGet(`/binfo/isBlackListBySpid/${value}`, {}, {errorTip: false})
                .then(response => {
                    // {"retCode":"0000","opMsg":"结算人身份证号码在重点监控名单中!","bFlag":true,"gFlag":false}
                    if (response.bFlag === true) {
                        return Promise.reject('结算身份证号存在风险，禁止进件！');
                    }
                    return promiseAjax
                        .singleGet(`/binfo/isLegalAge/${value}`, {}, {errorTip: false})
                        .then(r => {
                            (r.successFlag === false) ? callback('结算人年龄不符合要求，请重新录入.') : callback();
                        });
                });
        });
});

const remoteCheckBlackList = remoteCheck((options) => {
    const {value, callback, message} = options;
    return promiseAjax
        .singleGet(`/binfo/isBlackListBySpid/${value}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

const remoteCheckLegalAge = remoteCheck(({value, callback, message}) => {
    return promiseAjax
        .singleGet(`/binfo/isLegalAge/${value}`, {}, {errorTip: false})
        .then(res => {
            (res.successFlag === false) ? callback(message) : callback();
        });
});

const remoteCheckBillingAccountName = remoteCheck(({value, callback, merchType, message}) => {
    return promiseAjax
        .singleGet(`/billing/isExistAccountName/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

const remoteCheckBillingAccountID = remoteCheck(({value, callback, merchType, message}) => {
    return promiseAjax
        .singleGet(`/billing/isExistAccountID/${value}/${merchType}/${orgNo}`, {}, {errorTip: false})
        .then(res => {
            (res === 0 || res === false) ? callback(message) : callback();
        });
});

// GET /func/getLimitJiRiFu

const remoteCheckLimitJiRiFu = remoteCheck(({value, callback, message}) => {
    return promiseAjax
        .singleGet('/func/getLimitJiRiFu', {}, {errorTip: false})
        .then(res => {
            const min = res.MIN_RATE;
            const max = res.MAX_RATE;
            (value < min || value > max) ? callback(stringFormat(message, {min, max})) : callback();
        });
});

export default {
    noSpace(message = '不能含有空格！') {
        return {
            validator: (rule, value, callback) => {
                if (/\s/g.test(value)) return callback(message);
                return callback();
            },
        };
    },

    mobile(message = '请输入正确的手机号！') { // 手机号
        return {
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message,
        };
    },

    landline(message = '请输入正确的座机号！') { // 座机
        return {
            pattern: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
            message,
        };
    },

    qq(message = '请输入正确的qq号！') { // qq号
        return {
            pattern: /^[1-9][0-9]{4,9}$/,
            message,
        };
    },

    cardNumber(message = '请输入正确的身份证号！') { // 身份证号十五位十八位最后X的校验
        return {
            pattern: /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/,
            message,
        };
    },

    email(message = '请输入正确的邮箱！') {
        return {
            type: 'email',
            message,
        };
    },

    number(message = '请输入数字.') { // 纯数字，不包括 + -
        return {
            pattern: /[0-9]+$/,
            message,
        };
    },
    integer(message = '请输入整数！') { // 整数
        return {
            pattern: /^[-]{0,1}[0-9]{1,}$/,
            message,
        };
    },
    positiveInteger(message = '请输入正整数！') { // 正整数
        return {
            pattern: /^[0-9]+$/,
            message,
        };
    },
    numberWithTwoDecimal(message = '请输入数字，保存两位小数.') {
        return {
            pattern: /^\d+(\.\d)?(\d)?$/,
            message,
        };
    },
    numberRange(min, max, message = '请输入{min}到{max}之间的值.') {
        return {
            validator(rule, value, callback) {
                if (!Number(value)) return callback();
                value = Number(value);
                console.log(123, value);
                (value < min || value > max) ? callback(stringFormat(message, {min, max})) : callback();
            },
        };
    },
    numberMaxRange(max, message = '不能大于{max}') {
        return {
            validator(rule, value, callback) {
                if (!Number(value)) return callback();
                value = Number(value);
                value > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },
    numberMinRange(min, message = '不能小于{min}') {
        return {
            validator(rule, value, callback) {
                if (!Number(value)) return callback();
                value = Number(value);
                value < min ? callback(stringFormat(message, {min})) : callback();
            },
        };
    },

    stringByteRangeLength(min, max, message = '请输入 {min}-{max} 个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                (length < min || length > max) ? callback(stringFormat(message, {min, max})) : callback();
            },
        };
    },
    stringByteMinLength(min, message = '最少输入{min}个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                length < min ? callback(stringFormat(message, {min})) : callback();
            },
        };
    },
    stringByteMaxLength(max, message = '最多输入{max}个字符(汉字算2个字符).') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                let length = getStringByteLength(value);
                length > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },

    arrayMaxLength(max, message = '最多{max}值') {
        return {
            validator(rule, value, callback) {
                if (!value || !Array.isArray(value)) return callback();
                let length = value.length;
                length > max ? callback(stringFormat(message, {max})) : callback();
            },
        };
    },

    checkExistRegName(ignoreValues = [], merchType = '0', message = '注册名称的重复次数超出系统限制，请联系相关人员！') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckRegName({rule, value, callback, ignoreValues, merchType, message});
            },
        };
    },

    checkExitRegNumber(ignoreValues = [], merchType = '0', message = '注册登记号的重复次数超出系统限制，请联系相关人员！') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckRegNumber({rule, value, callback, ignoreValues, merchType, message});
            },
        };
    },

    checkExitSettlementPerson(ignoreValues = [], merchType = '0', message = '结算人身份证号的重复次数超出系统限制，请联系相关人员！') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckSettlementPerson({rule, value, callback, ignoreValues, merchType, message});
            },
        };
    },
    // 结算人身份证号验证，涉及了三个异步校验
    checkSettlementPerson(ignoreValues = [], merchType = '0') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteSettlementPerson({rule, value, callback, ignoreValues, merchType});
            },
        };
    },

    checkBlackList(message = '结算身份证号存在风险，禁止进件！') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckBlackList({rule, value, callback, message});
            },
        };
    },

    checkLegalAge(message = '结算人年龄不符合要求，请重新录入.') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckLegalAge({rule, value, callback, message});
            },
        };
    },

    checkExitBillingAccountName(ignoreValues = [], merchType = '0', message) {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckBillingAccountName({rule, value, callback, ignoreValues, merchType, message});
            },
        };
    },

    checkExitBillingAccountID(ignoreValues = [], merchType = '0', message) {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckBillingAccountID({rule, value, callback, ignoreValues, merchType, message});
            },
        };
    },

    checkLimitJiRiFu(message = '即日付手续费,请填写{min}到{max}之间的值.') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckLimitJiRiFu({rule, value, callback, message});
            },
        };
    },

};
