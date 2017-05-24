import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Table} from 'antd';
import moment from 'moment';
import {ajax} from 'zk-react';
import {
    PageContent,
    ToolBar,
    QueryResult,
    Operator,
    FontIcon,
} from 'zk-react/antd';

export const PAGE_ROUTE = '/merchants';

@ajax()
export class LayoutComponent extends Component {
    state = {
        loading: false,
        dataSource: [],
    };
    columns = [
        {title: '#', width: 50, render: (text, record, index) => (index + 1)},
        {title: '任务编号', dataIndex: 'taskCode', key: 'taskCode', width: 240},
        {title: '签购单名称', dataIndex: 'receiptsName', key: 'receiptsName', width: 200},
        {title: '注册名称', dataIndex: 'registName', key: 'registName', width: 200},
        {title: '主营业务', dataIndex: 'mainManageBusiness', key: 'mainManageBusiness', width: 300},
        {title: '法人姓名', dataIndex: 'legalPersonName', key: 'legalPersonName', width: 100},
        {title: '联系人手机号', dataIndex: 'linkmanMobileNo', key: 'linkmanMobileNo', width: 100},
        {title: '业务员名称', dataIndex: 'salesmanName', key: 'salesmanName', width: 150},
        {title: '录入人', dataIndex: 'createUser', key: 'createUser', width: 150},
        {title: '自定义分类', dataIndex: 'customClassify', key: 'customClassify', width: 200},
        {
            title: '最后操作时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 140,
            render: (text) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '操作',
            key: 'operator',
            // fixed: 'right',
            width: 130,
            render: (text, record) => {
                const {userCode, orgNo} = this.state;
                const items = [
                    {
                        label: '查看',
                        permission: '',
                        onClick: () => {
                            const {router} = this.props;
                            router.push(`/merchants/+add_edit/${record.id}?isDetail=true&isDraft=true&userCode=${userCode}&orgNo=${orgNo}`);
                        },
                    },
                ];
                if (userCode === record.createUserId) {
                    items.push(
                        {
                            label: '修改',
                            permission: '',
                            onClick: () => {
                                const {router} = this.props;
                                router.push(`/merchants/+add_edit/${record.id}?isModify=true&isDraft=true&userCode=${userCode}&orgNo=${orgNo}`);
                            },
                        }
                    );
                    items.push(
                        {
                            label: '删除',
                            permission: '',
                            confirm: {
                                title: `您确定要删除“${record.receiptsName}”？`,
                                onConfirm: () => this.handleDelete(record),
                            },
                        }
                    );
                }
                return (<Operator items={items} hasPermission={() => true}/>);
            },
        },
    ];

    componentWillMount() {
        const {location} = this.props;
        const {userCode, orgNo} = location.query;
        this.setState({userCode, orgNo});
    }

    componentDidMount() {
        this.search();
    }

    handleDelete = ({id, receiptsName}) => {
        const {$ajax} = this.props;
        $ajax.get(`/draft/del/${id}`, null, {errorTip: `删除${receiptsName}失败！`, successTip: `删除${receiptsName}成功！`})
            .then(() => {
                const dataSource = this.state.dataSource.filter(item => item.id !== id);
                this.setState({dataSource});
            });
    }
    search = () => {
        this.setState({loading: true});
        const {$ajax, location} = this.props;
        const {userCode, orgNo} = location.query;
        const params = {
            createUserId: userCode,
            salesmanCode: userCode,
            orgNo,
        };
        $ajax.get('/draft/list', params).then(data => {
            this.setState({
                dataSource: data.dataList,
            });
        }).finally(() => this.setState({loading: false}));
    }


    render() {
        const {
            loading,
            dataSource,
            userCode,
            orgNo,
        } = this.state;
        const addPath = `/merchants/+add_edit/:merchId?userCode=${userCode}&orgNo=${orgNo}`;
        return (
            <PageContent className="example-users">
                <ToolBar>
                    <Link to={addPath}>
                        <Button type="primary"><FontIcon type="plus-circle-o"/>新增商户</Button>
                    </Link>
                </ToolBar>
                <QueryResult>
                    <Table
                        scroll={{x: 1800}}
                        loading={loading}
                        size="large"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </QueryResult>
            </PageContent>
        );
    }
}

export function mapStateToProps() {
    return {};
}

