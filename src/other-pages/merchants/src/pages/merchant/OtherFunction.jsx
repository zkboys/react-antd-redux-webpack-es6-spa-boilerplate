import React, {Component} from 'react';
import {Form, Checkbox, Tabs, InputNumber, Radio, Row, Col, Modal, Select} from 'antd';
import {ajax, event} from 'zk-react';
import {PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import OtherImage from './OtherImage.jsx';
import HappyPay from './HappyPay';
import validationRule from '../../commons/validation-rule';
import {checkboxGroupCheckOne} from './common';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
@ajax()
@event()
class LayoutComponent extends Component {
    state = {
        activeKey: '2',
        isOpenedsuiyitong: false,
        qrCodeRateTip: '二维码',
    }

    componentDidMount() {
        const {getFuncForm, form, $on} = this.props;
        getFuncForm(form);
        // 先显示第二个tab，然后切换到第一个，使第二个tab中的内容渲染，获取到form
        setTimeout(() => {
            this.setState({activeKey: '1'});
        }, 500);
        this.getOpenedSuiyitong();

        $on('merchants-business-classify-change', value => {
            let qrCodeRateTip = '二维码';
            if (value === '3' || value === '6') {
                qrCodeRateTip = '二维码/云闪付日常1000';
            }
            this.setState({qrCodeRateTip});
        });
    }

    getOpenedSuiyitong = () => {
        const {orgNo} = this.props;
        this.props.$ajax.get(`/func/isOpenedSuiyiTong/${orgNo}`).then(res => {
            if (res.resultCode === '1') {
                this.setState({isOpenedsuiyitong: true});
            } else {
                this.setState({isOpenedsuiyitong: false});
            }
            /* TODO
             该代理商尚未开通随意通！
             非一级代理商商户不允许随意通，请联系一级代理商管理员
             * */
        });
    }

    handleTabChange = (activeKey) => {
        this.setState({activeKey});
    }

    handleFunctionAcceptanceSettleChange = (value) => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        if (value && value.indexOf('2') > -1) {
            const fas2 = getFieldValue('settleType');
            if (fas2 && fas2.length) {
                return Modal.error({
                    title: '提示',
                    content: '预授权不能与随意通结算/非工作日结算/即日付 同时开通!',
                    onOk: () => {
                        setFieldsValue({functionAcceptanceSettle: value.filter(item => item !== '2')});
                    },
                });
            }
            const {getBaseInfoForm} = this.props;
            const baseInfoForm = getBaseInfoForm();
            const businessClassify = baseInfoForm.getFieldValue('businessClassify');
            if (businessClassify !== '1' && businessClassify !== '2') {
                return Modal.error({
                    title: '提示',
                    content: '预授权商户行业大类必须是 一般类或餐娱类!',
                    onOk: () => {
                        setFieldsValue({functionAcceptanceSettle: value.filter(item => item !== '2')});
                    },
                });
            }
            // 预授权商户行业大类必须是 一般类或餐娱类!
            // 预授权不能与随意通结算/非工作日结算/即日付 同时开通!
        }
    }

    handlesettleTypeChange = (value) => {
        const suiyitongKey = 'ifSuiYiTongSettle';
        const jirifuKey = 'ifIntradaySettle';
        const {getRateInfoForm} = this.props;
        const {getFieldValue, setFieldsValue} = this.props.form;
        const fas = getFieldValue('functionAcceptanceSettle');
        if (fas && fas.indexOf('2') > -1) {
            return Modal.error({
                title: '提示',
                content: '随意通结算/即日付/非工作日结算不能与预授权同时开通!',
                onOk: () => {
                    setFieldsValue({settleType: []});
                },
            });
        }

        const rateInfoForm = getRateInfoForm();
        const ifPosMd = rateInfoForm.getFieldValue('ifPosMd');
        if (ifPosMd && value.indexOf(suiyitongKey) > -1) {
            return Modal.error({
                title: '提示',
                content: '随意通结算 与 闪电到账-自动秒到不可同时开通!',
                onOk: () => {
                    setFieldsValue({settleType: value.filter(item => item !== suiyitongKey)});
                },
            });
        }

        if (ifPosMd && value.indexOf(jirifuKey) > -1) {
            return Modal.error({
                title: '提示',
                content: '即日付 与 闪电到账-自动秒到不可同时开通!',
                onOk: () => {
                    setFieldsValue({settleType: value.filter(item => item !== jirifuKey)});
                },
            });
        }

        if (
            (value && value.indexOf(suiyitongKey) === value.length - 1) // 选中的是随意通
            && value.indexOf(jirifuKey) > -1
        ) {
            return Modal.error({
                title: '提示',
                content: '随意通结算 与 即日付不可同时开通!',
                onOk: () => {
                    setFieldsValue({settleType: value.filter(item => item !== suiyitongKey)});
                },
            });
        }

        if (
            (value && value.indexOf(jirifuKey) === value.length - 1) // 选中的是即日付
            && value.indexOf(suiyitongKey) > -1
        ) {
            return Modal.error({
                title: '提示',
                content: '即日付 与 随意通不可同时开通!',
                onOk: () => {
                    setFieldsValue({settleType: value.filter(item => item !== jirifuKey)});
                },
            });
        }
        // TODO 默认账户非对私类型不允许开通即日付!
    }

    render() {
        // const {qrCodeRateTip} = this.state;
        const {
            form,
            form: {getFieldDecorator, getFieldValue},
            isAdd,
            isDetail,
            isModify,
            userCode,
            orgNo,
            data = {},
            imageInfoVo,
        } = this.props;
        const {activeKey, isOpenedsuiyitong} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const settlementOptions = [
            {label: '一般刷卡', value: '1'},
            {label: '预授权', value: '2'},
            {label: '在线退货', value: '3'},
        ];

        const settlement2Options = [
            {label: '随意通结算', value: 'ifSuiYiTongSettle', disabled: isDetail || !isOpenedsuiyitong},
            {label: '非工作日结算', value: 'ifNonworkdaySettle'},
            {label: '即日付', value: 'ifIntradaySettle'},
        ];
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const fas2 = getFieldValue('settleType');
        // 是否选中即日付
        const isIntradayPaySelected = fas2 && fas2.indexOf('ifIntradaySettle') > -1;
        const isSYTSelected = fas2 && fas2.indexOf('ifSuiYiTongSettle') > -1;

        const automaticSettleTimeOptions = [
            {label: '9时', value: '9'},
            {label: '10时', value: '10'},
            {label: '11时', value: '11'},
            {label: '12时', value: '12'},
            {label: '13时', value: '13'},
            {label: '14时', value: '14'},
            {label: '15时', value: '15'},
            {label: '16时', value: '16'},
            {label: '17时', value: '17'},
            {label: '20时', value: '20'},
        ];

        // 修改 详情数据回显
        let initSettleType = [];
        if (isAdd) initSettleType = ['ifNonworkdaySettle'];
        if (isModify || isDetail) {
            if (data.ifSuiYiTongSettle === 1) initSettleType.push('ifSuiYiTongSettle');
            if (data.ifNonworkdaySettle === 1) initSettleType.push('ifNonworkdaySettle');
            if (data.ifIntradaySettle === 1) initSettleType.push('ifIntradaySettle');
        }

        let initMaintainFeeOfPosAndWeiHuTong = [];
        if (data.feeInfomation === '1') initMaintainFeeOfPosAndWeiHuTong.push('ifMaintainFeeOfPos');
        if (data.feeInfomation === '2') initMaintainFeeOfPosAndWeiHuTong.push('ifWeiHuTong');
        return (
            <PageContent>
                <Tabs type="card" activeKey={activeKey} onChange={this.handleTabChange}>
                    <TabPane tab="功能信息" key="1" closable={false} className="function-info">
                        <h3>结算卡功能信息</h3>
                        <FormItem
                            {...formItemLayout}
                            label="功能受理"
                        >
                            {getFieldDecorator('functionAcceptanceSettle', {
                                initialValue: (data.functionAcceptanceSettle && data.functionAcceptanceSettle.split(',')) || ['1'],
                                onChange: this.handleFunctionAcceptanceSettleChange,
                                rules: [
                                    {
                                        required: true, message: '功能受理至少选择一项！',
                                    },
                                ],
                            })(
                                <CheckboxGroup options={settlementOptions} disabled={isDetail}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label=" "
                            colon={false}
                        >
                            {getFieldDecorator('settleType', {
                                initialValue: initSettleType,
                                onChange: this.handlesettleTypeChange,
                                rules: [
                                    {
                                        required: false, message: '',
                                    },
                                ],
                            })(
                                <CheckboxGroup options={settlement2Options} disabled={isDetail}/>
                            )}

                        </FormItem>
                        {
                            isSYTSelected ?
                                <div>
                                    <FormItem
                                        {...formItemLayout}
                                        label="随意通限额"
                                    >
                                        {getFieldDecorator('suiYiTongQuota', {
                                            initialValue: data.suiYiTongQuota || '10000',
                                            rules: [
                                                {
                                                    required: true, message: '随意通限额-不能为空.',
                                                },
                                            ],
                                        })(
                                            <Select placeholder="请选择随意通限额" disabled={isDetail} style={{width: 120}}>
                                                <Option value="10000">10,000元</Option>
                                                <Option value="20000">20,000元</Option>
                                                <Option value="50000">50,000元</Option>
                                                <Option value="100000">100,000元</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="随意通手续费"
                                    >
                                        {getFieldDecorator('suiYiTongCountrFee', {
                                            initialValue: data.suiYiTongCountrFee,
                                            rules: [
                                                {
                                                    required: true, message: '随意通手续费-不能为空.',
                                                },
                                                {
                                                    type: 'number', message: '请输入合法的数字.',
                                                },
                                                validationRule.numberWithTwoDecimal(),
                                                validationRule.numberRange(0, 1, '请输入一个介于 {min} 和 {max} 之间的值.'),
                                            ],
                                        })(
                                            <InputNumber min={0} max={1} step={0.01} disabled={isDetail} style={{width: 120}}/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="自动结算时间"
                                    >
                                        {getFieldDecorator('automaticSettleTime', {
                                            initialValue: data.automaticSettleTime && data.automaticSettleTime.split(','),
                                            rules: [],
                                        })(
                                            <CheckboxGroup options={automaticSettleTimeOptions} disabled={isDetail}/>
                                        )}
                                    </FormItem>
                                </div>
                                : null
                        }

                        {
                            isIntradayPaySelected ?
                                <FormItem
                                    {...formItemLayout}
                                    label="即日付手续费"
                                >
                                    {getFieldDecorator('intradayPayCounterFee', {
                                        initialValue: data.intradayPayCounterFee || 0.52,
                                        rules: [
                                            {
                                                required: true, message: '即日付手续费,不能为空！',
                                            },
                                            {
                                                type: 'number', message: '请输入合法的数字.',
                                            },
                                            validationRule.numberWithTwoDecimal(),
                                            validationRule.checkLimitJiRiFu('即日付手续费,请填写{min}到{max}之间的值.'),
                                        ],
                                    })(
                                        <InputNumber min={0.1} max={0.9} step={0.01} disabled={isDetail} style={{width: 120}}/>
                                    )}
                                </FormItem>
                                : null
                        }

                        <h3>费用信息</h3>

                        <FormItem
                            {...formItemLayout}
                            label=" "
                            colon={false}
                        >
                            {getFieldDecorator('maintainFeeOfPosAndWeiHuTong', {
                                onChange: (value) => checkboxGroupCheckOne(value, form, 'maintainFeeOfPosAndWeiHuTong'),
                                initialValue: initMaintainFeeOfPosAndWeiHuTong,
                                rules: [],
                            })(
                                <CheckboxGroup
                                    options={[
                                        {label: 'POS维护费', value: 'ifMaintainFeeOfPos'},
                                        {label: '维护通', value: 'ifWeiHuTong'},
                                    ]}
                                    disabled={isDetail}
                                />
                            )}
                        </FormItem>
                        {
                            getFieldValue('maintainFeeOfPosAndWeiHuTong') && getFieldValue('maintainFeeOfPosAndWeiHuTong').indexOf('ifMaintainFeeOfPos') > -1 ?
                                <FormItem
                                    {...formItemLayout}
                                    label=" "
                                    colon={false}
                                >
                                    <Row>
                                        <Col span={5}>
                                            {getFieldDecorator('posMaintainFeeType', {
                                                initialValue: data.posMaintainFeeType || '1',
                                                rules: [
                                                    {
                                                        required: true, message: '请至少选择一项扣费方式！',
                                                    },
                                                ],
                                            })(
                                                <RadioGroup disabled={isDetail}>
                                                    <Radio style={radioStyle} value="1">日累计扣费</Radio>
                                                    <Radio style={radioStyle} value="2">日非累积扣费</Radio>
                                                </RadioGroup>
                                            )}
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="收取金额"
                                            >
                                                {getFieldDecorator('maintainFeeOfPos', {
                                                    initialValue: data.maintainFeeOfPos,
                                                    rules: [
                                                        {
                                                            required: true, message: 'POS维护费,收取金额-不能为空.',
                                                        },
                                                        {
                                                            type: 'number', message: '请输入合法的数字.',
                                                        },
                                                        validationRule.numberWithTwoDecimal(),
                                                        validationRule.numberMinRange(0.01, 'POS维护费,收取金额-不可低于{min}元.'),
                                                        validationRule.numberMaxRange(15, 'POS维护费,收取金额-不可高于{max}元.'),
                                                    ],
                                                })(
                                                    <InputNumber min={0.01} max={15} step={0.01} disabled={isDetail}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                                : null
                        }
                        {
                            getFieldValue('maintainFeeOfPosAndWeiHuTong') && getFieldValue('maintainFeeOfPosAndWeiHuTong').indexOf('ifWeiHuTong') > -1 ?
                                <FormItem
                                    {...formItemLayout}
                                    label=" "
                                    colon={false}
                                >
                                    收取金额：
                                    {getFieldDecorator('collectAmount', {
                                        initialValue: data.collectAmount,
                                        rules: [
                                            {
                                                required: true, message: '维护通,收取金额-不能为空.',
                                            },
                                            {
                                                type: 'number', message: '请输入合法的数字.',
                                            },
                                            validationRule.numberWithTwoDecimal(),
                                            validationRule.numberMinRange(1, '维护通,收取金额-不可低于{min}元.'),
                                            validationRule.numberMaxRange(500, '维护通,收取金额-不可高于{max}元.'),
                                        ],
                                    })(
                                        <InputNumber min={1} max={500} step={0.01} disabled={isDetail}/>
                                    )}
                                </FormItem>
                                : null
                        }
                        <FormItem
                            {...formItemLayout}
                            label=" "
                            colon={false}
                        >
                            <Checkbox disabled checked/>
                            <span style={{paddingLeft: 0}}>其他消费</span>
                            {/* <span style={{color: '#d9d9d9'}}>
                             {qrCodeRateTip}
                             </span>
                             {getFieldDecorator('qrCodeRate', {
                             initialValue: data.qrCodeRate,
                             rules: [
                             {
                             required: false,
                             message: '输入值必须0.3~0.38之间，最多两位小数！',
                             },
                             validationRule.numberWithTwoDecimal(),
                             validationRule.numberRange(0.3, 0.38, '输入值必须{min}~{max}之间，最多两位小数！'),
                             ],
                             })(
                             <InputNumber min={0.3} max={0.38} step={0.01} disabled={isDetail}/>
                             )}
                             <span>0.3~0.38</span> */}
                        </FormItem>
                        <HappyPay
                            form={form}
                            data={data}
                            isAdd={isAdd}
                            isDetail={isDetail}
                            isModify={isModify}
                            userCode={userCode}
                            orgNo={orgNo}
                        />
                    </TabPane>
                    <TabPane tab="上传图片" key="2" closable={false}>
                        <OtherImage
                            getForm={this.props.getImageForm}
                            getBaseInfoForm={() => this.props.getBaseInfoForm()}
                            isDetail={isDetail}
                            imageInfoVo={imageInfoVo}
                        />
                    </TabPane>
                </Tabs>
            </PageContent>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
