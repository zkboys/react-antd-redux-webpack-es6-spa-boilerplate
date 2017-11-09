import React, {Component} from 'react';
import {Table, Button} from 'antd';

export const PAGE_ROUTE = '/example/table-row-key';

export default class TableRowKey extends Component {
    state = {
        dataSource: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4},

        ],
    };

    columns = [
        {title: '姓名', dataIndex: 'name', key: 'name'},
    ];

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Table
                    columns={this.columns}
                    dataSource={this.state.dataSource}
                    rowKey={(record, index) => index}
                />
                <Button onClick={() => {
                    const dataSource = [...this.state.dataSource];
                    dataSource.reverse();
                    this.setState({dataSource});
                }}>Click</Button>
            </div>
        );
    }
}
