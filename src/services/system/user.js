import BaseService from '../base-service';

export default class SystemService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/mock/users';
    }
}
