import React, {Component} from 'react';
import {Button, Alert} from 'antd';
import {PageContent} from 'zk-tookit/antd';

import ModalComponent from './ModalComponent';

export const PAGE_ROUTE = '/example/modal';

export default class Index extends Component {
    state = {
        visible: false,
    };

    componentDidMount() {

    }

    render() {
        return (
            <PageContent>
                <Alert
                    message="antd的弹框组件，再次显示的时候，并不会重新出发周期函数，显示的数据还是旧数据，需要进行特殊的处理，让弹框每次打开显示都是最新的数据。"
                />
                <br/>
                <Button onClick={() => this.setState({visible: true})}>显示弹框</Button>
                <ModalComponent
                    visible={this.state.visible}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
