import defaultConnect from 'zk-react/redux/connect';
import actions from '../actions';

const options = {
    withRef: true,
};
export default defaultConnect({actions, options});

