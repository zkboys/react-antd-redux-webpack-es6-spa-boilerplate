import * as ajax from 'zk-tookit/utils/promise-ajax';
import BaseService from '../base-service';

export default class RoomTypeService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/roomType';
    }

    toggleEnable(params, options) {
        const ajaxToken = ajax.put('/v1/roomType/update/isEnable', params, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }
}
