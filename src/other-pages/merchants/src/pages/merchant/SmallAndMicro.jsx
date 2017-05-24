import React, {Component} from 'react';
import {Form, Row, Col, Input, Select, Checkbox, Card, Button, Modal, DatePicker} from 'antd';
import {ajax} from 'zk-react';
import {PageContent, FontIcon} from 'zk-react/antd';
import Address from './Address';
import RateInfo from './RateInfo';
import BillingPrivate from './BillingPrivate';
import HappyPay from './HappyPay';
import SmallAndMicroImage from './SmallAndMicroImage';

export const PAGE_ROUTE = '/merchants/small/+add_edit/:merchId';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@ajax()
export class LayoutComponent extends Component {
    state = {
        saving: false,
        isDetail: false,
        isModify: false,
        isAdd: true,
        data: {
            baseInfoVo: undefined,
            billingInfoVo: undefined,
            imageInfoVo: undefined,
            rateInfoVo: undefined,
        },
        clerkList: [], // 业务人员列表
    }

    componentDidMount() {
        const {location} = this.props;
        const {orgNo} = location.query;
        const {isAdd} = this.state;
        this.getClerkList(orgNo);
        if (isAdd) {
            this.getTaskCode();
        }
    }

    // 获取业务员下拉列表
    getClerkList(orgNo) {
        this.props.$ajax.get(`/binfo/getClerkList/${orgNo}`).then(res => {
            this.setState({clerkList: res});
        });
    }

    // 渲染业务员下拉列表
    renderClerk() {
        return this.state.clerkList.map(item => {
            return <Option key={item.userCode} value={String(item.userCode)}>{item.remarkName}</Option>;
        });
    }

    getTaskCode() {
        const {$ajax} = this.props;
        const {data} = this.state;
        $ajax.get('/binfo/getTaskCode/01').then(res => {
            if (!data.baseInfoVo) data.baseInfoVo = {taskCode: res};
            this.setState({data});
        });
    }

    formData = {};
    handleSubmit = (e) => {
        e.preventDefault();
        this.formData = {};
        // 基础信息
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.formData.baseInfoVo = values;
                this.save();
            }
        });

        // 费率信息
        this.rateInfoForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.formData.rateInfoVo = values;
                this.save();
            }
        });
        // 个体结算信息
        this.billingInfoForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.formData.billingInfoVo = values;
                this.save();
            }
        });
        // 图片信息
        this.imageInfoForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.formData.imageInfoVo = values;
                this.save();
            }
        });
    }

    showError(content) {
        Modal.error({
            title: '提示',
            content,
        });
    }

    save() {
        const keys = [
            'baseInfoVo',
            'rateInfoVo',
            'billingInfoVo',
            'imageInfoVo',
        ];
        for (let key of keys) {
            if (!Reflect.has(this.formData, key)) {
                return;
            }
        }

        const {location} = this.props;
        const {orgNo} = location.query;
        // 处理taskCode orgNo
        const taskCode = this.formData.baseInfoVo.taskCode;
        Object.keys(this.formData).forEach(key => {
            this.formData[key].taskCode = taskCode;
            this.formData[key].orgNo = orgNo;
        });

        // 一些默认值
        this.formData.baseInfoVo.jinjianChannel = '3';
        this.formData.baseInfoVo.roleIdentity = 'ROLE_IDENTITY_ADMIN'; // TODO 需要系统传值
        this.formData.baseInfoVo.jinjianType = '1';
        this.formData.baseInfoVo.mecNormalLevel = '02'; // TODO 改成小微的level

        // 保存数据
        this.setState({saving: true});
        this.props.$ajax.post('/merch/save', this.formData).then(() => {
        }).catch(err => {
            let content = '保存数据失败！';
            if (err && err.response && err.response.message) {
                content = err.response.message;
            }
            this.showError(content);
        }).finally(() => {
            this.setState({saving: false});
        });
    }

    render() {
        const {saving, isAdd, isDetail, isModify, data} = this.state;
        const {form, form: {getFieldDecorator, getFieldValue}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const threeColLayout = {
            xs: 12,
            sm: 12,
            md: 8,
            lg: 8,
            xl: 8,
        };
        const formItemWidth = 300;
        const baseInfoVo = data.baseInfoVo || {};
        return (
            <PageContent className="merchant-add-edit">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col {...threeColLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="任务编号"
                            >
                                {getFieldDecorator('taskCode', {
                                    initialValue: baseInfoVo.taskCode,
                                })(
                                    <Input disabled style={{width: 300}}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Card title="基础信息" className="block">
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="商户名称"
                                >
                                    {getFieldDecorator('subjectionMerchantName', {
                                        initialValue: baseInfoVo.subjectionMerchantName,
                                        rules: [
                                            {
                                                required: true, message: '请输入商户名称！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入商户名称" disabled={isDetail}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="主营业务"
                                >
                                    {getFieldDecorator('mainManageBusiness', {
                                        initialValue: baseInfoVo.mainManageBusiness,
                                        rules: [
                                            {
                                                required: true, message: '请输入主营业务！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入主营业务" disabled={isDetail}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="联系人手机号"
                                >
                                    {getFieldDecorator('linkmanMobileNo', {
                                        initialValue: baseInfoVo.linkmanMobileNo,
                                        rules: [
                                            {
                                                required: true, message: '请输入联系人手机号！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入联系人手机号" disabled={isDetail}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="商户负责人姓名"
                                >
                                    {getFieldDecorator('legalPersonName', {
                                        initialValue: baseInfoVo.legalPersonName,
                                        rules: [
                                            {
                                                required: true, message: '请输入商户负责人姓名！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入商户负责人姓名" disabled={isDetail}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="结算人身份证号"
                                >
                                    {getFieldDecorator('settleManidNumber', {
                                        initialValue: baseInfoVo.settleManidNumber,
                                        rules: [
                                            {
                                                required: true, message: '请输入结算人身份证号！',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请输入结算人身份证号" disabled={isDetail}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="行业大类"
                                >
                                    {getFieldDecorator('businessClassify', {
                                        initialValue: baseInfoVo.businessClassify,
                                        rules: [
                                            {
                                                required: true, message: '请选择行业大类！',
                                            },
                                        ],
                                    })(
                                        <Select placeholder="请选择行业大类" disabled={isDetail}>
                                            <Option value="1">餐娱类</Option>
                                            <Option value="2">一般类</Option>
                                            <Option value="3">民生类</Option>
                                            <Option value="4">房产汽车类</Option>
                                            <Option value="5">批发类</Option>
                                            <Option value="6">公益类</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="业务员名称"
                                >
                                    {getFieldDecorator('salesmanCode', {
                                        initialValue: baseInfoVo.salesmanCode,
                                        rules: [
                                            {
                                                required: true, message: '请选择业务员！',
                                            },
                                        ],
                                    })(
                                        <Select
                                            placeholder="请选择业务员"
                                            showSearch
                                            optionFilterProp="children"
                                            disabled={isDetail}>
                                            {this.renderClerk()}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    labelCol={{span: 5}}
                                    wrapperCol={{span: 16}}
                                    style={{width: 600}}
                                    label="证件有效期"
                                >
                                    {getFieldDecorator('cardAlwaysEnabled', {
                                        initialValue: baseInfoVo.cardAlwaysEnabled || false,
                                        rules: [
                                            {
                                                required: true, message: '请选择证件有效期！',
                                            },
                                        ],
                                    })(
                                        <Checkbox disabled={isDetail}>长期有效</Checkbox>
                                    )}
                                    {
                                        !getFieldValue('cardAlwaysEnabled') ?
                                            <div style={{display: 'inline-block'}}>
                                                <FormItem
                                                    style={{width: 150, display: 'inline-block'}}
                                                >

                                                    {getFieldDecorator('cardStartTime', {
                                                        initialValue: baseInfoVo.cardStartTime,
                                                        rules: [
                                                            {
                                                                validator: (rule, value, callback) => {
                                                                    const cardAlwaysEnabled = getFieldValue('cardAlwaysEnabled');
                                                                    const cardStartTime = getFieldValue('cardStartTime');

                                                                    if (!cardAlwaysEnabled) {
                                                                        if (!cardStartTime) {
                                                                            return callback('请选择有效期开始时间！');
                                                                        }
                                                                    }
                                                                    callback();
                                                                },
                                                            },
                                                        ],
                                                    })(
                                                        <DatePicker format="YYYY-MM-DD"/>
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    style={{width: 150, display: 'inline-block'}}
                                                >
                                                    {getFieldDecorator('cardEndTime', {
                                                        initialValue: baseInfoVo.cardEndTime,
                                                        rules: [
                                                            {
                                                                validator: (rule, value, callback) => {
                                                                    const cardAlwaysEnabled = getFieldValue('cardAlwaysEnabled');
                                                                    const cardEndTime = getFieldValue('cardEndTime');

                                                                    if (!cardAlwaysEnabled) {
                                                                        if (!cardEndTime) {
                                                                            return callback('请选择有效期结束时间！');
                                                                        }
                                                                    }
                                                                    callback();
                                                                },
                                                            },
                                                        ],
                                                    })(
                                                        <DatePicker format="YYYY-MM-DD"/>
                                                    )}

                                                </FormItem>
                                            </div>
                                            : null

                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Address
                            form={form}
                            data={baseInfoVo}
                            isAdd={isAdd}
                            isDetail={isDetail}
                            isModify={isModify}
                            provinceField="bindAddressProvince"
                            cityField="bindAddressCity"
                            areaField="bindAddressArea"
                            streetField="bindAddressStreet"
                        />
                    </Card>
                    <Card title="费率信息" className="block">
                        <RateInfo getForm={f => this.rateInfoForm = f} data={data.rateInfoVo}/>
                    </Card>
                    <Card
                        title={<span>个体结算信息 <span className="tip">个体结算信息必须整组填写（对公结算信息同理），点击“开户行信息输入框查询结算银行”可以补全联行行号及开户行信息.</span></span>}
                        className="block">
                        <BillingPrivate getForm={f => this.billingInfoForm = f} data={data.billingInfoVo}/>
                    </Card>

                    <Card title="费用信息" className="block function-info">
                        <HappyPay
                            form={form}
                            data={data}
                            isAdd={isAdd}
                            isDetail={isDetail}
                            isModify={isModify}
                        />
                    </Card>
                    <Card title="其他信息" className="block function-info">
                        <SmallAndMicroImage getForm={f => this.imageInfoForm = f} data={data.imageInfoVo}/>
                    </Card>
                    <Button
                        disabled={isDetail}
                        loading={saving}
                        type="primary"
                        htmlType="submit" size="large">
                        {saving ? null : <FontIcon type="save"/>}
                        提交
                    </Button>
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
