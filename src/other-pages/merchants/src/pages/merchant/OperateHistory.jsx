import React, {Component} from 'react';
import {Table} from 'antd';
import moment from 'moment';

export default class OperateHistory extends Component {
    state = {}

    componentDidMount() {

    }

    columns = [
        {title: '步骤名称', dataIndex: 'stepName', key: 'stepName'},
        {title: '办理人', dataIndex: 'transactor', key: 'transactor'},
        {title: '办理时间', dataIndex: 'dealTime', key: 'dealTime', render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')},
        {title: '办理意见', dataIndex: 'dealOpinion', key: 'dealOpinion'},
    ];

    render() {
        const {data} = this.props;
        return (
            <div className="merchant-operate-history">
                <Table
                    dataSource={data}
                    rowKey={(record) => record.dealTime}
                    columns={this.columns}
                    pagination={false}
                />
            </div>
        );
    }
}
