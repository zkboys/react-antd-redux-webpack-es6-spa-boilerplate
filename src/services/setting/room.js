import * as ajax from 'zk-tookit/utils/promise-ajax';
import BaseService from '../base-service';

export default class RoomService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/room';
    }

    getAvailableRooms({startTime, endTime, roomTypes = []}, options) {
        // TODO: 这个接口不对
        const ajaxToken = ajax.get(`/v1/preOrder/avliableRoom/${startTime}/${endTime}`, {roomTypes}, options);
        this.resource.push(ajaxToken);

        return ajaxToken;
    }
}
