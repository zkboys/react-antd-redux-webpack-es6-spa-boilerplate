import BaseService from '../base-service';

export default class RegisterFormDetailService extends BaseService {
    constructor(...args) {
        super(...args);
        this.url = '/v1/checkIn';
    }
}
