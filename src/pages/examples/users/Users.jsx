import React, {Component} from 'react';
import {Form, Button, Input, Table} from 'antd';
import {promiseAjax} from 'zk-react';
import {
    PageContent,
    QueryBar,
    ToolBar,
    QueryResult,
    PaginationComponent,
    InputCloseSuffix,
    Operator,
    FontIcon,
} from 'zk-react/antd';

const FormItem = Form.Item;

export const PAGE_ROUTE = '/example/users';

class Users extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        loading: false,
        dataSource: [],
        total: 0,
    };
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '登陆名称', dataIndex: 'loginName', key: 'loginName', width: '20%'},
        {title: '用户名', dataIndex: 'name', key: 'name'},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const items = [
                    {
                        label: '修改',
                        permission: '',
                        onClick: () => console.log('修改'),
                    },
                    {
                        label: '删除',
                        permission: '',
                        confirm: {
                            title: `您确定要删除“${record.loginName}”？`,
                            onConfirm: () => console.log('删除'),
                        },
                    },
                ];

                return (<Operator items={items} hasPermission={() => true}/>);
            },
        },
    ];

    componentDidMount() {
        this.search();
    }

    componentWillUnmount() {
        this.searchAjax && this.searchAjax.cancel();
    }

    search = (args) => {
        const {form: {getFieldsValue}} = this.props;
        const {pageNum, pageSize} = this.state;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({loading: true});
        this.searchAjax = promiseAjax.get('/mock/users', params).then(data => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                dataSource: data.list,
            });
        }).finally(() => this.setState({loading: false}));
    }

    handleQuery = (e) => {
        e.preventDefault();
        this.search({pageNum: 1});
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
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {
            loading,
            dataSource,
            pageNum,
            pageSize,
            total,
        } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
            <PageContent className="example-users">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline">
                        <FormItem
                            style={{marginBottom: 16}}
                            {...formItemLayout}
                            label="登录名">
                            {getFieldDecorator('loginName')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入登录账号"
                                    suffix={<InputCloseSuffix form={form} field="loginName" dom={this.lni}/>}
                                />
                            )}
                        </FormItem>
                        <Button type="primary" size="large" htmlType="submit">查询</Button>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Button type="primary"><FontIcon type="plus-circle-o"/>添加</Button>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={loading}
                        size="large"
                        rowKey={(record) => record.id}
                        columns={this.columns}
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

export const LayoutComponent = Form.create()(Users);

export function mapStateToProps(state) {
    return {
        ...state.pageState.actionsSetState,
        demo: state.demo,
    };
}

