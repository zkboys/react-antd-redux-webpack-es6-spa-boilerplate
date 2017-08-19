import * as ajax from 'zk-tookit/utils/promise-ajax';
import BaseService from '../base-service';

export default class PreOrderService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/preOrder';
    }

    /**
     * 弃房
     * @param preOrderId // 预订单id
     * @param subOrderId // 当前列表中的id
     * @param options
     * @returns {Promise}
     */
    abandonRoom({preOrderId, subOrderId}, options) {
        const ajaxToken = ajax.get(`${this.url}/abandonRoom`, {preOrderId, subOrderId}, options);
        this.resource.push(ajaxToken);
        return ajaxToken;
    }

    /**
     * 取消房间
     * @param preOrderId // 预订单id
     * @param subOrderId // 当前列表中的id
     * @param options
     * @returns {Promise}
     */
    cancelRoom({preOrderId, subOrderId}, options) {
        const ajaxToken = ajax.get(`${this.url}/cancelRoom`, {preOrderId, subOrderId}, options);
        this.resource.push(ajaxToken);
        return ajaxToken;
    }

    /**
     * 修改时间
     * @param preOrderId // 预订单id
     * @param subOrderId // 当前列表中的id
     * @param startDate // 更改后的开始时间
     * @param endDate // 更改后的结束时间
     * @param options
     * @returns {Promise}
     */
    changeTime({preOrderId, subOrderId, startDate, endDate}, options) {
        const ajaxToken = ajax.get(`${this.url}/cancelRoom`, {preOrderId, subOrderId, startDate, endDate}, options);
        this.resource.push(ajaxToken);
        return ajaxToken;
    }
}
