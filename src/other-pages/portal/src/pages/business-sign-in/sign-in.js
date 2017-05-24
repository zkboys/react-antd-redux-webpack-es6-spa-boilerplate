import {promiseAjax} from 'zk-react';
import {init as initStorage} from 'zk-react/utils/storage';
import {convertToTree} from 'zk-react/utils/tree-utils';
import './sign-in.css';
import {setCurrentLoginUser, setUserType, getAjaxBaseUrl, setMenuData, setMenuTreeData} from '../../commons/index';

let isFirstLogin = false;
const loginButton = document.getElementById('login-btn');
const resetPassButton = document.getElementById('reset-pass-btn');
const nameEle = document.getElementById('name');
const passEle = document.getElementById('pass');
const newPassEle = document.getElementById('new-pass');
const reNewPassEle = document.getElementById('re-new-pass');
const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const phoneCodeBtn = document.getElementById('phoneCode-btn');
const phoneCodeEle = document.getElementById('phoneCode');
const captchaCodeEle = document.getElementById('captchaCode');
const captchaImgEle = document.getElementById('captchaImg');
const captchaIdEle = document.getElementById('captchaId');
let _csrf = csrfMeta ? csrfMeta.getAttribute('content') : '';


promiseAjax.init({
    setOptions: (instance) => {
        instance.defaults.baseURL = getAjaxBaseUrl();
    },
});

function showLoading() {
    if (isFirstLogin) {
        const resetPassLoading = '确认中...';
        resetPassButton.innerHTML = resetPassLoading;
        resetPassButton.innerText = resetPassLoading;
    } else {
        const loginLoading = '登录中...';
        loginButton.innerHTML = loginLoading;
        loginButton.innerText = loginLoading;
    }
}

function hideLoading() {
    if (isFirstLogin) {
        const resetPassButtonText = '确认';
        resetPassButton.innerHTML = resetPassButtonText;
        resetPassButton.innerText = resetPassButtonText;
    } else {
        const loginButtonText = '登录';
        loginButton.innerHTML = loginButtonText;
        loginButton.innerText = loginButtonText;
    }
}

function showFirstLogin() {
    const firstLoginEle = document.getElementById('first-login-box');
    const loginEle = document.getElementById('login-box');
    loginEle.style.display = 'none';
    firstLoginEle.style.display = 'block';
    isFirstLogin = true;
}

function showError(error = '未知系统错误') {
    if (isFirstLogin) {
        const resetPassErrorEle = document.getElementById('reset-pass-error');
        resetPassErrorEle.innerHTML = error;
        resetPassErrorEle.innerText = error;// ie?
    } else {
        const loginErrorEle = document.getElementById('login-error');
        loginErrorEle.innerHTML = error;
        loginErrorEle.innerText = error;// ie?
    }
}

function clearError() {
    const loginErrorEle = document.getElementById('login-error');
    const resetPassErrorEle = document.getElementById('reset-pass-error');
    loginErrorEle.innerHTML = '';
    loginErrorEle.innerText = '';// ie?
    resetPassErrorEle.innerHTML = '';
    resetPassErrorEle.innerText = '';// ie?
}

/**
 * 点击发送手机短信验证码倒计时
 * @param time
 */
function timekeeping(time) {
    // 把按钮设置为不可以点击
    phoneCodeBtn.disabled = true;
    let interval = setInterval(() => {
        // 每秒读取一次cookie
        // 在发送按钮显示剩余倒计时
        phoneCodeBtn.innerText = `请等待${time}秒`;
        // 把剩余总倒计时减掉1
        time--;
        if (time === 0) {
            // 剩余倒计时为零，则显示 重新发送，可点击
            // 清除定时器
            clearInterval(interval);
            // 删除cookie
            time = null;
            // 显示重新发送
            phoneCodeBtn.innerText = '重新发送';
            // 把发送按钮设置为可点击
            phoneCodeBtn.disabled = false;
        }
    }, 1000);
}

/**
 * 发送手机短信验证码
 */
function handlePhoneCode() {
    // 校验手机号码
    const name = nameEle.value ? nameEle.value : '';
    if (name === '') {
        showError('手机号码不能为空');
        return;
    }
    const params = {
        loginName: name,
    };
    console.log('手机验证码');
    promiseAjax.get('/common/getUserPhoneCode', params, {errorTip: false})
        .then((res) => {
            console.log(res);
            timekeeping(60);
        })
        .catch((err) => {
            console.error(err);
            if (err && err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
            } else {
                showError();
            }
            hideLoading();
        });
}
/**
 * 界面加载时获取图片验证码
 */
setTimeout(() => {
    promiseAjax.get('/common/getCaptcha', {}, {errorTip: false})
        .then((res) => {
            captchaIdEle.value = res.captchaId;
            captchaImgEle.src = res.image;
        })
        .catch((err) => {
            console.error(err);
            if (err && err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
            } else {
                showError();
            }
            hideLoading();
        });
}, 300);
/**
 * 点击图片更换验证码
 */
function handleReplaceImg() {
    promiseAjax.get('/common/getCaptcha', {}, {errorTip: false})
        .then((res) => {
            captchaIdEle.value = res.captchaId;
            captchaImgEle.src = res.image;
        })
        .catch((err) => {
            console.error(err);
            if (err && err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
            } else {
                showError();
            }
            hideLoading();
        });
}

function handleResetPass() {
    clearError();
    const newPass = newPassEle.value;
    const reNewPass = reNewPassEle.value;
    if (!newPass) {
        showError('请输入新密码');
        return;
    }
    if (!reNewPass) {
        showError('请输入确认新密码');
        return;
    }
    if (newPass !== reNewPass) {
        showError('两次输入密码不一致');
        return;
    }
    const params = {
        _csrf,
        pass: newPass,
        rePass: reNewPass,
    };
    showLoading();
    promiseAjax.put('/first_login', params, {errorTip: false})
        .then((res) => {
            const refer = res.refer || '/';
            // const menus = res.menus || [];
            const currentLoginUser = res.user;
            currentLoginUser(currentLoginUser);
            // Storage.session.setItem('menus', menus);
            location.href = refer;
        })
        .catch((err) => {
            if (err && err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
            } else {
                showError();
            }
            hideLoading();
        });
}

function addHandler(element, type, handler) {
    if (!element) return;
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent(`on${type}`, handler);
    } else {
        element[`on${type}`] = handler;
    }
}

function handleLogin() {
    clearError();
    const name = nameEle.value;
    const pass = passEle.value;
    const phoneCode = phoneCodeEle.value;
    const captchaCode = captchaCodeEle.value;
    const captchaId = captchaIdEle.value;
    if (!name) {
        showError('请输入用户名');
        return;
    }
    if (!pass) {
        showError('请输入密码');
        return;
    }
    if (!captchaCode) {
        showError('请输入验证码');
        return;
    }
    if (!phoneCode) {
        showError('请输入手机验证码');
        return;
    }
    captchaId;
    const params = {
        _csrf,
        loginName: name,
        password: pass,
    };
    showLoading();
    promiseAjax.post(`/login/login?phoneCode=${phoneCode}&captchaCode=${captchaCode}&captchaId=${captchaId}`, params, {errorTip: false})
        .then((res) => {
            const currentLoginUser = {
                ...res,
                authToken: res.token,
                name: res.name || res.loginName || '匿名用户',
                loginName: res.loginName,
                userType: res.userType,
            };
            if (currentLoginUser.is_first_login) {
                hideLoading();
                showFirstLogin();
                return false;
            }
            initStorage({
                keyPrefix: currentLoginUser.id,
            });

            setCurrentLoginUser(currentLoginUser);
            setUserType(res.userType);

            promiseAjax.init({
                setOptions: (instance) => {
                    instance.defaults.baseURL = getAjaxBaseUrl();
                    instance.defaults.headers = {
                        'auth-token': currentLoginUser && currentLoginUser.authToken,
                    };
                },
            });
            promiseAjax.get('/home/getMenuList', null, {errorTip: false}).then(response => {
                setMenuData(response);

                const menuTreeData = convertToTree(response.filter(item => item.path));
                setMenuTreeData(menuTreeData);
                window.location.href = '/';
            });
        })
        .catch((err) => {
            console.error(err);
            if (err && err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
                handleReplaceImg();
            } else {
                showError();
                handleReplaceImg();
            }
            hideLoading();
        });
}

function handleKeyDown(e) {
    if (e.keyCode === 13) {
        if (isFirstLogin) {
            handleResetPass();
        } else {
            handleLogin();
        }
    }
}
addHandler(loginButton, 'click', handleLogin);
addHandler(resetPassButton, 'click', handleResetPass);
addHandler(nameEle, 'keydown', handleKeyDown);
addHandler(passEle, 'keydown', handleKeyDown);
addHandler(newPassEle, 'keydown', handleKeyDown);
addHandler(newPassEle, 'keydown', handleKeyDown);
addHandler(phoneCodeBtn, 'click', handlePhoneCode);
addHandler(captchaImgEle, 'click', handleReplaceImg);
