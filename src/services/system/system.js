import BaseService from '../base-service';
import {zkAxios} from '../../commons';

export default class SystemService extends BaseService {
    constructor(...args) {
        super(...args);
        /**
         * 基础url BaseService会基于此url及restfull规范提供基础的一些接口
         * 这些接口需要后端基于restfull提供，单未必全部有效
         * @type {string}
         */
        this.url = '/v1/system';
    }

    getMenus({userId}, options) {
        const ajaxToken = zkAxios.get('/mock/system/menus', {userId}, options);
        this.resource.push(ajaxToken);
        return ajaxToken;
    }

    login(params, options) {
        const ajaxToken = zkAxios.post('/mock/login', params, options);
        this.resource.push(ajaxToken);
        return ajaxToken;
    }

    logout() {
        const ajaxToken = zkAxios.post('/mock/logout');
        this.resource.push(ajaxToken);
        return ajaxToken;
    }


}
