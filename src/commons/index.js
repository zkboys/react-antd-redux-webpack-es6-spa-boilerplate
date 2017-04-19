export function getCurrentLoginUser() {
    // TODO
    return {
        name: '张三',
        authToken: 123,
    };
}
export function toLogin() {
    return window.location.href = '/login';
}
