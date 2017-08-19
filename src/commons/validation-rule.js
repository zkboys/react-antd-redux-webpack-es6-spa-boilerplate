import * as promiseAjax from 'zk-tookit/utils/promise-ajax';
import validationRule, {remoteCheck} from 'zk-tookit/utils/validation-rule';


// 这些remote函数必须写到校验对象外面，否则 节流失效
const remoteCheckExistLoginName = remoteCheck(({value, callback, message}) => {
    return promiseAjax
        .singleGet('/v1/sys/user/username', {username: value}, {errorTip: false})
        .then(res => {
            (res.user.userId === '0') ? callback() : callback(message);
        });
});

export default {
    ...validationRule,
    checkExistLoginName(ignoreValues = [], message = '登录名已经被占用！') {
        return {
            validator(rule, value, callback) {
                if (!value) return callback();
                remoteCheckExistLoginName({rule, value, callback, ignoreValues, message});
            },
        };
    },
};
