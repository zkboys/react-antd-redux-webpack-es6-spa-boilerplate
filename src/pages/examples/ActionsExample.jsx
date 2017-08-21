import React, {Component} from 'react';
import {Button} from 'antd';
import {PageContent} from 'zk-tookit/antd';
import './style.less';

export const PAGE_ROUTE = '/example/actions';
export const INIT_STATE = {
    scope: 'actionsSetState',
    sync: true,
    a: {
        b: {
            c: ['ccc'],
            c2: 'c2',
        },
        b1: [],
        b2: 'b2',
    },
    d: 'd',
    e: 'e',
};

export class LayoutComponent extends Component {
    state = {};
    render() {
        return (
            <PageContent className="$actions-set-state">
                <p>
                    <Button onClick={() => {
                        this.props.$actions.setState({
                            e: 'eeeeeee',
                        });
                    }}>$actions.setState</Button>
                    <br/>
                    <span>{this.props.e}</span>
                </p>
                <p>
                    <Button onClick={() => {
                        this.props.$actions.arrAppend('a.b.c', '11');
                    }}>$actions.arrAppend 11</Button>
                    <Button onClick={() => {
                        this.props.$actions.arrAppend('a.b.c', ['11', '22']);
                    }}>$actions.arrAppend ['11', '22']</Button>
                    <Button onClick={() => {
                        this.props.$actions.arrRemove('a.b.c', '11');
                    }}>$actions.arrRemove 11</Button>
                    <Button onClick={() => {
                        this.props.$actions.arrRemoveAll('a.b.c', '22');
                    }}>$actions.arrRemoveAll 22</Button>
                    <br/>
                    <span>{this.props.a.b.c.join(',')}</span>
                </p>
                <p>
                    <Button onClick={() => {
                        this.props.$actions.objSet('a.b.c2', '11');
                    }}>$actions.objSet a.b.c2 = 11</Button>
                    <Button onClick={() => {
                        this.props.$actions.objRemove('a.b.c2', '11');
                    }}>$actions.objRemove a.b.c2</Button>
                    <br/>
                    <span>{this.props.a.b.c2}</span>
                </p>
                <p>
                    <Button onClick={() => {
                        this.props.$actions.demo('我是demo');
                    }}>
                        测试共享操作action
                    </Button>
                    <br/>
                    <span>{this.props.demo.message}</span>
                </p>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.pageState.actionsSetState,
        demo: state.demo,
    };
}
