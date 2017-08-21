import {zkAxios} from '../commons';

export default class BaseService {
    constructor() {
        // 存放service占用的资源，组件卸载的时候会调用资源的cancel方法释放资源
        // 一般是ajax、event等
        this.resource = [];
    }

    /**
     * 释放资源，一般组件卸载的时候回调用次方法，详见 service-hoc.jsx 高阶组件
     */
    release() {
        this.resource.forEach(item => {
            if (item.cancel) item.cancel();
            if (item.release) item.release();
        });
    }

    add(params, options) {
        const ajaxToken = zkAxios.post(this.url, params, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }

    deleteById(id, options) {
        const ajaxToken = zkAxios.del(`${this.url}/${id}`, null, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }

    update(params, options) {
        const ajaxToken = zkAxios.put(this.url, params, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }

    getByPage(params, options) {
        const ajaxToken = zkAxios.get(this.url, params, options);
        this.resource.push(ajaxToken); // 存入资源集合中，调用组件被卸载会调用release方法会统一释放

        return ajaxToken.then(res => {
            return {
                total: res.total,
                list: res.list,
            };
        });
    }

    getAll(params, options) {
        const ajaxToken = zkAxios.get(this.url, params, options);
        this.resource.push(ajaxToken);

        return ajaxToken.then(res => res.list || []);
    }

    getById(id, options) {
        const ajaxToken = zkAxios.get(`${this.url}/${id}`, null, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }
}
