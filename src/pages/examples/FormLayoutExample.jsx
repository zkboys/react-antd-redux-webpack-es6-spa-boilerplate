import React, {Component} from 'react';
import {Form, Input, Select, Row, Col} from 'antd';
import {PageContent, FontIcon, FormItemLayout, InputClear} from 'zk-tookit/antd';

const Option = Select.Option;
export const PAGE_ROUTE = '/form/layout';

@Form.create()
export class LayoutComponent extends Component {
    state = {}

    componentDidMount() {

    }

    renderItems() {
        const {form: {getFieldDecorator}} = this.props;
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push(
                <FormItemLayout
                    key={i}
                    label="这个短吗12"
                    labelWidth={100}
                    tip="提示"
                    tipWidth={50}
                    width={200 + (i * 10)}
                    float
                >
                    {getFieldDecorator(`userName21${i}`, {
                        rules: [{required: true, message: 'Please input your username!'}],
                    })(
                        <Input prefix={<FontIcon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                    )}
                </FormItemLayout>
            );
        }
        return items;
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const labelSpaceCount = 5;

        return (
            <PageContent>
                <Form>
                    <h2>独占一行</h2>
                    <FormItemLayout
                        label="用户那个名"
                        labelSpaceCount={labelSpaceCount}
                        tip="我是哪个提示信息"
                        tipWidth={120}
                        tipColor="red"
                        width={500}
                    >
                        {getFieldDecorator('userName', {
                            rules: [{required: false, message: 'Please input your username!'}],
                        })(
                            <InputClear
                                form={form}
                                prefix={<FontIcon type="user" style={{fontSize: 13}}/>}
                                placeholder="Username"
                            />
                        )}
                    </FormItemLayout>
                    <FormItemLayout
                        label="我是下拉"
                        labelSpaceCount={labelSpaceCount}
                        tip={<a href="http://www.baidu.com">百度</a>}
                    >
                        {getFieldDecorator('userName22', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Select allowClear placeholder="选一个吧">
                                <Option value="1">我是测试1</Option>
                                <Option value="11">我是测试11</Option>
                                <Option value="111">我是测试111</Option>
                            </Select>
                        )}
                    </FormItemLayout>
                    <h2>结合 Row Col 布局</h2>
                    <Row>
                        <Col span={8}>
                            <FormItemLayout
                                label="这个名字有长"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName1', {
                                    rules: [{required: false, message: 'Please input your username!'}],
                                })(
                                    <Input
                                        style={{width: 120}}
                                        prefix={<FontIcon type="user" style={{fontSize: 13}}/>}
                                        placeholder="Input 有点短"
                                    />
                                )}
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout
                                label="这个短"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName2', {
                                    rules: [{required: false, message: 'Please input your username!'}],
                                })(
                                    <Input prefix={<FontIcon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                                )}
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout
                                label="这个名字有长"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName1', {
                                    rules: [{required: false, message: 'Please input your username!'}],
                                })(
                                    <Input
                                        style={{width: 120}}
                                        prefix={<FontIcon type="user" style={{fontSize: 13}}/>}
                                        placeholder="Input 有点短"
                                    />
                                )}
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout
                                label="这个短"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName2', {
                                    rules: [{required: true, message: 'Please input your username!'}],
                                })(
                                    <Input prefix={<FontIcon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                                )}
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout
                                label="短"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName11', {
                                    rules: [{required: false, message: 'Please input your username!'}],
                                })(
                                    <Input prefix={<FontIcon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                                )}
                            </FormItemLayout>
                        </Col>
                        <Col span={8}>
                            <FormItemLayout
                                label="这个短吗不短"
                                labelSpaceCount={6}
                            >
                                {getFieldDecorator('userName21', {
                                    rules: [{required: false, message: 'Please input your username!'}],
                                })(
                                    <Input prefix={<FontIcon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                                )}
                            </FormItemLayout>
                        </Col>
                    </Row>
                    <h2>固定宽度，float自动换行布局</h2>
                    {this.renderItems()}
                    <div style={{clear: 'both'}}>
                        需要清除浮动
                    </div>
                </Form>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
