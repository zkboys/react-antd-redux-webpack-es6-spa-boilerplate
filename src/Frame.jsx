import React, {Component} from 'react';

export class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
        this.props.actions.getStateFromStorage();
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.utils,
    };
}
