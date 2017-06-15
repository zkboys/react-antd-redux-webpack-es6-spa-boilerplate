import reducerPage from 'zk-react/redux/reducer-page';
import initialState from '../../page-init-state';
import demo from './demo';
import frame from './frame';

const pageState = reducerPage(initialState);

const reducers = {
    pageState,
    demo,
    frame,
};

export default reducers;
