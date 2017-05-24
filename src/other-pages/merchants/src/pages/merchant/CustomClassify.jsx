import React, {Component} from 'react';
import {Table, Button, Form, Spin} from 'antd';
import {ajax} from 'zk-react';
import {Operator, EditableCell, ToolBar} from 'zk-react/antd';

@ajax()
class CustomClassify extends Component {
    state = {
        loading: false,
        saving: false,
        deleting: false,
        data: [],
    }
    columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                const {form} = this.props;
                const message = '请输入名称！';
                return (
                    <EditableCell
                        form={form}
                        isRowEdit
                        showEdit={record.isNewAddRow}
                        field="name"
                        placeholder={message}
                        decorator={{
                            initialValue: record.name,
                            rules: [
                                {required: true, message},
                            ],
                        }}
                    />
                );
            },
        },
        {
            title: '描述',
            dataIndex: 'describeInfo',
            key: 'describeInfo',
            render: (text, record) => {
                const {form} = this.props;
                const message = '请输入描述！';
                return (
                    <EditableCell
                        form={form}
                        isRowEdit
                        showEdit={record.isNewAddRow}
                        field="describeInfo"
                        placeholder={message}
                        decorator={{
                            initialValue: record.describeInfo,
                            rules: [
                                {required: true, message},
                            ],
                        }}
                    />
                );
            },
        },
        {
            title: '操作',
            render: (text, record) => {
                const {saving} = this.state;
                if (record.isNewAddRow) {
                    const items = [
                        {
                            label: saving ? <Spin size="small"/> : '保存',
                            onClick: () => {
                                this.handleSave(record);
                            },
                        },
                        {
                            label: '取消',
                            onClick: () => {
                                const data = [...this.state.data];
                                const newData = data.filter(item => !item.isNewAddRow);
                                this.setState({data: newData});
                            },
                        },
                    ];
                    return <Operator items={items}/>;
                }
                const items = [
                    {
                        label: '删除',
                        confirm: {
                            title: `您确定要删除${record.name}吗？`,
                            onConfirm: () => {
                                this.handleDelete(record);
                            },
                        },
                    },
                ];
                return <Operator items={items}/>;
            },
        },
    ]

    componentWillMount() {
        this.search();
    }

    search() {
        const {
            $ajax,
            labelType,
            orgNo,
            onChange = () => {
            },
        } = this.props;
        this.setState({loading: true});
        $ajax.get(`/label/getCustomLabelList/${labelType}/${orgNo}`).then(res => {
            onChange(res);
            this.setState({data: res});
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    handleDelete = (record) => {
        this.props.$ajax.get(`/label/del/${record.id}`).finally(() => this.search());
    }

    handleSave = () => {
        const {saving} = this.state;
        if (saving) return;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {$ajax, labelType, userCode, orgNo} = this.props;

                values.orgNo = orgNo;
                values.labelType = labelType;
                values.createUser = userCode;
                values.updateUser = userCode;
                this.setState({saving: true});
                $ajax.post('/label/save', values, {successTip: '添加成功！'}).finally(() => {
                    this.search();
                    this.setState({saving: false});
                });
            }
        });
    }
    handleAdd = () => {
        const newData = [...this.state.data];
        const isEditing = newData.find(item => item.isNewAddRow);
        if (isEditing) return;
        newData.push({
            id: new Date().getTime(), // 这个id给个随机即可
            name: '',
            describeInfo: '',
            isNewAddRow: true,
        });
        this.setState({data: newData});
    }

    render() {
        const {loading} = this.state;
        const data = [...this.state.data].reverse();

        return (
            <div>
                <ToolBar>
                    <Button type="primary" onClick={this.handleAdd}>添加</Button>
                </ToolBar>
                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    pagination={false}
                    scroll={{y: 240}}
                    size="small"
                />
            </div>
        );
    }
}

export default Form.create()(CustomClassify);
