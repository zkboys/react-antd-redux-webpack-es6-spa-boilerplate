import React, {Component} from 'react';
import {Link} from 'react-router';
import {PageContent} from 'zk-react/antd';
import pageRoutes from 'zk-react/route/page-routes';
import './style.less';

export class LayoutComponent extends Component {
    state = {}

    componentWillReceiveProps(/* nextProps */) {
    }

    componentWillMount() {
        console.log(123);
    }

    render() {
        return (
            <PageContent className="home">
                <h1>home123</h1>
                {
                    pageRoutes.map(route => <div key={route.path}><Link to={route.path}>{route.path}</Link></div>)
                }
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
