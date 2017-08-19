import BaseService from '../base-service';

export default class BuildingService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/building';
    }
}
