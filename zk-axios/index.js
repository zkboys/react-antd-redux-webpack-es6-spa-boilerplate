/**
 * 基于[axios]{@link https://github.com/mzabriskie/axios}进行封装的ajax工具
 * @example
 * // 引入
 * import ZkAxios from 'path/to/promise-ajax';
 *
 * @example
 *
 * const zkAxios = new ZkAxios({ // 这里传入的是自定义配置
 *    onShowErrorTip: (response, successTip) => true, // 如何全局处理错误
 *    onShowSuccessTip: (err, errorTip) => true, // 如何全局处理成功
 *    isMock: (url, data, method, options) => true, // 如何判断请求是否是mock
 * });
 *
 * // axios默认配置通过如下方式进行配置：
 * zkAxios.defaults.timeout = 20000;
 * zkAxios.mockDefaults.timeout = 20000;
 *
 *
 * @example
 * // 发起get请求
 * this.setState({loading: true}); // 开始显示loading
 * const getAjax = zkAxios.get('/users', {pageNum: 1, pageSize: 10});
 * getAjax.then((data, res) => console.log(data, res))
 * .catch(err => console.log(err))
 * .finally(() => { // 如果要使用finally方法，需要对promise对象进行扩展
 *     this.setState({loading: false}); // 结束loading
 * });
 *
 * // 可以打断请求
 * // 注意：get，post等第一层返回的promise对象拥有cancel方法，以后then返回的promise对象没有cancel方法
 * getAjax.cancel();
 *
 * mockjs 使用单独的实例，可以与真实ajax请求实例区分开，
 * 用于正常请求和mock同时使用时，好区分；
 * 创建实例，通过isMock(url, data, method, options)函数，区分哪些请求需要mock，
 * 比如：url以约定'/mock'开头的请求，使用mock等方式。
 *
 * @example
 * // 配合mock使用
 * import MockAdapter from 'axios-mock-adapter';
 * import mockInstance from 'path/to/mockInstance';
 * const mock = new MockAdapter(mockInstance);
 * mock.onGet('/success').reply(200, {
 *     msg: 'success',
 * });
 *
 * @module ajax工具
 * */
import axios from 'axios';

export default class ZkAxios {
    /**
     * 构造函数传入的是自定义的一些配置，
     * axios相关的全局配置使用zkAxios实例进行配置：
     * zkAxios.defaults.xxx zkAxios.mockDefaults.xxx进行配置
     *
     * @param onShowErrorTip 如何显示错误提示
     * @param onShowSuccessTip 如何显示成功提示
     * @param isMock 区分哪些请求需要mock，比如：url以约定'/mock'开头的请求，使用mock等方式。
     */
    constructor({
        onShowSuccessTip = (/* response, successTip  */) => true,
        onShowErrorTip = (/* err, errorTip */) => true,
        isMock = (/* url, data, method, options */) => false,
    } = {}) {
        this.instance = axios.create();
        this.mockInstance = axios.create();
        this.setDefaultOption(this.instance);
        this.setDefaultOption(this.mockInstance);
        this.defaults = this.instance.defaults;
        this.mockDefaults = this.mockInstance.defaults;

        this.onShowSuccessTip = onShowSuccessTip;
        this.onShowErrorTip = onShowErrorTip;
        this.isMock = isMock;
    }

    setDefaultOption(instance) {
        instance.defaults.timeout = 10000;
        instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        instance.defaults.baseURL = '/';
        instance.defaults.withCredentials = true; // 跨域携带cookie
    }

    ajax(url, data, method = 'get', options = {}) {
        let {
            successTip = false,
            errorTip = method === 'get' ? '获取数据失败！' : '操作失败！',
        } = options;

        const CancelToken = axios.CancelToken;
        let cancel;

        // const isGet = method === 'get';
        const isMock = this.isMock(url, data, method, options);

        let instance = this.instance;

        /*
         * 封装内部做处理，如果需要，通过如下方式，或者其他方法自行处理
         * axiosInstance.interceptors.request.use(cfg => {
         *   // Do something before request is sent
         *   return cfg;
         * }, error => {
         *   // Do something with request error
         *   return Promise.reject(error);
         * });
         *
         * */

        // if (isGet && !isMock) {
        //     url = mosaicUrl(url, data);
        // }

        if (isMock) {
            instance = this.mockInstance;
        }

        const ajaxPromise = new Promise((resolve, reject) => {
            instance({
                method,
                url,
                data,
                cancelToken: new CancelToken(c => cancel = c),
                ...options,
            }).then(response => {
                this.onShowSuccessTip(response, successTip);
                resolve(response.data, response);
            }, err => {
                const isCanceled = err && err.message && err.message.canceled;
                if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数
                this.onShowErrorTip(err, errorTip);
                reject(err);
            }).catch(error => {
                reject(error);
            });
        });
        ajaxPromise.cancel = function () {
            cancel({
                canceled: true,
            });
        };
        return ajaxPromise;
    }

    /**
     * 发送一个get请求，一般用于查询操作
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据，正常请求会转换成query string 拼接到url后面
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    get(url, params, options) {
        return this.ajax(url, params, 'get', options);
    }

    /**
     * 发送一个post请求，一般用于添加操作
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    post(url, params, options) {
        return this.ajax(url, params, 'post', options);
    }


    /**
     * 发送一个put请求，一般用于更新操作
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    put(url, params, options) {
        return this.ajax(url, params, 'put', options);
    }

    /**
     * 发送一个patch请求，一般用于更新部分数据
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    patch(url, params, options) {
        return this.ajax(url, params, 'patch', options);
    }

    /**
     * 发送一个delete请求，一般用于删除数据，params会被忽略（http协议中定义的）
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    del(url, params, options) {
        return this.ajax(url, params, 'delete', options);
    }

    singleGets = {};

    /**
     * 发送新的相同url的get请求，历史未结束相同url请求就会被打断，同一个url请求，最终只会触发一次
     * 用于输入框，根据输入远程获取提示等场景
     *
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    singleGet(url, params, options) {
        const oldAjax = this.singleGets[url];
        if (oldAjax) {
            oldAjax.cancel();
        }
        const singleAjax = this.ajax(url, params, 'get', options);
        this.singleGets[url] = singleAjax;
        return singleAjax;
    }

}
