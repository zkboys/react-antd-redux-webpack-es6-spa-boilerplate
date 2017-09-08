import React, {Component} from 'react';
import {Button} from 'antd';
import {PageContent, AnimationTable, ToolBar, Operator} from 'zk-tookit/antd';
import uuid from 'uuid/v4';

export const PAGE_ROUTE = '/example/table-animation';

export default class TableAnimation extends Component {
    state = {
        dataSource: [],
    };

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '30%',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 80,
        },
        {
            title: '年龄',
            dataIndex: 'age',
        },
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                const {id} = record;
                const items = [
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: '您确定删除此条记录？',
                            onConfirm: () => this.handleDelete(id),
                        },
                    },
                ];
                return <Operator items={items}/>;
            },
        },
    ];

    componentWillMount() {
        const dataSource = [];
        for (let i = 0; i < 20; i++) {
            dataSource.push({
                id: uuid(),
                name: '小王',
                age: '25',
                address: '牛逼的地址，就不告诉你',
            });
        }
        this.setState({dataSource});
    }

    handleDelete = (id) => {
        // ajax 请求，进行删除 一下是删除成功后逻辑
        const newDataSource = this.state.dataSource.filter(item => item.id !== id);

        this.setState({dataSource: newDataSource});
    };

    handleAdd = () => {
        const {dataSource} = this.state;

        const newData = {
            id: uuid(),
            name: '小王',
            age: 25,
            address: '牛逼的地址，就不告诉你',
        };
        this.setState({
            dataSource: [newData, ...dataSource],
        });
    };

    handleSearch = () => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(1, 1);
        dataSource.splice(3, 1);
        for (let i = 2; i < 10; i++) {
            dataSource.push({
                id: uuid(),
                name: '小王',
                age: '25',
                address: '牛逼的地址，就不告诉你',
            });
        }
        this.setState({dataSource});
    };

    componentDidMount() {

    }

    render() {
        const {dataSource} = this.state;
        const {columns} = this;
        return (
            <PageContent>
                <ToolBar>
                    <Button onClick={this.handleAdd}>Add</Button>
                    <Button onClick={this.handleSearch}>Search</Button>
                </ToolBar>
                <AnimationTable
                    uniqueKey="id"
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                />
            </PageContent>
        );
    }
}
