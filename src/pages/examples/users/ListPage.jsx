import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Table} from 'antd';
import {
    PageContent,
    QueryBar,
    ToolBar,
    QueryResult,
    PaginationComponent,
    FontIcon,
} from 'zk-react/antd';
import QueryItem from './QueryItem.jsx';

export default class extends Component {
    static defaultProps = {
        columns: [],
        toolItems: [],
        queryItems: [],
        showSearchButton: true,
        showResetButton: true,
        showPagination: true,
        total: 0,
        dataSource: [],
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        total: PropTypes.number,
        dataSource: PropTypes.array,
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
    }

    componentDidMount() {
        this.search();
    }

    componentWillUnmount() {
    }

    search = (args) => {
        const {onSearch} = this.props;
        const {pageNum, pageSize, query} = this.state;
        let params = {
            ...query,
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({loading: true});
        onSearch(params).finally(() => this.setState({loading: false}));
    };

    handleQuery = (query) => {
        this.setState({query});
        this.search({pageNum: 1, ...query});
    };

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
        const {
            columns,
            toolItems,
            queryItems,
            showSearchButton,
            showResetButton,
            showPagination,
            total,
            dataSource,
        } = this.props;

        const {
            loading,
            pageNum,
            pageSize,
        } = this.state;

        // columns key可以缺省，默认与dataIndex，如果有相同dataIndex列，需要指定key；
        const tableColumns = columns.map(item => {
            if (!item.key) {
                item.key = item.dataIndex;
            }
            return item;
        });
        tableColumns.unshift({title: '序号', render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize)});

        return (
            <PageContent className="example-users">
                <QueryBar>
                    <QueryItem
                        items={queryItems}
                        showSearchButton={showSearchButton}
                        showResetButton={showResetButton}
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
                {
                    showPagination ?
                        <PaginationComponent
                            pageSize={pageSize}
                            pageNum={pageNum}
                            total={total}
                            onPageNumChange={this.handlePageNumChange}
                            onPageSizeChange={this.handlePageSizeChange}
                        />
                        : null
                }
            </PageContent>
        );
    }
}
