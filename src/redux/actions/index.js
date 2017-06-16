import checkActions from 'zk-react/redux/check-action';
import actionUtils from 'zk-react/redux/action-utils';
import * as page from 'zk-react/redux/action-page';
import pageInitState from '../../page-init-state';
import * as demo from './demo';
import * as frame from './frame';

const syncKeys = ['settings', 'frame']; // 需要同步的数据，对应meta中的sync字段，对应的是reducers中的数据
const utils = actionUtils({pageInitState, syncKeys});

const actions = {
    page,
    utils,
    demo,
    frame,
};

export default checkActions(actions);
