import MockAdapter from 'axios-mock-adapter';
import mockUser from './mock-user';
import mockAjax from './mock-ajax';
import mockRole from './mock-role';
import mockMenu from './mock-menu';
import mockManager from './mock-manager';
import mockSystem from './mock-system_page';
import {mockInstance} from '../commons/promise-ajax';

const mock = new MockAdapter(mockInstance);

mockUser(mock);
mockAjax(mock);
mockRole(mock);
mockMenu(mock);
mockManager(mock);
mockSystem(mock);
