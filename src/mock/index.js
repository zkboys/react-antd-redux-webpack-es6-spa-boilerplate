import MockAdapter from 'axios-mock-adapter';
import * as promiseAjax from 'zk-tookit/utils/promise-ajax';
import mockAjax from './mock-ajax';
import mockMenu from './mock-menu';
import mockUser from './mock-user';

const mock = new MockAdapter(promiseAjax.mockInstance);

mockAjax(mock);
mockMenu(mock);
mockUser(mock);
