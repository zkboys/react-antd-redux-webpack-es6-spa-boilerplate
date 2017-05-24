import React, {Component} from 'react';
import {Card, Select, Button, Form, Input} from 'antd';
import {PageContent, Permission} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import './style.less';
import {hasPermission} from '../../../commons';

export const PAGE_ROUTE = '/base-information/data';
const FormItem = Form.Item;
const Option = Select.Option;

class Maintenance extends Component {
    state = {
        maintenance: [],
    };

    componentDidMount() {
        if (hasPermission('VIRTUAL_PORTAL_DATA_WHITELIST')) {
            promiseAjax.get('/systems').then(data => {
                if (data && data.list && data.list.length) {
                    this.setState({
                        maintenance: data.list,
                    });
                }
            });
        }
    }

    renderDataOptions = () => {
        return this.state.maintenance.map(data => <Option value={data.code} key={data.code}>{data.name}</Option>);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {form} = this.props;
        form.validateFieldsAndScroll(['virtualCode'], (err, values) => {
            console.log(values);
            if (!err) {
                promiseAjax.get('/data/virtualCode', values, {successTip: '更新成功！'}).then(() => {
                });
            }
        });
    }
    handleWhiteSubmit = (e) => {
        e.preventDefault();
        const {form} = this.props;
        form.validateFieldsAndScroll(['systemCode'], (err, values) => {
            console.log(values);
            if (!err) {
                promiseAjax.get('/data/whiteList', values, {successTip: '更新成功！'}).then(() => {
                });
            }
        });
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {maintenance} = this.state;
        return (
            <PageContent className="actions-set-state">
                <Permission code="PORTAL_DATA_VIRTUALCODE" hasPermission={hasPermission}>
                    <Card title="更新虚拟权限码" style={{marginBottom: 16}}>
                        <Form onSubmit={this.handleSubmit} layout="inline">
                            <FormItem
                                style={{marginRight: 50}}
                                label="虚拟权限码">
                                {getFieldDecorator('virtualCode', {
                                    rules: [{required: true, message: '请输入虚拟权限码！'}],
                                })(
                                    <Input style={{width: 400}} placeholder="请输入虚拟权限码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" size="large" htmlType="submit">更新</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Permission>

                <Permission code="VIRTUAL_PORTAL_DATA_WHITELIST" hasPermission={hasPermission}>
                    <Card title="更新白名单">
                        <Form onSubmit={this.handleWhiteSubmit} layout="inline">
                            <FormItem
                                style={{marginLeft: 36, marginRight: 50}}
                                label="系统"
                            >
                                {getFieldDecorator('systemCode', {
                                    initialValue: maintenance.code,
                                    rules: [
                                        {
                                            required: true, message: '请选择系统!',
                                        },
                                    ],
                                })(
                                    <Select
                                        style={{width: 400}}
                                        placeholder="请选择系统"
                                        onSelect={this.handleSystemSelect}
                                        notFoundContent="暂无数据"
                                    >
                                        {this.renderDataOptions()}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" size="large" htmlType="submit">更新</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Permission>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(Maintenance);
