import BaseService from '../base-service';

export default class FloorService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/floor';
    }
}
