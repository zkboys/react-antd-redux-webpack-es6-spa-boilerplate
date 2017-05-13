import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Table} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    PageContent,
    QueryBar,
    ToolBar,
    QueryResult,
    PaginationComponent,
    FontIcon,
} from 'zk-react/antd';
import FormComponent from './FormComponent.jsx';

export default class extends Component {
    static defaultProps = {
        columns: [],
        toolItems: [],
        queryItems: [],
        url: '',
        dataFilter: (data) => data,
    }

    static propTypes = {
        columns: PropTypes.array.isRequired,
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        url: PropTypes.string.isRequired,
        dataFilter: PropTypes.func,
    };

    state = {
        query: {},
        pageNum: 1,
        pageSize: 20,
        loading: false,
        dataSource: [],
        total: 0,
    };

    componentWillMount() {

        // TODO: 根据 queryItems 设置 query 的默认值
    }

    componentDidMount() {
        this.search();
    }

    componentWillUnmount() {
        this.searchAjax && this.searchAjax.cancel();
    }

    search = (args) => {
        const {url, dataFilter} = this.props;
        const {pageNum, pageSize, query} = this.state;
        let params = {
            ...query,
            pageNum,
            pageSize,
            ...args,
        };
        console.log(params);
        this.setState({loading: true});
        this.searchAjax = promiseAjax.get(url, params);
        this.searchAjax.then(data => {
            data = dataFilter(data);
            this.setState({
                total: data.total,
                dataSource: data.list,
            });
        }).finally(() => this.setState({loading: false}));
    }

    handleQuery = (query) => {
        this.setState({query});
        this.search({pageNum: 1, ...query});
    }
    handlePageNumChange = (pageNum) => {
        this.setState({pageNum});
        this.search({pageNum});
    };
    handlePageSizeChange = pageSize => {
        this.setState({
            pageNum: 1,
            pageSize,
        });
        this.search({
            pageNum: 1,
            pageSize,
        });
    };

    render() {
        const {columns, toolItems, queryItems} = this.props;
        const {
            loading,
            dataSource,
            pageNum,
            pageSize,
            total,
        } = this.state;
        const tableColumns = [...columns];
        tableColumns.unshift({title: '#', render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize)});
        return (
            <PageContent className="example-users">
                <QueryBar>
                    <FormComponent
                        items={queryItems}
                        onSubmit={this.handleQuery}
                    />
                </QueryBar>
                <ToolBar>
                    {
                        toolItems.map((item, index) => {
                            const {
                                type = 'primary',
                                icon,
                                text,
                                onClick = () => {
                                },
                            } = item;
                            return (
                                <Button key={index} type={type} onClick={onClick}><FontIcon type={icon}/>{text}</Button>
                            );
                        })
                    }
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={loading}
                        size="large"
                        rowKey={(record) => record.id}
                        columns={tableColumns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </QueryResult>
                <PaginationComponent
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    onPageNumChange={this.handlePageNumChange}
                    onPageSizeChange={this.handlePageSizeChange}
                />
            </PageContent>
        );
    }
}
