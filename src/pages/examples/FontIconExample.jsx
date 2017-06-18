import React, {Component} from 'react';
import {Card} from 'antd';
import {PageContent, FontIcon, FontIconSelector, FontIconModal} from 'zk-tookit/antd';

export const PAGE_ROUTE = '/example/font-icon';
export default class extends Component {
    state = {
        selectedIcon: '',
    }
    handleSelect = (type) => {
        console.log(type);
    }

    render() {
        return (
            <PageContent className="example-font-icon">
                <Card title="FontIcon">
                    <FontIcon type="fa-user" className="icon-class" size="4x" style={{color: 'red'}}/>
                </Card>
                <br/>
                <Card title="FontIconModal">
                    <FontIconModal
                        size="large"
                        disabled={false}
                        buttonType="primary"
                        value={this.state.selectedIcon}
                        height={500}
                        showPreview
                        onSelect={(type) => {
                            this.setState({selectedIcon: type});
                        }}
                    />
                </Card>
                <br/>
                <Card title="FontIconSelector">
                    <FontIconSelector onSelect={this.handleSelect}/>
                </Card>
            </PageContent>
        );
    }
}
