import BaseService from '../base-service';

export default class RoomFeatureService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/roomFeature';
    }
}