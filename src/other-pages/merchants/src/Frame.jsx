import React, {Component} from 'react';
import {message} from 'antd';
import {event} from 'zk-react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import handleErrorMessage from './commons/handle-error-message';

NProgress.configure({showSpinner: false});

@event()
export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions, $on} = this.props;
        actions.getStateFromStorage();

        $on('message', ({type, message: msg, error = {}}) => {
            if (type === 'error') {
                handleErrorMessage(error);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });

        $on('history-change', (/* history */) => {
        });

        $on('start-fetching-component', () => {
            NProgress.start();
        });

        $on('end-fetching-component', () => {
            NProgress.done();
        });
    }

    render() {
        return (
            <div className="app-frame">
                {this.props.children}
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
