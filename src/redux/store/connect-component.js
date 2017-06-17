import {connect} from 'zk-react/redux';
import actions from '../actions';

const options = {
    withRef: true,
};
export default connect({actions, options});

