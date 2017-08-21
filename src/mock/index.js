import MockAdapter from 'axios-mock-adapter';
import {mockInstance} from '../commons';
import mockAjax from './mock-ajax';
import mockMenu from './mock-menu';
import mockUser from './mock-user';

const mock = new MockAdapter(mockInstance);

mockAjax(mock);
mockMenu(mock);
mockUser(mock);
