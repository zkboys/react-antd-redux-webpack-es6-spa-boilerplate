import React, {Component} from 'react';
import connectComponent from 'zk-react/redux/store/connectComponent';

class LayoutComponent extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="frame-header">
                头部
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
