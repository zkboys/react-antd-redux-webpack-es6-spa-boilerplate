import {connect} from 'zk-tookit/redux';
import actions from '../actions';

const options = {
    withRef: true,
};
export default connect({actions, options});

